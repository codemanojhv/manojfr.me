#!/bin/bash
# Auto-commit and push script
# This script automatically commits all changes and pushes to GitHub

TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
MESSAGE="Auto-commit: $TIMESTAMP"

echo "🔄 Auto-committing changes..."

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
echo "✅ Successfully auto-committed and pushed!"
echo "🔄 Vercel will auto-deploy in ~1-2 minutes"

