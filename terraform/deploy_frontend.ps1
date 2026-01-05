$ErrorActionPreference = "Stop"

Write-Host "Getting infrastructure details from Terraform..."
$api_url = terraform output -raw api_gateway_url
$bucket_name = terraform output -raw s3_bucket_name
# Get distribution ID from state since it's not an output
$dist_id = terraform show -json | ConvertFrom-Json | Select-Object -ExpandProperty values | Select-Object -ExpandProperty root_module | Select-Object -ExpandProperty resources | Where-Object { $_.address -eq "aws_cloudfront_distribution.s3_distribution" } | Select-Object -ExpandProperty values | Select-Object -ExpandProperty id

Write-Host "API Gateway URL: $api_url"
Write-Host "S3 Bucket: $bucket_name"
Write-Host "CloudFront ID: $dist_id"

if (-not $api_url -or -not $bucket_name -or -not $dist_id) {
    Write-Error "Failed to get necessary outputs from Terraform"
    exit 1
}

# Update Frontend Config
Write-Host "Updating frontend configuration..."
$configFile = "..\pages\dashboard\[[...slug]].tsx"
$content = Get-Content -LiteralPath $configFile
$newContent = $content -replace 'const API_BASE = ".*";', "const API_BASE = `"$api_url`";"
Set-Content -LiteralPath $configFile -Value $newContent

# Build
Push-Location ..
Write-Host "Building Next.js application..."
npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }

# Sync
Write-Host "Syncing to S3 ($bucket_name)..."
aws s3 sync out/ s3://$bucket_name --delete
if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }

# Invalidate
Write-Host "Invalidating CloudFront ($dist_id)..."
aws cloudfront create-invalidation --distribution-id $dist_id --paths "/*" --no-cli-pager
if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }

Pop-Location
Write-Host "Frontend Deployment Complete!"
