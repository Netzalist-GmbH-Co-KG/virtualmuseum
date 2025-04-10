import { NextResponse } from 'next/server';
import { roomsRepository } from '@/lib/roomsRepository';
import { ErrorResponse, RoomsResponse } from '@/lib/types';

/**
 * GET handler for /api/rooms
 * Retrieves all rooms with optional related data
 */
export async function GET(request: Request) {
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const includeInventoryItems = url.searchParams.get('includeInventoryItems') === 'true';
    const includeTenant = url.searchParams.get('includeTenant') === 'true';
    
    // Get rooms from repository
    const rooms = roomsRepository.getAllRooms(includeInventoryItems, includeTenant);
    
    // Return response
    const response: RoomsResponse = { rooms };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
