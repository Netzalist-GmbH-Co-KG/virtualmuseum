import { NextRequest, NextResponse } from 'next/server';
import { timeSeriesRepository } from '@/lib/timeSeriesRepository';
import { ErrorResponse } from '@/lib/types';
import { z } from 'zod';

// Schema for validating time series update requests
const TimeSeriesUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

/**
 * GET handler for /api/time-series/[id]
 * Retrieves a single time series with its geo event groups and events
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    // Get the time series
    const timeSeries = timeSeriesRepository.getTimeSeriesById(id);
    
    if (!timeSeries) {
      const errorResponse: ErrorResponse = {
        error: `Time series with ID ${id} not found`,
        status: 404
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Get geo event groups for this time series
    const geoEventGroups = timeSeriesRepository.getGeoEventGroupsByTimeSeriesId(id);
    
    // Get events for each group and format the response
    const formattedGroups = await Promise.all(
      geoEventGroups.map(async (group) => {
        const events = timeSeriesRepository.getGeoEventsByGroupId(group.Id);
        
        // Log raw events for debugging
        console.log(`Events for group ${group.Id}:`, events.map(e => ({
          Id: e.Id,
          Name: e.Name,
          MultiMediaPresentationId: e.MultiMediaPresentationId,
          hasPresentation: !!e.MultiMediaPresentationId
        })));
        
        // Format events
        const formattedEvents = events.map(event => {
          const formattedEvent = {
            id: event.Id,
            name: event.Name,
            description: event.Description || '',
            dateTime: event.DateTime,
            latitude: event.Latitude,
            longitude: event.Longitude,
            hasMultimediaPresentation: !!event.MultiMediaPresentationId,
            multimediaPresentationId: event.MultiMediaPresentationId
          };
          
          // Log each formatted event for debugging
          console.log(`Formatted event ${event.Id}:`, {
            hasMultimediaPresentation: formattedEvent.hasMultimediaPresentation,
            multimediaPresentationId: formattedEvent.multimediaPresentationId,
            rawMultiMediaPresentationId: event.MultiMediaPresentationId
          });
          
          return formattedEvent;
        });
        
        return {
          id: group.Id,
          label: group.Label,
          description: group.Description || '',
          geoEvents: formattedEvents
        };
      })
    );
    
    // Get available presentations for the dropdown
    const presentations = timeSeriesRepository.getAvailablePresentations();
    const presentationOptions = presentations.map(p => ({
      id: p.Id,
      name: p.Name
    }));
    
    // Format the response
    const response = {
      id: timeSeries.Id,
      name: timeSeries.Name,
      description: timeSeries.Description || '',
      geoEventGroups: formattedGroups,
      presentationOptions
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching time series details:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * PUT handler for /api/time-series/[id]
 * Updates a time series
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    // Get the time series to make sure it exists
    const timeSeries = timeSeriesRepository.getTimeSeriesById(id);
    
    if (!timeSeries) {
      const errorResponse: ErrorResponse = {
        error: `Time series with ID ${id} not found`,
        status: 404
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Parse and validate the request body
    const body = await request.json();
    const validationResult = TimeSeriesUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorResponse: ErrorResponse = {
        error: 'Validation failed',
        status: 400,
        validationErrors: validationResult.error.issues
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Update the time series
    const updatedTimeSeries = timeSeriesRepository.updateTimeSeries(id, {
      Name: validationResult.data.name,
      Description: validationResult.data.description || null,
    });
    
    // Return the updated time series
    return NextResponse.json({
      id: updatedTimeSeries.Id,
      name: updatedTimeSeries.Name,
      description: updatedTimeSeries.Description || '',
    });
  } catch (error) {
    console.error('Error updating time series:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
