import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')
  
  // For development, serve placeholder images
  if (path.includes('placeholder')) {
    // Create a simple SVG placeholder
    const svg = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${path.includes('frame') ? '#4B5563' : '#9333EA'}"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="10">
          ${path.split('-').pop()?.replace('.jpg', '')}
        </text>
      </svg>
    `
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  // In production, this would serve actual files from the Django backend
  return NextResponse.json({ error: 'Image not found' }, { status: 404 })
}