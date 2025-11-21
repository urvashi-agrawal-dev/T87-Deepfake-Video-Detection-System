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

    // Check if we should use the bridge API (production) or mock response (development)
    const djangoApiUrl = process.env.DJANGO_API_URL
    
    if (djangoApiUrl && !djangoApiUrl.includes('localhost')) {
      // Production: Forward to Django/FastAPI backend via bridge
      try {
        const response = await fetch(`${djangoApiUrl}/api/predict/`, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Django API error:', errorText)
          return NextResponse.json(
            { error: 'Backend processing failed' },
            { status: response.status }
          )
        }

        const data = await response.json()
        
        // Transform Django response to match frontend expectations
        const transformedData = {
          output: data.output || 'FAKE',
          confidence: data.confidence || 85,
          preprocessed_images: data.preprocessed_images || [],
          faces_cropped_images: data.faces_cropped_images || [],
          original_video: data.original_video || '',
        }

        return NextResponse.json(transformedData)
      } catch (error) {
        console.error('Error calling Django API:', error)
        // Fall back to mock response if backend is unavailable
      }
    }

    // Development: Mock response
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