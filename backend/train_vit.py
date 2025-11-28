"""
Training Script for Vision Transformer Deepfake Detector

This script shows how to train the model on deepfake datasets.
You need to download a dataset first (e.g., FaceForensics++, Celeb-DF)

Dataset Structure:
data/
├── train/
│   ├── real/
│   │   ├── video1.mp4
│   │   ├── video2.mp4
│   │   └── ...
│   └── fake/
│       ├── video1.mp4
│       ├── video2.mp4
│       └── ...
└── val/
    ├── real/
    └── fake/
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from pathlib import Path
import numpy as np
from tqdm import tqdm
import argparse

from vit_model import ViTDeepfakeDetector, get_vit_transform
from enhanced_processor import extract_frames_smart, detect_and_crop_faces

class DeepfakeVideoDataset(Dataset):
    """Dataset for loading deepfake videos"""
    
    def __init__(self, data_dir, num_frames=20, transform=None):
        self.data_dir = Path(data_dir)
        self.num_frames = num_frames
        self.transform = transform or get_vit_transform()
        
        # Find all videos
        self.videos = []
        self.labels = []
        
        # Real videos (label = 0)
        real_dir = self.data_dir / 'real'
        if real_dir.exists():
            for video_path in real_dir.glob('*.mp4'):
                self.videos.append(video_path)
                self.labels.append(0)
        
        # Fake videos (label = 1)
        fake_dir = self.data_dir / 'fake'
        if fake_dir.exists():
            for video_path in fake_dir.glob('*.mp4'):
                self.videos.append(video_path)
                self.labels.append(1)
        
        print(f"Found {len(self.videos)} videos ({sum(self.labels)} fake, {len(self.labels) - sum(self.labels)} real)")
    
    def __len__(self):
        return len(self.videos)
    
    def __getitem__(self, idx):
        video_path = str(self.videos[idx])
        label = self.labels[idx]
        
        try:
            # Extract frames
            frames, _ = extract_frames_smart(video_path, num_frames=self.num_frames)
            
            # Detect faces
            face_crops, _ = detect_and_crop_faces(frames, verify_with_eyes=False)
            
            # Limit to num_frames
            if len(face_crops) > self.num_frames:
                indices = np.linspace(0, len(face_crops) - 1, self.num_frames, dtype=int)
                face_crops = [face_crops[i] for i in indices]
            elif len(face_crops) < self.num_frames:
                # Pad with last frame
                while len(face_crops) < self.num_frames:
                    face_crops.append(face_crops[-1])
            
            # Transform
            tensors = []
            for face in face_crops:
                tensor = self.transform(face)
                tensors.append(tensor)
            
            # Stack into sequence
            sequence = torch.stack(tensors)  # (T, C, H, W)
            
            return sequence, label
            
        except Exception as e:
            print(f"Error loading {video_path}: {e}")
            # Return dummy data
            dummy = torch.zeros(self.num_frames, 3, 224, 224)
            return dummy, label

def train_epoch(model, dataloader, criterion, optimizer, device):
    """Train for one epoch"""
    model.train()
    total_loss = 0
    correct = 0
    total = 0
    
    pbar = tqdm(dataloader, desc='Training')
    for sequences, labels in pbar:
        sequences = sequences.to(device)
        labels = labels.to(device)
        
        # Forward pass
        optimizer.zero_grad()
        logits = model(sequences)
        loss = criterion(logits, labels)
        
        # Backward pass
        loss.backward()
        optimizer.step()
        
        # Statistics
        total_loss += loss.item()
        predictions = torch.argmax(logits, dim=1)
        correct += (predictions == labels).sum().item()
        total += labels.size(0)
        
        # Update progress bar
        pbar.set_postfix({
            'loss': f'{loss.item():.4f}',
            'acc': f'{100 * correct / total:.2f}%'
        })
    
    avg_loss = total_loss / len(dataloader)
    accuracy = 100 * correct / total
    
    return avg_loss, accuracy

def validate(model, dataloader, criterion, device):
    """Validate the model"""
    model.eval()
    total_loss = 0
    correct = 0
    total = 0
    
    with torch.no_grad():
        pbar = tqdm(dataloader, desc='Validation')
        for sequences, labels in pbar:
            sequences = sequences.to(device)
            labels = labels.to(device)
            
            # Forward pass
            logits = model(sequences)
            loss = criterion(logits, labels)
            
            # Statistics
            total_loss += loss.item()
            predictions = torch.argmax(logits, dim=1)
            correct += (predictions == labels).sum().item()
            total += labels.size(0)
            
            pbar.set_postfix({
                'loss': f'{loss.item():.4f}',
                'acc': f'{100 * correct / total:.2f}%'
            })
    
    avg_loss = total_loss / len(dataloader)
    accuracy = 100 * correct / total
    
    return avg_loss, accuracy

def main(args):
    """Main training function"""
    
    # Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Create datasets
    print("\nLoading datasets...")
    train_dataset = DeepfakeVideoDataset(
        args.train_dir,
        num_frames=args.num_frames
    )
    val_dataset = DeepfakeVideoDataset(
        args.val_dir,
        num_frames=args.num_frames
    )
    
    # Create dataloaders
    train_loader = DataLoader(
        train_dataset,
        batch_size=args.batch_size,
        shuffle=True,
        num_workers=args.num_workers
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=args.batch_size,
        shuffle=False,
        num_workers=args.num_workers
    )
    
    # Create model
    print("\nInitializing model...")
    model = ViTDeepfakeDetector(
        img_size=224,
        patch_size=16,
        embed_dim=384,
        depth=6,
        num_heads=6,
        dropout=0.1
    )
    model = model.to(device)
    
    # Loss and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(
        model.parameters(),
        lr=args.lr,
        weight_decay=args.weight_decay
    )
    
    # Learning rate scheduler
    scheduler = optim.lr_scheduler.CosineAnnealingLR(
        optimizer,
        T_max=args.epochs
    )
    
    # Training loop
    print(f"\nStarting training for {args.epochs} epochs...")
    best_val_acc = 0
    
    for epoch in range(args.epochs):
        print(f"\n{'='*60}")
        print(f"Epoch {epoch + 1}/{args.epochs}")
        print(f"{'='*60}")
        
        # Train
        train_loss, train_acc = train_epoch(
            model, train_loader, criterion, optimizer, device
        )
        
        # Validate
        val_loss, val_acc = validate(
            model, val_loader, criterion, device
        )
        
        # Update learning rate
        scheduler.step()
        
        # Print results
        print(f"\nResults:")
        print(f"  Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}%")
        print(f"  Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%")
        print(f"  Learning Rate: {scheduler.get_last_lr()[0]:.6f}")
        
        # Save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            checkpoint = {
                'epoch': epoch,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'val_acc': val_acc,
                'val_loss': val_loss
            }
            torch.save(checkpoint, 'models/model_best.pt')
            print(f"  ✓ Saved best model (Val Acc: {val_acc:.2f}%)")
        
        # Save checkpoint
        if (epoch + 1) % args.save_every == 0:
            checkpoint = {
                'epoch': epoch,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'val_acc': val_acc,
                'val_loss': val_loss
            }
            torch.save(checkpoint, f'models/checkpoint_epoch_{epoch+1}.pt')
            print(f"  ✓ Saved checkpoint")
    
    print(f"\n{'='*60}")
    print(f"Training complete!")
    print(f"Best validation accuracy: {best_val_acc:.2f}%")
    print(f"{'='*60}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Train Vision Transformer for Deepfake Detection')
    
    # Data
    parser.add_argument('--train_dir', type=str, default='data/train',
                        help='Training data directory')
    parser.add_argument('--val_dir', type=str, default='data/val',
                        help='Validation data directory')
    parser.add_argument('--num_frames', type=int, default=20,
                        help='Number of frames to extract per video')
    
    # Training
    parser.add_argument('--epochs', type=int, default=50,
                        help='Number of training epochs')
    parser.add_argument('--batch_size', type=int, default=4,
                        help='Batch size')
    parser.add_argument('--lr', type=float, default=0.0001,
                        help='Learning rate')
    parser.add_argument('--weight_decay', type=float, default=0.01,
                        help='Weight decay')
    parser.add_argument('--num_workers', type=int, default=2,
                        help='Number of data loading workers')
    parser.add_argument('--save_every', type=int, default=5,
                        help='Save checkpoint every N epochs')
    
    args = parser.parse_args()
    
    # Create models directory
    Path('models').mkdir(exist_ok=True)
    
    main(args)
