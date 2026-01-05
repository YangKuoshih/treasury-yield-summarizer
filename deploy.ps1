# Deploy Backend (Terraform)
Write-Host "Deploying backend infrastructure..."
Push-Location terraform
terraform apply -auto-approve
if ($LASTEXITCODE -ne 0) {
    Write-Error "Backend deployment failed"
    Pop-Location
    exit 1
}
Pop-Location

# Deploy Frontend to CloudFront
Write-Host "Building Next.js application..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed"
    exit 1
}

Write-Host "Syncing to S3..."
aws s3 sync out/ s3://treasury-yield-summarizer-website-975ca96c --delete
if ($LASTEXITCODE -ne 0) {
    Write-Error "S3 sync failed"
    exit 1
}

Write-Host "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id E3ICTNDCS9F468 --paths "/*" --no-cli-pager
if ($LASTEXITCODE -ne 0) {
    Write-Error "CloudFront invalidation failed"
    exit 1
}

Write-Host "Deployment complete!"
