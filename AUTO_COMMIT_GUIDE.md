# Auto-Commit Guide

## 🚀 Quick Auto-Commit

After making any changes to your code, simply run:

### Option 1: NPM Script (Easiest)
```bash
npm run ac
```
or
```bash
npm run auto-commit
```

### Option 2: PowerShell Script
```powershell
.\auto-commit.ps1
```

### Option 3: Bash Script (Linux/Mac/Git Bash)
```bash
./auto-commit.sh
```

## ✨ What It Does

1. **Stages all changes** (`git add .`)
2. **Commits with timestamp** (e.g., "Auto-commit: 2024-01-15 14:30:25")
3. **Pushes to GitHub** (`git push origin main`)
4. **Vercel auto-deploys** (~1-2 minutes)

## 🔄 Auto-Push Hook

A git hook is set up to automatically push after every commit:
- **Location**: `.git/hooks/post-commit`
- **Behavior**: After you run `git commit`, it automatically runs `git push origin main`

## 📝 Manual Commits Still Work

You can still commit manually:
```bash
git add .
git commit -m "Your custom message"
# The hook will auto-push!
```

## 💡 Tips

- Use `npm run ac` for the fastest workflow
- The auto-commit includes a timestamp so you can track when changes were made
- All changes are automatically pushed to GitHub
- Vercel will deploy automatically after push

## ⚠️ Note

The git hook (post-commit) works automatically, but if you're on Windows and using PowerShell, you might need to use the `npm run ac` command instead for guaranteed auto-push.

