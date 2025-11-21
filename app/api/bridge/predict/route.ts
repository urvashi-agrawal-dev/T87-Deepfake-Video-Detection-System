import { NextRequest, NextResponse } from 'next/server'

// This is a bridge API that connects the Next.js frontend to the Django backend
// In production, you would want to deploy the Django backend separately and update this URL

const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Forward the request to Django backend
    const response = await fetch(`${DJANGO_API_URL}/api/predict/`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for FormData, browser sets it with boundary
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
    console.error('Error in bridge API:', error)
    return NextResponse.json(
      { error: 'Failed to process video' },
      { status: 500 }
    )
  }
}