# Vercel Deployment Checklist

Use this checklist to ensure a successful deployment to Vercel.

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Setup
- [ ] Have your backend API URL ready
- [ ] Access to Vercel dashboard
- [ ] Know where to set environment variables in Vercel

### 2. Backend Deployment (if not done yet)
- [ ] Backend API is deployed
- [ ] Backend API is accessible via HTTPS
- [ ] CORS is configured to allow your Vercel domain
- [ ] Backend health check endpoint works

### 3. Code Preparation
- [ ] Latest changes pulled from repository
- [ ] `vercel.json` does not contain `env` block with secrets
- [ ] `.gitignore` properly configured
- [ ] No sensitive data in repository

## 🚀 Deployment Steps

### Step 1: Connect Repository to Vercel
- [ ] Repository connected to Vercel
- [ ] Correct branch selected for deployment
- [ ] Build settings configured (should auto-detect for Next.js)

### Step 2: Configure Environment Variables
Navigate to: **Vercel Project** → **Settings** → **Environment Variables**

Add these variables:

#### NEXT_PUBLIC_API_URL
- [ ] Variable name: `NEXT_PUBLIC_API_URL`
- [ ] Value: `https://your-backend-api.com` (replace with actual URL)
- [ ] Environments: ✅ Production ✅ Preview ✅ Development

#### DJANGO_API_URL
- [ ] Variable name: `DJANGO_API_URL`
- [ ] Value: `https://your-backend-api.com` (same as above)
- [ ] Environments: ✅ Production ✅ Preview ✅ Development

### Step 3: Deploy
- [ ] Click "Deploy" or push a commit
- [ ] Wait for build to complete
- [ ] Check build logs for errors

## 🧪 Post-Deployment Testing

### 1. Basic Functionality
- [ ] Frontend loads without errors
- [ ] No console errors in browser
- [ ] All pages accessible

### 2. Environment Variables
- [ ] Open browser console
- [ ] Run: `console.log(process.env.NEXT_PUBLIC_API_URL)`
- [ ] Verify it shows your backend URL (not undefined)

### 3. API Connectivity
- [ ] Try uploading a test video
- [ ] Check network tab for API calls
- [ ] Verify API calls go to correct backend URL
- [ ] Check for CORS errors

### 4. Error Handling
- [ ] Test with invalid file types
- [ ] Test with oversized files
- [ ] Verify error messages display correctly

## ❌ Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| "Environment Variable references Secret" error | Removed from vercel.json - set vars in dashboard |
| API calls fail | Check `NEXT_PUBLIC_API_URL` is set correctly |
| CORS errors | Configure backend to allow Vercel domain |
| Build fails | Check build logs, verify all dependencies installed |
| 404 errors | Verify routing configuration |

## 📝 After Successful Deployment

- [ ] Test all major features
- [ ] Set up custom domain (optional)
- [ ] Configure analytics (optional)
- [ ] Set up monitoring/alerts
- [ ] Document your production URL
- [ ] Update README with live demo link

## 🔄 For Future Deployments

- [ ] Update environment variables if backend URL changes
- [ ] Test in preview environment before production
- [ ] Monitor build times and optimize if needed
- [ ] Keep dependencies up to date

## 📞 Support Resources

- **Quick Start**: See `VERCEL_QUICK_START.md`
- **Detailed Guide**: See `DEPLOYMENT.md`
- **Environment Setup**: See `ENV_SETUP.md`
- **Secret Fix Details**: See `VERCEL_SECRET_FIX.md`

---

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete | ❌ Failed

Current Deployment Status: _______________
