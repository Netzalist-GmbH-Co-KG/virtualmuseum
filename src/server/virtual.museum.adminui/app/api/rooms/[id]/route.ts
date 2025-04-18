import { NextResponse } from 'next/server';
import { roomsRepository } from '@/lib/roomsRepository';
import { ErrorResponse, RoomResponse } from '@/lib/types';

/**
 * GET handler for /api/rooms/[id]
 * Retrieves a single room by ID with optional related data
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const includeInventoryItems = url.searchParams.get('includeInventoryItems') === 'true';
    const includeTenant = url.searchParams.get('includeTenant') === 'true';
    
    // Get room from repository
    const { id } = await params;
    const room = roomsRepository.getRoomById(id, includeInventoryItems, includeTenant);
    
    // Return 404 if room not found
    if (!room) {
      const errorResponse: ErrorResponse = {
        error: `Room with ID ${id} not found`,
        status: 404
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Return response
    const response: RoomResponse = { room };
    return NextResponse.json(response);
  } catch (error) {
    // Get the ID safely for error logging
    const id = params ? (await params).id : 'unknown';    
    console.error(`Error fetching room with ID ${id}:`, error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
