import { NextResponse } from 'next/server';
import { roomsRepository } from '@/lib/roomsRepository';
import { ErrorResponse } from '@/lib/types';
import { z } from 'zod';

// Validation schema for topic updates
const topicUpdateSchema = z.object({
  id: z.string(),
  topic: z.string(),
  description: z.string(),
  mediaFileImage2DId: z.string().nullable(),
  topographicalTableId: z.string()
});

/**
 * GET handler for /api/topics/[id]
 * Retrieves a single topic by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get topic from repository
    const { id } = await params;
    const topic = roomsRepository.getTopicsByTopographicalTableId(id);
    
    // Return 404 if topic not found
    if (!topic || topic.length === 0) {
      const errorResponse: ErrorResponse = {
        error: `Topic with ID ${id} not found`,
        status: 404
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Return response
    return NextResponse.json({
      topics: topic
    });
  } catch (error) {
    // Get the ID safely for error logging
    const id = params ? (await params).id : 'unknown';
    console.error(`Error fetching topic with ID ${id}:`, error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * PUT handler for /api/topics/[id]
 * Updates a topic by ID
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
    const validationResult = topicUpdateSchema.safeParse(body);
    
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
    
    // Update the topic
    const updatedTopic = roomsRepository.updateTopic(id, {
      topic: data.topic,
      description: data.description,
      mediaFileImage2DId: data.mediaFileImage2DId,
      topographicalTableId: data.topographicalTableId
    });
    
    // Return 404 if topic not found
    if (!updatedTopic) {
      const errorResponse: ErrorResponse = {
        error: `Topic with ID ${id} not found`,
        status: 404
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Return the updated topic
    return NextResponse.json({
      success: true,
      topic: updatedTopic
    });
  } catch (error) {
    // Get the ID safely for error logging
    const id = params ? (await params).id : 'unknown';
    console.error(`Error updating topic with ID ${id}:`, error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
