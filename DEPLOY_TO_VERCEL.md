# Deploy to Vercel - Quick Guide

## Option 1: Deploy via Vercel Website (Recommended)

1. **Install Vercel CLI globally** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to your frontend folder**:
   ```bash
   cd "C:\Users\anoma\OneDrive\Desktop\Mantra Website working - Copy\Mantra\frontend"
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy your project**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose "yes" when asked if you want to deploy
   - The CLI will automatically detect your Vite project

## Option 2: Deploy via GitHub (Alternative)

1. **Push your frontend folder to GitHub**
2. **Go to [vercel.com](https://vercel.com)**
3. **Sign in with GitHub**
4. **Import your repository**
5. **Configure build settings**:
   - Framework Preset: Vite
   - Root Directory: `frontend/`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## What's Already Configured

✅ `vercel.json` - Vercel configuration file
✅ `package.json` - Build scripts are ready
✅ All data files in `/public` folder will be served correctly
✅ React Router will work with SPA redirects

## After Deployment

Your mantra app will be available at: `https://your-project-name.vercel.app`

All your JSON files will be accessible at:
- `/mantrasData.json`
- `/Lyrics_data/...`
- `/WORDTOWORD/...`

## Notes

- Your current setup is perfect for Vercel deployment
- No backend needed since all data is served as static files
- The word-to-word hover functionality will work perfectly
