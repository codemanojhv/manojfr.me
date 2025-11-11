# Deployment Guide - Vercel

## ✅ Completed Steps
- ✅ Ninja star favicon created (`src/app/icon.svg`)
- ✅ Code pushed to GitHub: https://github.com/codemanojhv/manojfr.me.git

## 🚀 Deploy to Vercel

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
- All future pushes to GitHub will auto-deploy

## 🔗 Links

- **GitHub Repo**: https://github.com/codemanojhv/manojfr.me
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Project will be at**: https://manojfr-me.vercel.app (or custom domain)

