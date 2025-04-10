import { NextResponse } from 'next/server';
import { roomsRepository } from '@/lib/roomsRepository';
import { ErrorResponse } from '@/lib/types';

/**
 * GET handler for /api/inventory/[id]
 * Retrieves a single inventory item by ID with its related data
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get inventory item from repository
    const { id } = await params;
    const inventoryItem = roomsRepository.getInventoryItemById(id);
    
    // Return 404 if item not found
    if (!inventoryItem) {
      const errorResponse: ErrorResponse = {
        error: `Inventory item with ID ${params.id} not found`,
        status: 404
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Get room data
    const room = roomsRepository.getRoomById(inventoryItem.RoomId);
    
    // Get topographical table if this is a topographical table
    let topographicalTable = null;
    let topics: any[] = [];
    
    if (inventoryItem.InventoryType === 1) { // Topographical Table
      topographicalTable = roomsRepository.getTopographicalTableByInventoryItemId(params.id);
      
      if (topographicalTable) {
        topics = roomsRepository.getTopicsByTopographicalTableId(topographicalTable.Id);
      }
    }
    
    // Return response
    return NextResponse.json({
      inventoryItem,
      room,
      topographicalTable,
      topics
    });
  } catch (error) {
    console.error(`Error fetching inventory item with ID ${params.id}:`, error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
