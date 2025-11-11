#!/bin/bash
# Quick Deploy Script - Push to GitHub (Vercel will auto-deploy)
# Usage: ./deploy.sh "Your commit message"

MESSAGE=${1:-"Update site"}

echo "🚀 Quick Deploy to GitHub (Vercel Auto-Deploy)"
echo ""

# Check if there are changes
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ No changes to commit"
    exit 0
fi

echo "📦 Staging changes..."
git add .

echo "💾 Committing changes..."
git commit -m "$MESSAGE"

echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "🔄 Vercel will automatically deploy in ~1-2 minutes"
echo ""
echo "Check deployment status: https://vercel.com/dashboard"

