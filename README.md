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
