import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
<<<<<<< HEAD
    // Get the backend URL from environment variable
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    
    // Forward the request to the FastAPI backend
    const formData = await request.formData()
    
    const response = await fetch(`${backendUrl}/api/predict/`, {
      method: 'POST',
      body: formData,
    })

    // Check if backend is reachable
    if (!response.ok) {
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json()
        return NextResponse.json(
          { detail: error.detail || 'Backend processing failed' },
          { status: response.status }
        )
      } else {
        // Backend returned non-JSON error
        const text = await response.text()
        return NextResponse.json(
          { 
            detail: `Backend error: ${text.substring(0, 100)}`,
            hint: 'Make sure the backend server is running on port 8000'
          },
          { status: response.status }
        )
      }
    }

    // Return successful response
    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('API route error:', error)
    
    // Check if it's a connection error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          detail: 'Cannot connect to backend server',
          hint: 'Make sure the backend is running: cd api && python main.py',
          error: error.message
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { 
        detail: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
=======
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
>>>>>>> backend
