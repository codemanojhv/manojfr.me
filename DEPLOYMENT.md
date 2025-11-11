# Deployment Guide - Vercel

## ✅ Completed Steps
- ✅ Ninja star favicon created (`src/app/icon.svg`)
- ✅ Code pushed to GitHub: https://github.com/codemanojhv/manojfr.me.git
- ✅ Vercel auto-deployment configured (pushes to `main` branch auto-deploy)

## 🚀 Quick Deploy (Update Site)

### Method 1: PowerShell Script (Windows)
```powershell
.\deploy.ps1 "Your commit message"
```

### Method 2: NPM Script
```bash
npm run deploy
```

### Method 3: Manual Git Commands
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

**Note:** Once you push to GitHub, Vercel automatically deploys in ~1-2 minutes!

## 🚀 Initial Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended - Auto Deploys)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign in with your GitHub account (or create an account)

2. **Import Your Project**
   - Click "Add New" → "Project"
   - Import the repository: `codemanojhv/manojfr.me`
   - Vercel will auto-detect it's a Next.js project

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 1-2 minutes)
   - Your site will be live at: `https://manojfr-me.vercel.app`
   - You can add a custom domain later in project settings

5. **Auto-Deployments**
   - Every push to `main` branch will automatically trigger a new deployment
   - Preview deployments are created for pull requests

### Method 2: Vercel CLI (Alternative)

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select your project settings
   - Deploy to production with: `vercel --prod`

## 📝 Next Steps

- Your site will be live at the Vercel URL
- Add custom domain in Vercel project settings if needed
- **All future pushes to GitHub will auto-deploy automatically!**

## 🔄 Auto-Deployment Workflow

1. Make changes to your code
2. Run `npm run deploy` or `.\deploy.ps1 "Update message"`
3. Changes are pushed to GitHub
4. Vercel automatically detects the push
5. Site deploys in ~1-2 minutes
6. Done! 🎉

**No manual deployment needed - it's all automatic!**

## 🔗 Links

- **GitHub Repo**: https://github.com/codemanojhv/manojfr.me
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Project will be at**: https://manojfr-me.vercel.app (or custom domain)

