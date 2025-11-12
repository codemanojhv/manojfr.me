# Auto-commit and push script
# This script automatically commits all changes and pushes to GitHub
# Usage: .\auto-commit.ps1 or npm run ac

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$message = "Auto-commit: $timestamp"

Write-Host ""
Write-Host "🔄 Auto-committing changes..." -ForegroundColor Cyan
Write-Host ""

# Check if there are changes
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
    Write-Host ""
    exit 0
}

# Show what will be committed
Write-Host "📋 Changes to commit:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Stage all changes
Write-Host "📦 Staging changes..." -ForegroundColor Yellow
git add .

# Commit with timestamp
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m $message

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Successfully auto-committed and pushed!" -ForegroundColor Green
Write-Host "🔄 Vercel will auto-deploy in ~1-2 minutes" -ForegroundColor Cyan
Write-Host ""

