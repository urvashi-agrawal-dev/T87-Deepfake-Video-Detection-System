# Azure Deployment Guide (Student Account)

Complete guide to deploy this deepfake detection system on Azure using student credits.

## Prerequisites

- Azure Student Account ($100 free credits)
- GitHub account
- Project pushed to GitHub

## Architecture

```
Frontend (Azure Static Web Apps) → Backend (Azure Container Apps)
```

**Why this setup?**
- Static Web Apps: Free tier, perfect for Next.js
- Container Apps: Better than App Service for ML workloads
- Both work well with student credits

## Part 1: Deploy Backend (Azure Container Apps)

### Step 1: Prepare Backend

1. Create `backend/.dockerignore`:
```
__pycache__
*.pyc
*.pyo
*.pyd
.Python
venv/
temp_uploads/
processed_media/
models/*.pt
.env
```

2. Update `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create directories
RUN mkdir -p temp_uploads processed_media models

EXPOSE 8000

CMD ["python", "main.py"]
```

### Step 2: Deploy to Azure

**Option A: Using Azure Portal (Easier)**

1. Go to https://portal.azure.com
2. Click "Create a resource" → Search "Container Apps"
3. Click "Create"

**Basics:**
- Subscription: Azure for Students
- Resource Group: Create new "deepfake-detection-rg"
- Container App name: "deepfake-backend"
- Region: East US (cheapest)

**Container:**
- Use quickstart image: No
- Image source: Docker Hub or other registries
- Image: `python:3.11-slim` (temporary)
- CPU: 0.5 cores
- Memory: 1 GB

4. Click "Review + Create" → "Create"

5. After creation, we'll update with our code using GitHub Actions

**Option B: Using Azure CLI (Faster)**

```bash
# Install Azure CLI
# Windows: winget install Microsoft.AzureCLI
# Mac: brew install azure-cli

# Login
az login

# Create resource group
az group create --name deepfake-detection-rg --location eastus

# Create container app environment
az containerapp env create \
  --name deepfake-env \
  --resource-group deepfake-detection-rg \
  --location eastus

# We'll deploy the actual app via GitHub Actions
```

### Step 3: Setup GitHub Actions for Backend

1. In Azure Portal, go to your Container App
2. Click "Deployment" → "Continuous deployment"
3. Connect to GitHub
4. Select your repository
5. Branch: main
6. Dockerfile path: `backend/Dockerfile`
7. Click "Save"

This creates a GitHub Action that auto-deploys on push!

### Step 4: Configure Environment Variables

In Azure Portal:
1. Go to your Container App
2. Click "Containers" → "Environment variables"
3. Add:
   - `ALLOWED_ORIGINS`: `*` (or your frontend URL later)
   - `PORT`: `8000`

4. Click "Save"

### Step 5: Get Backend URL

1. Go to Container App → "Overview"
2. Copy "Application Url" (e.g., `https://deepfake-backend.azurecontainerapps.io`)
3. Test: `curl https://your-url/health`

## Part 2: Deploy Frontend (Azure Static Web Apps)

### Step 1: Prepare Frontend

1. Create `staticwebapp.config.json` in root:
```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "platform": {
    "apiRuntime": "node:18"
  }
}
```

2. Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.azurecontainerapps.io
```

### Step 2: Deploy via Azure Portal

1. Go to https://portal.azure.com
2. Click "Create a resource" → Search "Static Web App"
3. Click "Create"

**Basics:**
- Subscription: Azure for Students
- Resource Group: deepfake-detection-rg
- Name: deepfake-frontend
- Plan: Free
- Region: East US 2

**Deployment:**
- Source: GitHub
- Organization: Your GitHub username
- Repository: Your repo name
- Branch: main
- Build Presets: Next.js
- App location: `/`
- Api location: (leave empty)
- Output location: `out`

4. Click "Review + Create" → "Create"

### Step 3: Configure Build

Azure creates a GitHub Action. Update it:

`.github/workflows/azure-static-web-apps-xxx.yml`:
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.BACKEND_URL }}
      
      - name: Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "out"
```

### Step 4: Add GitHub Secrets

1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add secret:
   - Name: `BACKEND_URL`
   - Value: Your backend URL from Part 1

### Step 5: Update next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
```

## Part 3: Connect Everything

### Update CORS in Backend

In `backend/main.py`:
```python
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", 
    "https://your-frontend.azurestaticapps.net,http://localhost:3001"
).split(",")
```

### Test the Connection

1. Visit your Static Web App URL
2. Upload a test video
3. Check if it connects to backend

## Cost Breakdown (Student Account)

**Free Tier (Included):**
- Static Web Apps: Free (100GB bandwidth/month)
- Container Apps: First 180,000 vCPU-seconds free
- GitHub Actions: 2000 minutes/month free

**Estimated Monthly Cost:**
- Backend (0.5 vCPU, 1GB RAM, always on): ~$15-20
- Frontend: $0 (free tier)
- **Total: ~$15-20/month**

**Your $100 credit lasts: 5-6 months**

## Optimization Tips for Students

### 1. Use Consumption Plan (Save 50%)

Instead of always-on, use consumption:
```bash
az containerapp update \
  --name deepfake-backend \
  --resource-group deepfake-detection-rg \
  --min-replicas 0 \
  --max-replicas 1
```

This scales to zero when not used. Cost: ~$8/month

### 2. Use Smaller Container

In Dockerfile:
```dockerfile
FROM python:3.11-slim  # Already optimal
# Use CPU-only PyTorch (already in requirements.txt)
```

### 3. Set Auto-Shutdown

In Azure Portal → Container App → Scale:
- Min replicas: 0
- Max replicas: 1
- Scale rule: HTTP requests

### 4. Monitor Costs

1. Go to "Cost Management + Billing"
2. Set budget alert at $50
3. Get email when 80% spent

## Troubleshooting

### Backend won't start
```bash
# Check logs
az containerapp logs show \
  --name deepfake-backend \
  --resource-group deepfake-detection-rg \
  --follow
```

### Frontend build fails
- Check `next.config.js` has `output: 'export'`
- Verify `NEXT_PUBLIC_API_URL` is set
- Check GitHub Actions logs

### CORS errors
- Add frontend URL to `ALLOWED_ORIGINS` in backend
- Redeploy backend

### Out of memory
- Increase container memory to 2GB
- Or reduce `num_frames` in requests

## Alternative: Azure App Service (Simpler but More Expensive)

If Container Apps is complex:

**Backend:**
```bash
az webapp up \
  --name deepfake-backend \
  --runtime "PYTHON:3.11" \
  --sku B1
```

Cost: ~$13/month (B1 tier)

**Frontend:** Same as above (Static Web Apps)

## Quick Deploy Script

Save as `deploy-azure.sh`:
```bash
#!/bin/bash

# Variables
RG="deepfake-detection-rg"
LOCATION="eastus"
BACKEND_NAME="deepfake-backend"
FRONTEND_NAME="deepfake-frontend"

# Login
az login

# Create resource group
az group create --name $RG --location $LOCATION

# Deploy backend (Container Apps)
az containerapp up \
  --name $BACKEND_NAME \
  --resource-group $RG \
  --location $LOCATION \
  --source ./backend \
  --target-port 8000 \
  --ingress external

# Get backend URL
BACKEND_URL=$(az containerapp show \
  --name $BACKEND_NAME \
  --resource-group $RG \
  --query properties.configuration.ingress.fqdn \
  -o tsv)

echo "Backend URL: https://$BACKEND_URL"
echo "Now deploy frontend via Azure Portal and use this URL"
```

## Summary

1. **Backend**: Azure Container Apps (~$15/month, scales to zero)
2. **Frontend**: Azure Static Web Apps (Free)
3. **Total**: ~$15/month = 6 months with student credits
4. **Deploy time**: 30 minutes
5. **Auto-deploy**: GitHub Actions on push

Your deepfake detection system will be live at:
- Frontend: `https://deepfake-frontend.azurestaticapps.net`
- Backend: `https://deepfake-backend.azurecontainerapps.io`

Good luck with your project! 🚀
