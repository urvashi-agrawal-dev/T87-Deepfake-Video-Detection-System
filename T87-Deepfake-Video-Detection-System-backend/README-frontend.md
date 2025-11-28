# Deepfake Detection System - Modern Frontend

A modern, responsive web application for detecting deepfake videos using advanced AI and deep learning techniques.

## 🚀 Features

- **Modern UI/UX**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Drag & Drop Upload**: Intuitive video file upload with progress indicators
- **Real-time Processing**: Fast analysis with visual feedback
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Results**: Detailed visualization of analysis results
- **Vercel Ready**: Optimized for serverless deployment

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Dropzone** - File upload functionality
- **React Player** - Video playback
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications

### Backend (API Integration)
- **Serverless Functions** - Vercel Functions for API endpoints
- **FastAPI Ready** - Designed to integrate with FastAPI backend
- **Django Compatible** - Can work with existing Django backend

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd deepfake-detection-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Integration
The frontend is designed to work with a Django/FastAPI backend. Update the API endpoints in `app/api/predict/route.ts` to connect to your actual backend.

## 🎨 UI Components

### Main Features
- **Hero Section**: Eye-catching landing with animated logo
- **Feature Cards**: Highlight key capabilities
- **Upload Zone**: Drag-and-drop video upload
- **Sequence Length Selector**: Adjustable analysis parameters
- **Results Display**: Comprehensive analysis visualization
- **Video Player**: Integrated video playback with results

### Design System
- **Glass Morphism**: Modern frosted glass effects
- **Gradient Backgrounds**: Dynamic purple/pink gradients
- **Smooth Animations**: Micro-interactions and transitions
- **Responsive Grid**: Mobile-first responsive design

## 🚀 Deployment on Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Set `NEXT_PUBLIC_API_URL` in Vercel dashboard
   - Configure any other necessary environment variables

### Vercel Configuration
The `vercel.json` file includes:
- Build configuration for Next.js
- Function timeout settings
- Region optimization
- Environment variable mapping

## 🔌 API Integration

### Current API Structure
```
/api/predict - POST: Video analysis endpoint
/api/static/[...path] - GET: Static file serving
```

### Backend Requirements
Your backend should provide:
- Video file upload handling
- ML model inference
- Frame extraction and face detection
- Results with confidence scores
- Static file serving for processed media

## 📱 Responsive Design

- **Mobile**: < 768px - Single column, stacked layout
- **Tablet**: 768px - 1024px - Two-column layout
- **Desktop**: > 1024px - Full multi-column layout

## 🎯 Performance Optimizations

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Caching**: Static asset optimization
- **Bundle Analysis**: Optimized dependencies

## 🔒 Security Features

- **File Type Validation**: Only video files accepted
- **Size Limits**: Maximum file size enforcement
- **CSRF Protection**: Built-in Next.js security
- **Input Sanitization**: Type-safe API calls

## 🐛 Troubleshooting

### Common Issues
1. **Upload Fails**: Check file size and format
2. **API Errors**: Verify backend connection
3. **Build Fails**: Check TypeScript errors
4. **Deployment Issues**: Check Vercel logs

### Debug Mode
Enable debug mode by setting:
```env
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please:
- Check the documentation
- Search existing issues
- Create a new issue with detailed information
- Contact the development team

---

Built with ❤️ using Next.js and deployed on Vercel