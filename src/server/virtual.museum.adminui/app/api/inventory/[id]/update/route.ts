import { NextResponse } from 'next/server';
import { roomsRepository } from '@/lib/roomsRepository';
import { ErrorResponse, InventoryItemUpdateSchema } from '@/lib/types';

/**
 * PUT handler for /api/inventory/[id]/update
 * Updates an inventory item by ID
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get inventory item from repository to check if it exists
    const existingItem = roomsRepository.getInventoryItemById(params.id);
    
    // Return 404 if item not found
    if (!existingItem) {
      const errorResponse: ErrorResponse = {
        error: `Inventory item with ID ${params.id} not found`,
        status: 404
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Parse and validate request body
    const body = await request.json();
    
    // Validate the request body against the schema
    const validationResult = InventoryItemUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorResponse: ErrorResponse = {
        error: 'Invalid request data',
        validationErrors: validationResult.error.errors,
        status: 400
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Update the inventory item
    const updatedItem = roomsRepository.updateInventoryItem(params.id, validationResult.data);
    
    // Return updated item
    return NextResponse.json({
      success: true,
      inventoryItem: updatedItem
    });
  } catch (error) {
    console.error(`Error updating inventory item with ID ${params.id}:`, error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
