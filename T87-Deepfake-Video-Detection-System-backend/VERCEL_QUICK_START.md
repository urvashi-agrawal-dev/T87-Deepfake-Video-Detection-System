# Vercel Quick Start Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository
4. Select this repository

### Step 2: Configure Environment Variables

**REQUIRED**: Set these environment variables in Vercel:

1. Go to your project settings → Environment Variables
2. Add the following variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
DJANGO_API_URL=https://your-backend-api-url.com
```

**Important**: 
- Select **all environments** (Production, Preview, Development) for each variable
- Replace `https://your-backend-api-url.com` with your actual backend URL
- If you don't have a backend deployed yet, you can use a placeholder and update it later

### Step 3: Deploy

Click "Deploy" - Vercel will automatically:
- Install dependencies
- Build the Next.js application
- Deploy to production

## ✅ Verify Deployment

1. Visit your Vercel URL (e.g., `your-project.vercel.app`)
2. Check that the homepage loads
3. Test video upload (requires backend to be deployed)

## 🔧 Common Issues

### "Environment Variable references Secret which does not exist"

**Solution**: 
- Environment variables must be set in the Vercel dashboard, not in `vercel.json`
- The `vercel.json` file has been updated to remove secret references
- Make sure to add both `NEXT_PUBLIC_API_URL` and `DJANGO_API_URL` in the dashboard

### "Failed to load API"

**Solution**:
- Check that `NEXT_PUBLIC_API_URL` is set correctly
- Verify your backend is deployed and accessible
- Check CORS settings on your backend

### Build Failures

**Solution**:
- Check the Vercel deployment logs
- Ensure all dependencies are listed in `package.json`
- Verify there are no TypeScript errors

## 📚 More Information

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
