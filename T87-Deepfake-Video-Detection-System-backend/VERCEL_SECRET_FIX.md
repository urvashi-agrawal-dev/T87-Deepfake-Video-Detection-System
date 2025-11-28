# Vercel Secret Reference Fix

## 🐛 Problem

When deploying to Vercel, you encountered this error:

```
Environment Variable "NEXT_PUBLIC_API_URL" references Secret "next_public_api_url", which does not exist.
```

## 🔍 Root Cause

The `vercel.json` file was using Vercel's secret syntax (`@secret_name`) to reference environment variables:

```json
"env": {
  "NEXT_PUBLIC_API_URL": "@next_public_api_url",
  "DJANGO_API_URL": "@django_api_url"
}
```

This syntax is used to reference Vercel secrets, which are created separately using the Vercel CLI or dashboard. However, these secrets were not created in your project, causing the deployment to fail.

## ✅ Solution

The `env` block has been removed from `vercel.json`. Environment variables should now be set directly in the Vercel dashboard.

### Updated `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## 🚀 What You Need to Do

### 1. Set Environment Variables in Vercel Dashboard

1. Go to your Vercel project
2. Click on **Settings** → **Environment Variables**
3. Add these two variables:

| Variable Name | Value | Environments |
|---------------|-------|--------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-api.com` | ✅ Production<br>✅ Preview<br>✅ Development |
| `DJANGO_API_URL` | `https://your-backend-api.com` | ✅ Production<br>✅ Preview<br>✅ Development |

**Important**: Replace `https://your-backend-api.com` with your actual backend API URL.

### 2. Redeploy

After setting the environment variables:
- Click **Redeploy** from the deployments tab, or
- Push a new commit to trigger a deployment

## 📚 Why This Approach is Better

1. **No Secret Management**: Public API URLs don't need to be stored as secrets
2. **Easier Configuration**: Set variables directly in the dashboard without CLI commands
3. **Environment Flexibility**: Different values for Production, Preview, and Development
4. **Better Visibility**: Variables are visible in the dashboard for easy management
5. **No Deployment Errors**: Avoids the "secret does not exist" error

## 🔐 When to Use Vercel Secrets

Vercel secrets (using `@secret_name` syntax) should only be used for:
- Database passwords
- API keys for external services
- Authentication tokens
- Other sensitive data that shouldn't be visible in the dashboard

For public API URLs like `NEXT_PUBLIC_API_URL`, regular environment variables are the recommended approach.

## 🧪 Verify the Fix

After redeploying:

1. **Check Build Logs**: Should see no environment variable errors
2. **Test the Application**: Upload a video to verify API connectivity
3. **Browser Console**: Run `console.log(process.env.NEXT_PUBLIC_API_URL)` to verify the variable is set

## 📖 Additional Resources

- [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md) - Quick deployment guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive deployment documentation
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variable reference

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Clear Cache**: Try clearing the build cache in Vercel settings
2. **Check Variable Names**: Ensure exact spelling and capitalization
3. **Verify Backend**: Make sure your backend is deployed and accessible
4. **Check CORS**: Ensure backend allows requests from your Vercel domain

For more help, see the troubleshooting section in [DEPLOYMENT.md](./DEPLOYMENT.md).
