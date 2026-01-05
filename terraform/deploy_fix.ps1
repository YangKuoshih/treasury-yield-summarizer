$envPath = "..\.env.local"
if (Test-Path $envPath) {
    $lines = Get-Content $envPath
    foreach ($line in $lines) {
        if ($line -match "^FRED_API_KEY=(.*)") {
            $env:TF_VAR_fred_api_key = $matches[1].Trim()
            Write-Host "Found FRED_API_KEY"
        }
        if ($line -match "^GITHUB_TOKEN=(.*)") {
            $env:TF_VAR_github_token = $matches[1].Trim()
            Write-Host "Found GITHUB_TOKEN"
        }
    }
} else {
    Write-Error ".env.local not found at $envPath"
    exit 1
}

if (-not $env:TF_VAR_fred_api_key) {
    Write-Error "FRED_API_KEY not found in .env.local"
    exit 1
}

Write-Host "Running Terraform Apply..."
terraform apply -auto-approve -input=false
if ($LASTEXITCODE -ne 0) {
    Write-Error "Terraform Apply Failed"
    exit $LASTEXITCODE
}
Write-Host "Terraform Apply Success"
