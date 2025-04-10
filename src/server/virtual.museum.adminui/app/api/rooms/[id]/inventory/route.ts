import { NextResponse } from 'next/server';
import { roomsRepository } from '@/lib/roomsRepository';
import { ErrorResponse, InventoryItemsResponse } from '@/lib/types';

/**
 * GET handler for /api/rooms/[id]/inventory
 * Retrieves all inventory items for a specific room
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get ID from params
    const { id } = await params;
    
    // Check if room exists
    const room = roomsRepository.getRoomById(id);
    
    // Return 404 if room not found
    if (!room) {
      const errorResponse: ErrorResponse = {
        error: `Room with ID ${id} not found`,
        status: 404
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Get inventory items for the room
    const inventoryItems = roomsRepository.getInventoryItemsByRoomId(id);
    
    // Return response
    const response: InventoryItemsResponse = { inventoryItems };
    return NextResponse.json(response);
  } catch (error) {
    // Get the ID safely for error logging
    const id = params ? (await params).id : 'unknown';
    console.error(`Error fetching inventory items for room with ID ${id}:`, error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
