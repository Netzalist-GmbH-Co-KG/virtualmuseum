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
    // Check if room exists
    const room = roomsRepository.getRoomById(params.id);
    
    // Return 404 if room not found
    if (!room) {
      const errorResponse: ErrorResponse = {
        error: `Room with ID ${params.id} not found`,
        status: 404
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Get inventory items for the room
    const inventoryItems = roomsRepository.getInventoryItemsByRoomId(params.id);
    
    // Return response
    const response: InventoryItemsResponse = { inventoryItems };
    return NextResponse.json(response);
  } catch (error) {
    console.error(`Error fetching inventory items for room with ID ${params.id}:`, error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
