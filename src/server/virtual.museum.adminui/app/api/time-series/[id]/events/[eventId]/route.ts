import { NextRequest, NextResponse } from 'next/server';
import { timeSeriesRepository } from '@/lib/timeSeriesRepository';
import { ErrorResponse } from '@/lib/types';

/**
 * DELETE handler for /api/time-series/[id]/events/[eventId]
 * Deletes a geo event
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; eventId: string } }
) {
  try {
    const { id, eventId } = await params;
    
    // Check if the time series exists
    const timeSeries = timeSeriesRepository.getTimeSeriesById(id);
    if (!timeSeries) {
      const errorResponse: ErrorResponse = {
        error: `Time series with ID ${id} not found`,
        status: 404
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Delete the event
    const success = timeSeriesRepository.deleteGeoEvent(eventId);
    
    if (!success) {
      const errorResponse: ErrorResponse = {
        error: `Event with ID ${eventId} not found or could not be deleted`,
        status: 404
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting geo event:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
