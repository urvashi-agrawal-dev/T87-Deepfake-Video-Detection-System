# Deploying to Vercel

This guide will help you deploy the deepfake detection system to Vercel.

## 🏗️ Architecture Overview

The system consists of:
- **Frontend**: Next.js application (deployed to Vercel)
- **Backend API**: FastAPI service (deployed separately)
- **ML Processing**: PyTorch model inference

## 📋 Prerequisites

1. Vercel account
2. GitHub repository with the code
3. Backend API deployed (Railway, DigitalOcean, etc.)

## 🚀 Deployment Steps

### 1. Deploy Frontend to Vercel

1. **Connect your GitHub repository** to Vercel

2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables** in Vercel dashboard:
   
   Go to your Vercel project settings → Environment Variables and add:
   
   | Variable Name | Value | Environment |
   |---------------|-------|-------------|
   | `NEXT_PUBLIC_API_URL` | `https://your-backend-api.com` | Production, Preview, Development |
   | `DJANGO_API_URL` | `https://your-backend-api.com` | Production, Preview, Development |

   **Important Notes**:
   - Replace `https://your-backend-api.com` with your actual backend API URL
   - `NEXT_PUBLIC_API_URL` must be set for the frontend to communicate with the backend
   - `DJANGO_API_URL` is used by the Next.js API routes to communicate with your backend service
   - Make sure to select all environments (Production, Preview, Development) for each variable
   - Variables starting with `NEXT_PUBLIC_` are exposed to the browser
   - Do NOT use the @ syntax (e.g., @secret_name) in the vercel.json file - set variables directly in the dashboard

4. **Deploy** - Vercel will automatically build and deploy

### 2. Deploy Backend API

Choose one of the following options:

#### Option A: Railway (Recommended)
1. Connect your GitHub repository to Railway
2. Use the `api/` directory as root
3. Set environment variables
4. Deploy

#### Option B: DigitalOcean App Platform
1. Create a new app
2. Connect GitHub repository
3. Use Dockerfile configuration
4. Deploy

#### Option C: Vercel Serverless Functions
1. Move FastAPI code to `api/` directory
2. Update `vercel.json` configuration
3. Deploy as serverless functions

### 3. Configure CORS

Update your FastAPI backend CORS settings:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-vercel-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🔧 Vercel Configuration

The `vercel.json` file includes:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## 📊 Performance Optimization

1. **Enable Edge Functions** for faster global response
2. **Configure Custom Domains** for branding
3. **Set up Analytics** for monitoring
4. **Enable Image Optimization** in Next.js config

## 🔍 Testing the Deployment

1. **Visit your Vercel URL**
2. **Test video upload functionality**
3. **Verify API connectivity**
4. **Check ML processing pipeline**

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variable Errors**
   
   **Error: "Environment Variable references Secret which does not exist"**
   - This means the `vercel.json` file has been updated to not use secrets
   - Go to Vercel dashboard → Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` and `DJANGO_API_URL` directly (without @ syntax)
   - Redeploy your application
   
   **Other environment variable issues:**
   - Ensure both `NEXT_PUBLIC_API_URL` and `DJANGO_API_URL` are set in Vercel dashboard
   - Verify the URLs point to your deployed backend (not localhost)
   - Check that variable names match exactly (case-sensitive)
   - Make sure variables are set for all environments (Production, Preview, Development)

2. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend API URL

3. **Build Failures**
   - Check `npm install` logs
   - Verify TypeScript errors

4. **API Timeouts**
   - Increase function timeout in `vercel.json`
   - Optimize ML processing time

5. **File Upload Issues**
   - Check file size limits
   - Verify multipart form handling

### Debug Mode

Add debug logging:

```javascript
// In frontend
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)

// In backend
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📈 Scaling Considerations

1. **Database**: Add PostgreSQL for persistent storage
2. **CDN**: Use Vercel's Edge Network
3. **Monitoring**: Set up error tracking
4. **Analytics**: Implement user behavior tracking

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit secrets
2. **API Keys**: Use Vercel environment variables
3. **File Validation**: Implement strict file type checking
4. **Rate Limiting**: Add API rate limiting
5. **HTTPS**: Ensure all endpoints use HTTPS

## 💰 Cost Optimization

1. **Vercel Pro**: For advanced features
2. **Backend Hosting**: Choose cost-effective provider
3. **CDN**: Leverage Vercel's Edge Network
4. **Image Optimization**: Reduce bandwidth costs

## 📝 Next Steps

1. Set up custom domain
2. Configure SSL certificates
3. Implement user authentication
4. Add analytics and monitoring
5. Optimize for mobile performance

## 🆘 Support

For deployment issues:
- Check Vercel deployment logs
- Review API server logs
- Test API endpoints independently
- Verify environment variables

---

Your deepfake detection system is now ready for production! 🎉