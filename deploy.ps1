# Quick Deploy Script - Push to GitHub (Vercel will auto-deploy)
# Usage: .\deploy.ps1 "Your commit message"

param(
    [Parameter(Mandatory=$false)]
    [string]$message = "Update site"
)

Write-Host "🚀 Quick Deploy to GitHub (Vercel Auto-Deploy)" -ForegroundColor Cyan
Write-Host ""

# Check if there are changes
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
    exit 0
}

Write-Host "📦 Staging changes..." -ForegroundColor Yellow
git add .

Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m $message

Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "🔄 Vercel will automatically deploy in ~1-2 minutes" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check deployment status: https://vercel.com/dashboard" -ForegroundColor Gray

