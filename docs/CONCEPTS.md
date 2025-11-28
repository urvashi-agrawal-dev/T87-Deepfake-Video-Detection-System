# Core Concepts

## Frame Extraction

Videos are sequences of images (frames). A 30fps video has 30 frames per second.

**Why extract frames?**
- Processing every frame is slow
- Sampling gives representative view
- 20-30 frames is enough for detection

**Example:**
```
10-second video = 300 frames
Extract 30 frames = every 10th frame
```

## Face Detection

We need to isolate faces because deepfakes manipulate faces, not backgrounds.

**Process:**
1. Find face location in frame
2. Crop face region
3. Resize to 224x224 pixels
4. Feed to model

**Why 224x224?**
- Standard size for image models
- Balance between detail and speed
- Matches Vision Transformer input

## Vision Transformer

Unlike traditional CNNs that look at small patches, ViT sees the whole face at once.

**How it works:**
1. Split image into 16x16 patches (196 total)
2. Each patch becomes a vector
3. Attention mechanism finds relationships
4. "Which patches are important?"

**Example:**
```
Eyes patch → looks at → Nose patch (high attention)
Eyes patch → looks at → Background (low attention)
```

## Temporal Analysis

Deepfakes often have inconsistencies between frames.

**What we check:**
- Frame-to-frame differences
- Sudden changes in lighting
- Unnatural transitions

**Real video:** Smooth changes  
**Fake video:** Jumpy, inconsistent

## Frequency Analysis

Uses DCT (Discrete Cosine Transform) to analyze compression patterns.

**Why it works:**
- Deepfakes are compressed twice (original + fake)
- Leaves traces in frequency domain
- Like looking at a photo under UV light

## Multi-Modal Fusion

Combines all signals for final decision:
- Spatial (ViT): 92% confidence
- Temporal: 65% consistency (suspicious)
- Frequency: High artifacts (suspicious)

Final: Adjust confidence based on warnings

## Training

Model learns by seeing examples:
- 5,000 real videos → "This is real"
- 5,000 fake videos → "This is fake"
- Repeat 50 times (epochs)
- Model learns patterns

**Without training:** Random guesses  
**After training:** 90-95% accuracy

## Why Mock Predictions?

Current model has random weights (not trained).

**Analogy:** Asking someone who never studied to take an exam - they'll guess.

**Solution:** Train on real deepfake datasets.
