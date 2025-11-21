# Deepfake Detection API - FastAPI Backend

FastAPI backend service for the deepfake detection system. This API handles video processing and ML model inference.

## 🚀 Features

- **FastAPI**: Modern, fast web framework for building APIs
- **CORS Support**: Cross-origin requests for Next.js frontend
- **File Upload**: Secure video file handling
- **ML Integration**: Ready for PyTorch model inference
- **Error Handling**: Comprehensive error responses
- **Type Safety**: Full type hints support

## 🛠️ Setup

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the API server**
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

## 📡 API Endpoints

### POST /api/predict/
Process video for deepfake detection.

**Request:**
- `upload_video_file`: Video file (multipart/form-data)
- `sequence_length`: Number of frames to analyze (default: 40)

**Response:**
```json
{
  "output": "REAL|FAKE",
  "confidence": 85,
  "preprocessed_images": ["url1", "url2", ...],
  "faces_cropped_images": ["url1", "url2", ...],
  "original_video": "url"
}
```

### GET /api/static/{file_path}
Serve processed media files.

## 🔧 Integration with Django ML Logic

To integrate your existing Django ML processing:

1. Copy your ML model loading logic from `Django_Application/ml_app/views.py`
2. Adapt the `process_video_with_ml_model` function
3. Update imports to work with FastAPI

## 🐳 Docker Deployment

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🔒 Security Notes

- File type validation
- Size limits (implement as needed)
- Temporary file cleanup
- CORS configuration for production

## 📦 Deployment Options

1. **Vercel Functions**: Serverless deployment
2. **Railway**: Container-based hosting
3. **DigitalOcean**: Droplet or App Platform
4. **AWS**: EC2 or Lambda
5. **Google Cloud**: Cloud Run or Compute Engine