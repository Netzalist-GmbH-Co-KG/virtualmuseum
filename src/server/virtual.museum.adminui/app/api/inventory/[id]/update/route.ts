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
    // Get ID from params
    const { id } = await params;
    
    // Get inventory item from repository to check if it exists
    const existingItem = roomsRepository.getInventoryItemById(id);
    
    // Return 404 if item not found
    if (!existingItem) {
      const errorResponse: ErrorResponse = {
        error: `Inventory item with ID ${id} not found`,
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
    const updatedItem = roomsRepository.updateInventoryItem(id, validationResult.data);
    
    // Return updated item
    return NextResponse.json({
      success: true,
      inventoryItem: updatedItem
    });
  } catch (error) {
    // Get the ID safely for error logging
    const id = params ? (await params).id : 'unknown';
    console.error(`Error updating inventory item with ID ${id}:`, error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
