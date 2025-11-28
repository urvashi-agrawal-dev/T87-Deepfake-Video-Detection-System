# Training Guide

## Prerequisites

- GPU with 16GB+ VRAM (or use Google Colab)
- 10,000+ videos (5k real, 5k fake)
- 2-3 days training time

## Dataset Options

### 1. FaceForensics++ (Recommended)
- 1,000 real videos
- 4,000 fake videos (4 methods)
- Request access: https://github.com/ondyari/FaceForensics

### 2. Celeb-DF
- 590 real celebrity videos
- 5,639 deepfake videos
- Download: https://github.com/yuezunli/celeb-deepfakeforensics

### 3. DFDC (Kaggle)
- 100,000+ videos
- Competition dataset
- https://www.kaggle.com/c/deepfake-detection-challenge

## Setup

1. Download dataset
2. Organize structure:
```
data/
├── train/
│   ├── real/
│   │   ├── video1.mp4
│   │   └── video2.mp4
│   └── fake/
│       ├── video1.mp4
│       └── video2.mp4
└── val/
    ├── real/
    └── fake/
```

## Training

```bash
cd backend

python train_vit.py \
  --train_dir ../data/train \
  --val_dir ../data/val \
  --epochs 50 \
  --batch_size 4 \
  --lr 0.0001 \
  --num_frames 20
```

## Parameters

- `--epochs`: Training iterations (50 recommended)
- `--batch_size`: Videos per batch (4 for 16GB GPU)
- `--lr`: Learning rate (0.0001 works well)
- `--num_frames`: Frames per video (20 for speed)

## Monitoring

Training shows progress:
```
Epoch 1/50
Training: 100%|████| 200/200 [15:23, loss=0.62, acc=65%]
Validation: 100%|████| 50/50 [03:45, loss=0.59, acc=68%]
✓ Saved best model
```

## Expected Results

- Epoch 1: ~65% accuracy
- Epoch 10: ~82% accuracy
- Epoch 50: ~92% accuracy

## Using Trained Model

Model saves to `models/model_best.pt`

Restart server - it auto-loads the trained model.

## Google Colab (Free GPU)

If no local GPU:

1. Upload code to Google Drive
2. Open Colab notebook
3. Mount Drive
4. Run training script
5. Download trained model

## Tips

- Start with 1,000 videos to test
- Use smaller model if out of memory
- Monitor GPU usage
- Save checkpoints every 5 epochs
