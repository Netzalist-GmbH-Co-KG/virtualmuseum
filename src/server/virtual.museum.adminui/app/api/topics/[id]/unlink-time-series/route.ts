import { NextResponse } from 'next/server';
import { timeSeriesRepository } from '@/lib/timeSeriesRepository';
import { ErrorResponse } from '@/lib/types';
import { z } from 'zod';

// Validation schema for unlinking time series from topics
const unlinkTimeSeriesSchema = z.object({
  timeSeriesId: z.string()
});

/**
 * POST handler for /api/topics/[id]/unlink-time-series
 * Unlinks a time series from a topic
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the topic ID from params
    const { id } = await params;
    
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    const validationResult = unlinkTimeSeriesSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorResponse: ErrorResponse = {
        error: `Invalid request body: ${validationResult.error.message}`,
        status: 400
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    const { timeSeriesId } = validationResult.data;
    
    // Unlink the time series from the topic
    try {
      const result = timeSeriesRepository.unlinkTimeSeriesFromTopic(id, timeSeriesId);
      return NextResponse.json({
        success: true,
        topicId: id,
        timeSeriesId
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    // Get the ID safely for error logging
    const id = params ? (await params).id : 'unknown';
    console.error(`Error unlinking time series from topic with ID ${id}:`, error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
