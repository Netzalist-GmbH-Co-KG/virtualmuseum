import { NextResponse } from 'next/server';
import { timeSeriesRepository } from '@/lib/timeSeriesRepository';
import { ErrorResponse } from '@/lib/types';
import { z } from 'zod';

// Validation schema for linking time series to topics
const linkTimeSeriesSchema = z.object({
  timeSeriesIds: z.array(z.string())
});

/**
 * POST handler for /api/topics/[id]/link-time-series
 * Links time series to a topic
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
    const validationResult = linkTimeSeriesSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorResponse: ErrorResponse = {
        error: `Invalid request body: ${validationResult.error.message}`,
        status: 400
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    const { timeSeriesIds } = validationResult.data;
    
    // Link each time series to the topic
    const results = [];
    for (const timeSeriesId of timeSeriesIds) {
      try {
        const result = timeSeriesRepository.linkTimeSeriesWithTopic(id, timeSeriesId);
        results.push({
          topicId: id,
          timeSeriesId,
          success: true
        });
      } catch (error) {
        results.push({
          topicId: id,
          timeSeriesId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Return the results
    return NextResponse.json({
      success: results.every(r => r.success),
      results
    });
  } catch (error) {
    // Get the ID safely for error logging
    const id = params ? (await params).id : 'unknown';
    console.error(`Error linking time series to topic with ID ${id}:`, error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
