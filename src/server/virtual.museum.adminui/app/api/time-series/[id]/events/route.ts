import { NextRequest, NextResponse } from 'next/server';
import { timeSeriesRepository } from '@/lib/timeSeriesRepository';
import { ErrorResponse } from '@/lib/types';
import { z } from 'zod';

// Schema for validating geo event requests
const GeoEventSchema = z.object({
  id: z.string().optional(), // Optional for new events
  groupId: z.string(), // Required for all events
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable(),
  dateTime: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  multimediaPresentationId: z.string().nullable(),
});

/**
 * POST handler for /api/time-series/[id]/events
 * Creates or updates a geo event
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: timeSeriesId } = await params;
    
    // Check if the time series exists
    const timeSeries = timeSeriesRepository.getTimeSeriesById(timeSeriesId);
    if (!timeSeries) {
      const errorResponse: ErrorResponse = {
        error: `Time series with ID ${timeSeriesId} not found`,
        status: 404
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    const validationResult = GeoEventSchema.safeParse(body);
    if (!validationResult.success) {
      const errorResponse: ErrorResponse = {
        error: `Invalid request body: ${validationResult.error.message}`,
        status: 400
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    const eventData = validationResult.data;
    
    // Check if the group belongs to this time series
    const groups = timeSeriesRepository.getGeoEventGroupsByTimeSeriesId(timeSeriesId);
    const groupExists = groups.some(group => group.Id === eventData.groupId);
    
    if (!groupExists) {
      const errorResponse: ErrorResponse = {
        error: `Group with ID ${eventData.groupId} does not belong to time series with ID ${timeSeriesId}`,
        status: 400
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    let result;
    
    // Create or update the event
    if (eventData.id && !eventData.id.startsWith('new-')) {
      // Update existing event
      result = timeSeriesRepository.updateGeoEvent(eventData.id, {
        name: eventData.name,
        description: eventData.description,
        dateTime: eventData.dateTime,
        latitude: eventData.latitude,
        longitude: eventData.longitude,
        multimediaPresentationId: eventData.multimediaPresentationId
      });
      
      if (!result) {
        const errorResponse: ErrorResponse = {
          error: `Event with ID ${eventData.id} not found`,
          status: 404
        };
        return NextResponse.json(errorResponse, { status: 404 });
      }
    } else {
      // Create new event
      result = timeSeriesRepository.createGeoEvent(eventData.groupId, {
        name: eventData.name,
        description: eventData.description,
        dateTime: eventData.dateTime,
        latitude: eventData.latitude,
        longitude: eventData.longitude,
        multimediaPresentationId: eventData.multimediaPresentationId
      });
    }
    
    // Format the response
    const response = {
      id: result.Id,
      groupId: result.GeoEventGroupId,
      name: result.Name,
      description: result.Description || '',
      dateTime: result.DateTime,
      latitude: result.Latitude,
      longitude: result.Longitude,
      hasMultimediaPresentation: !!result.MultiMediaPresentationId, // Convert to boolean
      multimediaPresentationId: result.MultiMediaPresentationId
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error saving geo event:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
