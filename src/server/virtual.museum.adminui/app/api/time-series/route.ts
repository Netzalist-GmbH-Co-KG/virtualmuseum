import { NextResponse } from 'next/server';
import { timeSeriesRepository } from '@/lib/timeSeriesRepository';
import { ErrorResponse } from '@/lib/types';

/**
 * GET handler for /api/time-series
 * Retrieves all time series with additional data
 */
export async function GET() {
  try {
    // Get all time series
    const allTimeSeries = timeSeriesRepository.getAllTimeSeries();
    
    // For each time series, get the geo event groups and events counts
    const timeSeriesWithCounts = await Promise.all(
      allTimeSeries.map(async (timeSeries) => {
        const { geoEventGroupsCount, geoEventsCount } = await timeSeriesRepository.getTimeSeriesCounts(timeSeries.Id);
        
        return {
          id: timeSeries.Id,
          name: timeSeries.Name,
          description: timeSeries.Description || '',
          geoEventGroupsCount,
          geoEventsCount
        };
      })
    );
    
    // Return response
    return NextResponse.json({
      timeSeries: timeSeriesWithCounts
    });
  } catch (error) {
    console.error('Error fetching time series:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
