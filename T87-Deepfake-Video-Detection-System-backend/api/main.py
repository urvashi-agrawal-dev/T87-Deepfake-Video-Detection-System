from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import tempfile
import shutil
from typing import List
import uvicorn

# Import your existing Django ML logic here
# from ml_app.views import process_video  # You'll need to adapt this

app = FastAPI(title="Deepfake Detection API", version="1.0.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
os.makedirs("temp_uploads", exist_ok=True)
os.makedirs("processed_media", exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Deepfake Detection API is running"}

@app.post("/api/predict/")
async def predict_deepfake(
    upload_video_file: UploadFile = File(...),
    sequence_length: int = Form(40)
):
    """
    Process uploaded video for deepfake detection
    """
    try:
        # Validate file type
        if not upload_video_file.content_type.startswith('video/'):
            raise HTTPException(status_code=400, detail="File must be a video")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_file:
            shutil.copyfileobj(upload_video_file.file, temp_file)
            temp_file_path = temp_file.name
        
        try:
            # TODO: Integrate your existing Django ML processing logic here
            # This is where you'll call your ResNeXt+LSTM model
            result = await process_video_with_ml_model(temp_file_path, sequence_length)
            
            return result
            
        finally:
            # Clean up temporary file
            os.unlink(temp_file_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

async def process_video_with_ml_model(video_path: str, sequence_length: int) -> dict:
    """
    This is where you'll integrate your existing ML model logic
    """
    # TODO: Import and adapt your Django views.py logic here
    
    # For now, return a mock response
    import random
    
    # Mock processing - replace with your actual ML pipeline
    output = random.choice(["REAL", "FAKE"])
    confidence = random.randint(80, 99)
    
    # Mock image paths - replace with actual generated paths
    preprocessed_images = [f"/api/static/preprocessed_frame_{i}.jpg" for i in range(sequence_length)]
    faces_cropped_images = [f"/api/static/face_{i}.jpg" for i in range(sequence_length)]
    original_video = f"/api/static/uploaded_video.mp4"
    
    return {
        "output": output,
        "confidence": confidence,
        "preprocessed_images": preprocessed_images,
        "faces_cropped_images": faces_cropped_images,
        "original_video": original_video,
    }

@app.get("/api/static/{file_path:path}")
async def get_static_file(file_path: str):
    """
    Serve processed media files
    """
    file_location = os.path.join("processed_media", file_path)
    
    if not os.path.exists(file_location):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_location)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)