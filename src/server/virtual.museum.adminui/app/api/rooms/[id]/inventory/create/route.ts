import { NextResponse } from 'next/server';
import { roomsRepository } from '@/lib/roomsRepository';
import { ErrorResponse, InventoryItemResponse } from '@/lib/types';
import { z } from 'zod';

// Extended error response with details field for validation errors
interface ValidationErrorResponse extends ErrorResponse {
  details?: z.ZodIssue[];
}

// Schema for validating the request body
const CreateInventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().default(""), // Default to empty string to avoid undefined
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
  rotation: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
  scale: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
});

/**
 * POST handler for /api/rooms/[id]/inventory/create
 * Creates a new inventory item with a topographical table for a room
 */
export async function POST(
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
    
    // Parse and validate request body
    const body = await request.json();
    
    try {
      const validatedData = CreateInventoryItemSchema.parse(body);
      
      // Create inventory item with topographical table
      const result = roomsRepository.createInventoryItemWithTopographicalTable(
        params.id,
        validatedData
      );
      
      // Return success response
      return NextResponse.json({
        success: true,
        inventoryItem: result.inventoryItem,
        topographicalTable: result.topographicalTable
      }, { status: 201 });
    } catch (validationError) {
      // Handle validation errors
      if (validationError instanceof z.ZodError) {
        const errorResponse: ValidationErrorResponse = {
          error: "Validation error",
          status: 400,
          details: validationError.errors
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }
      throw validationError;
    }
  } catch (error) {
    console.error(`Error creating inventory item for room with ID ${params.id}:`, error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
