import { NextRequest, NextResponse } from 'next/server';
import { presentationRepository } from '@/lib/presentationRepository';
import { ErrorResponse } from '@/lib/types';

/**
 * GET handler for /api/presentations
 * Retrieves all multimedia presentations with item counts
 */
export async function GET(request: NextRequest) {
  try {
    // Get all presentations with item counts
    const presentations = presentationRepository.getAllPresentationsWithItemCounts();
    
    // Format the response
    const formattedPresentations = presentations.map(presentation => ({
      id: presentation.Id,
      name: presentation.Name || '',
      description: presentation.Description || '',
      itemsCount: presentation.ItemsCount,
      usageCount: presentation.UsageCount
    }));
    
    return NextResponse.json(formattedPresentations);
  } catch (error) {
    console.error('Error fetching presentations:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * POST handler for /api/presentations
 * Creates a new multimedia presentation
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    // Create the presentation
    const presentation = presentationRepository.createPresentation({
      Name: data.name,
      Description: data.description || null
    });
    
    // Format the response
    const formattedPresentation = {
      id: presentation.Id,
      name: presentation.Name || '',
      description: presentation.Description || '',
      itemsCount: 0
    };
    
    return NextResponse.json(formattedPresentation, { status: 201 });
  } catch (error) {
    console.error('Error creating presentation:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
