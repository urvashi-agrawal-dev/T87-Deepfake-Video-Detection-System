import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const videoFile = formData.get('upload_video_file') as File
    const sequenceLength = formData.get('sequence_length') as string

    if (!videoFile) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      )
    }

    // For now, simulate the API response
    // In production, this would call the actual Django/FastAPI backend
    const mockResponse = {
      output: Math.random() > 0.5 ? 'REAL' : 'FAKE',
      confidence: Math.floor(Math.random() * 20) + 80,
      preprocessed_images: Array.from({ length: parseInt(sequenceLength) }, (_, i) => 
        `/api/placeholder/frame-${i + 1}.jpg`
      ),
      faces_cropped_images: Array.from({ length: parseInt(sequenceLength) }, (_, i) => 
        `/api/placeholder/face-${i + 1}.jpg`
      ),
      original_video: URL.createObjectURL(videoFile),
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('Error processing video:', error)
    return NextResponse.json(
      { error: 'Failed to process video' },
      { status: 500 }
    )
  }
}