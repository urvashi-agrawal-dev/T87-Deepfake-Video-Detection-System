# Environment Variables Setup Guide

This document explains how to properly configure environment variables for the deepfake detection system.

## 📋 Required Environment Variables

### Frontend (Next.js)
These variables should be set in your Vercel dashboard for production or in `.env.local` for development.

```bash
# API URL for the backend service
NEXT_PUBLIC_API_URL=https://your-backend-api.com

# Django/FastAPI backend URL (used by server-side API routes)
DJANGO_API_URL=https://your-backend-api.com

# Optional: Model configuration
MODEL_PATH=/models
MAX_SEQUENCE_LENGTH=100
```

### Backend (FastAPI/Django)
These variables should be set in your backend service environment.

```bash
# Debug mode (set to False in production)
DEBUG=False

# Security (generate a strong secret key for production)
SECRET_KEY=your-very-secure-secret-key-here

# Allowed hosts (comma-separated)
ALLOWED_HOSTS=your-backend-api.com

# CORS settings (add your Vercel domain)
CORS_ORIGINS=https://your-vercel-app.vercel.app

# Model settings
MODEL_PATH=/models
DEFAULT_SEQUENCE_LENGTH=40
```

## 🚀 Setup Instructions

### Development Setup

1. Copy the example files:
   ```bash
   cp .env.example .env.local
   cp api/.env.example api/.env
   ```

2. Update `.env.local` with your local backend URL:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   DJANGO_API_URL=http://localhost:8000
   ```

3. Start the development servers:
   ```bash
   # Backend
   cd api && python main.py
   
   # Frontend (in another terminal)
   npm run dev
   ```

### Production (Vercel) Setup

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add the following variables:
     - `NEXT_PUBLIC_API_URL` = `https://your-backend-api.com`
     - `DJANGO_API_URL` = `https://your-backend-api.com`

2. **Backend Deployment**:
   - Deploy your FastAPI/Django backend to a service like Railway, DigitalOcean, or AWS
   - Set the backend environment variables as shown above
   - Configure CORS to allow your Vercel domain

3. **Verify Configuration**:
   - Check that both frontend and backend are using the same API URL
   - Test the connection by uploading a video file

## 🔧 Common Issues & Solutions

### Issue: "Environment variable not found" errors
**Solution**: 
- Ensure variables are set in Vercel dashboard (not just in `.env.local`)
- Check for exact variable name matching (case-sensitive)
- Redeploy after adding environment variables

### Issue: CORS errors in production
**Solution**:
- Update backend CORS settings to include your Vercel domain
- Ensure `NEXT_PUBLIC_API_URL` uses HTTPS in production
- Check that backend allows the specific HTTP methods you're using

### Issue: API calls failing in production
**Solution**:
- Verify `DJANGO_API_URL` is set correctly and accessible
- Check that your backend service is running and healthy
- Ensure the backend API endpoint paths match what the frontend expects

### Issue: Build failures
**Solution**:
- Check that all required environment variables have default values
- Ensure TypeScript compilation succeeds locally
- Verify all imports and dependencies are correct

## 📝 Environment Variable Reference

| Variable | Purpose | Required? | Example |
|----------|---------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | Frontend API calls | Yes | `https://api.example.com` |
| `DJANGO_API_URL` | Server-side API calls | Yes | `https://api.example.com` |
| `MODEL_PATH` | Model file location | Optional | `/models` |
| `DEBUG` | Backend debug mode | Backend | `False` |
| `SECRET_KEY` | Django security | Backend | `random-string-here` |
| `ALLOWED_HOSTS` | Django allowed hosts | Backend | `api.example.com` |
| `CORS_ORIGINS` | CORS allowed origins | Backend | `https://app.example.com` |

## 🧪 Testing Environment Variables

To test if your environment variables are working correctly:

1. **Frontend Test**:
   ```javascript
   // In your browser console
   console.log(process.env.NEXT_PUBLIC_API_URL)
   ```

2. **Backend Test**:
   ```python
   # In your backend logs
   import os
   print(f"Django API URL: {os.getenv('DJANGO_API_URL')}")
   ```

3. **End-to-End Test**:
   - Upload a test video
   - Check browser network tab for API calls
   - Verify the correct URLs are being used

For more deployment help, see [DEPLOYMENT.md](./DEPLOYMENT.md).