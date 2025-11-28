<<<<<<< HEAD
# Deepfake Video Detection System

A real-time deepfake detection system using Vision Transformer and temporal analysis. Built for my final year project.

## What It Does

Analyzes videos to detect if they're real or AI-generated deepfakes. Uses multiple detection methods:
- Vision Transformer for facial analysis
- Temporal consistency checking
- Frequency domain analysis
- Multi-scale face detection

## Tech Stack

**Frontend:** Next.js 14, React, TypeScript, Tailwind CSS  
**Backend:** FastAPI, PyTorch, OpenCV  
**ML Model:** Vision Transformer + Temporal Attention

## Quick Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- 4GB RAM minimum

### Installation

1. Clone and install dependencies:
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
npm install
```

2. Start servers:
```bash
# Backend (terminal 1)
cd backend
python main.py

# Frontend (terminal 2)
npm run dev
```

3. Open http://localhost:3001

## How It Works

### Frame Extraction
Videos are sampled at regular intervals. For a 10-second video at 30fps (300 frames), we extract 30 frames for analysis.

### Face Detection
Uses OpenCV Haar Cascades with multi-scale detection. Detected faces are cropped and resized to 224x224 for the model.

### Analysis Pipeline
1. **Spatial Analysis** - Vision Transformer examines facial features
2. **Temporal Analysis** - Checks consistency across frames
3. **Frequency Analysis** - DCT transform to detect compression artifacts
4. **Multi-Modal Fusion** - Combines all signals for final prediction

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI server
│   ├── vit_model.py         # Vision Transformer model
│   ├── enhanced_processor.py # Video processing
│   └── requirements.txt
├── app/
│   ├── page.tsx            # Main page
│   ├── components/         # React components
│   └── api/predict/        # API route
└── package.json
```

## Training (Optional)

The model needs training on deepfake datasets to work properly. Currently uses mock predictions.

To train:
1. Download FaceForensics++ dataset
2. Organize videos into `data/train/real` and `data/train/fake`
3. Run: `python backend/train_vit.py --epochs 50`

Expected accuracy after training: 90-95%

## API Usage

```bash
curl -X POST http://localhost:8000/api/predict/ \
  -F "file=@video.mp4" \
  -F "num_frames=30"
```

Response:
```json
{
  "output": "FAKE",
  "confidence": 87.5,
  "analysis": {
    "temporal_consistency": 65.8,
    "compression_artifacts": 24.7,
    "warning_flags": ["Temporal inconsistency detected"]
  }
}
```

## Deployment

See `AZURE_DEPLOY.md` for Azure deployment instructions.

## Known Issues

- Model requires training on real data (currently mock predictions)
- CPU inference is slow (3-5 seconds per video)
- Large videos (>100MB) may timeout

## Future Improvements

- [ ] Train on FaceForensics++ dataset
- [ ] Add GPU support
- [ ] Implement video streaming
- [ ] Add batch processing
- [ ] Improve face detection accuracy

## License

MIT

## Acknowledgments

- FaceForensics++ dataset
- PyTorch Vision Transformer implementation
- OpenCV for face detection
=======
# Deepfake Detection System - Complete Modern Implementation

A state-of-the-art deepfake detection system with a modern, responsive frontend and scalable backend architecture.

## 🎯 Project Overview

This project has been completely modernized with:
- **Next.js 14** frontend with TypeScript and Tailwind CSS
- **FastAPI** backend for high-performance ML inference
- **Vercel-ready** deployment configuration
- **Modern UI/UX** with glassmorphism design and smooth animations
- **Responsive design** that works on all devices

## 🏗️ New Architecture

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes (bridge functions)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── api/                   # FastAPI backend
│   ├── main.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
├── public/               # Static assets
├── package.json          # Node.js dependencies
├── vercel.json          # Vercel configuration
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git

### Setup (Automated)
```bash
chmod +x setup.sh
./setup.sh
```

### Setup (Manual)

1. **Install frontend dependencies**
   ```bash
   npm install
   ```

2. **Setup backend**
   ```bash
   cd api
   python3 -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

3. **Configure environment variables**
   ```bash
   # Copy example files
   cp .env.example .env.local
   cp api/.env.example api/.env

   # Edit the files with your configuration
   # For detailed instructions, see ENV_SETUP.md
   ```

   **Quick setup for development:**
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_API_URL=http://localhost:8000
   DJANGO_API_URL=http://localhost:8000

   # Backend (api/.env)
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   ```

4. **Run the applications**
   ```bash
   # Terminal 1: Backend
   cd api && source venv/bin/activate && python main.py
   
   # Terminal 2: Frontend
   npm run dev
   ```

5. **Open http://localhost:3000**

## 🎨 Frontend Features

### Modern UI Components
- **Glassmorphism Design**: Frosted glass effects with backdrop blur
- **Gradient Backgrounds**: Dynamic purple/pink gradients
- **Smooth Animations**: Framer Motion for micro-interactions
- **Responsive Layout**: Mobile-first design approach

### Key Features
- **Drag & Drop Upload**: Intuitive video file upload
- **Real-time Preview**: Video preview before processing
- **Progress Indicators**: Visual feedback during processing
- **Interactive Results**: Detailed analysis visualization
- **Confidence Scores**: Clear result presentation

### Technology Stack
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Dropzone** for file uploads
- **React Player** for video playback
- **Lucide React** for icons

## 🔧 Backend Features

### FastAPI Implementation
- **High Performance**: ASGI server with Uvicorn
- **Type Safety**: Full type hints
- **Auto Documentation**: OpenAPI/Swagger UI
- **CORS Support**: Cross-origin requests
- **Error Handling**: Comprehensive error responses

### API Endpoints
- `POST /api/predict/` - Video analysis
- `GET /api/static/{file_path}` - Static file serving
- `GET /docs` - API documentation

### ML Integration Ready
The backend is structured to easily integrate your existing PyTorch models:
- ResNeXt + LSTM architecture support
- Face detection and cropping
- Frame extraction and preprocessing
- Model inference pipeline

## 🚀 Deployment

### Vercel Deployment (Frontend)

1. **Connect GitHub Repository** to Vercel
2. **Configure Build Settings**:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Set Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   DJANGO_API_URL=https://your-backend-url.com
   ```

4. **Deploy** - Vercel handles the rest!

### Backend Deployment Options

#### Option 1: Railway (Recommended)
```bash
# Deploy to Railway
railway login
railway init
railway up
```

#### Option 2: DigitalOcean App Platform
1. Create new app
2. Connect GitHub repo
3. Use Dockerfile configuration
4. Deploy

#### Option 3: Vercel Serverless
Move API code to `api/` directory and deploy as serverless functions

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px - Single column layout
- **Tablet**: 768px - 1024px - Two columns
- **Desktop**: > 1024px - Full multi-column

### Mobile Optimizations
- Touch-friendly interface
- Optimized file uploads
- Responsive video player
- Adaptive typography

## 🔒 Security Features

### Frontend Security
- File type validation
- Size limit enforcement
- XSS protection
- CSRF protection

### Backend Security
- CORS configuration
- File type validation
- Temporary file cleanup
- Input sanitization

## 📊 Performance Optimizations

### Frontend
- Code splitting
- Image optimization
- Lazy loading
- Bundle optimization

### Backend
- Async processing
- Efficient file handling
- Memory optimization
- Fast inference

## 🎯 Key Improvements Over Original

### UI/UX Enhancements
✅ Modern, professional design  
✅ Glassmorphism effects  
✅ Smooth animations  
✅ Better visual hierarchy  
✅ Mobile-responsive layout  
✅ Improved accessibility  

### Technical Improvements
✅ TypeScript for type safety  
✅ Next.js App Router  
✅ Serverless-ready architecture  
✅ Better error handling  
✅ Performance optimizations  
✅ Modern development workflow  

### Deployment Benefits
✅ Vercel-native deployment  
✅ Global CDN distribution  
✅ Automatic HTTPS  
✅ Custom domain support  
✅ Edge functions support  
✅ Built-in analytics  

## 🔍 Testing

### Frontend Testing
```bash
npm run lint
npm run build
```

### Backend Testing
```bash
cd api
python -m pytest
```

### Integration Testing
1. Test file upload functionality
2. Verify API connectivity
3. Check ML processing pipeline
4. Validate result display

## 📈 Monitoring & Analytics

### Frontend
- Vercel Analytics
- Error tracking
- Performance metrics

### Backend
- Request logging
- Error monitoring
- Performance metrics
- Model inference time

## 🚀 Deployment

### Quick Deploy to Vercel

1. **Environment Variables** (Required for production)
   - See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions
   - Set in Vercel dashboard:
     - `NEXT_PUBLIC_API_URL=https://your-backend-api.com`
     - `DJANGO_API_URL=https://your-backend-api.com`

2. **Deploy Frontend**
   ```bash
   # Connect to Vercel and deploy
   vercel --prod
   ```

3. **Deploy Backend**
   - Deploy the `api/` directory to Railway, DigitalOcean, or AWS
   - Configure CORS to allow your Vercel domain

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Create an issue on GitHub
- 📖 Check the documentation
- 🚀 Review deployment guide
- 🔍 Check troubleshooting section

---

## 🎉 Ready to Deploy!

Your deepfake detection system is now:
- ✅ Modern and professional
- ✅ Mobile-responsive
- ✅ Vercel-ready
- ✅ Production-optimized
- ✅ Secure and scalable

**Deploy to Vercel now and share your amazing deepfake detection app with the world!** 🚀
>>>>>>> backend
