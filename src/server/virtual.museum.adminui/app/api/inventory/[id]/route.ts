import { NextResponse } from 'next/server';
import { roomsRepository } from '@/lib/roomsRepository';
import { timeSeriesRepository } from '@/lib/timeSeriesRepository';
import { ErrorResponse, TopographicalTableTopicWithRelations } from '@/lib/types';
import { z } from 'zod';

// Validation schema for inventory item updates
const inventoryItemUpdateSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  inventoryType: z.number(),
  roomId: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number()
  }),
  rotation: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number()
  }),
  scale: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number()
  })
});

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
        error: `Inventory item with ID ${id} not found`,
        status: 404
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Get room data
    const room = roomsRepository.getRoomById(inventoryItem.RoomId);
    
    // Get topographical table if this is a topographical table
    let topographicalTable = null;
    let topics: TopographicalTableTopicWithRelations[] = [];
    
    if (inventoryItem.InventoryType === 0) { // Topographical Table
      topographicalTable = roomsRepository.getTopographicalTableByInventoryItemId(id);
      
      if (topographicalTable) {
        topics = roomsRepository.getTopicsByTopographicalTableId(topographicalTable.Id);
        
        // Fetch time series for each topic
        for (const topic of topics) {
          try {
            const timeSeries = timeSeriesRepository.getTimeSeriesByTopicId(topic.Id);
            topic.TimeSeries = timeSeries;
          } catch (error) {
            console.warn(`Error fetching time series for topic ${topic.Id}:`, error);
            topic.TimeSeries = []; // Set empty array if there's an error
          }
        }
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
    // Get the ID safely for error logging
    const id = params ? (await params).id : 'unknown';
    console.error(`Error fetching inventory item with ID ${id}:`, error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * PUT handler for /api/inventory/[id]
 * Updates an inventory item by ID
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the ID from params
    const { id } = await params;
    
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    const validationResult = inventoryItemUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorResponse: ErrorResponse = {
        error: `Invalid request body: ${validationResult.error.message}`,
        status: 400
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    const data = validationResult.data;
    
    // Verify that the ID in the URL matches the ID in the body
    if (id !== data.id) {
      const errorResponse: ErrorResponse = {
        error: 'ID in URL does not match ID in request body',
        status: 400
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Update the inventory item
    const updatedItem = roomsRepository.updateInventoryItem(id, {
      Name: data.name,
      Description: data.description,
      PositionX: data.position.x,
      PositionY: data.position.y,
      PositionZ: data.position.z,
      RotationX: data.rotation.x,
      RotationY: data.rotation.y,
      RotationZ: data.rotation.z,
      ScaleX: data.scale.x,
      ScaleY: data.scale.y,
      ScaleZ: data.scale.z
    });
    
    // Return 404 if item not found
    if (!updatedItem) {
      const errorResponse: ErrorResponse = {
        error: `Inventory item with ID ${id} not found`,
        status: 404
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Return the updated item
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
