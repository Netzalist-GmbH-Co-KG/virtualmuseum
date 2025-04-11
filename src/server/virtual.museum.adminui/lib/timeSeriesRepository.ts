import { withDb } from './db';
import { v4 as uuidv4 } from 'uuid';
import { TimeSeries, TimeSeriesWithRelations, TopicTimeSeries } from './types';

// Define interfaces for database entities not in types.ts
interface GeoEventGroup {
  Id: string;
  TimeSeriesId: string;
  Label: string;
  Description: string | null;
}

interface GeoEvent {
  Id: string;
  GeoEventGroupId: string;
  Name: string;
  Description: string | null;
  DateTime: string;
  Latitude: number;
  Longitude: number;
  MultiMediaPresentationId: string | null; // Corrected casing to match database schema
}

interface Presentation {
  Id: string;
  Name: string;
  Description: string | null;
}

/**
 * Repository for time series related database operations
 */
export const timeSeriesRepository = {
  /**
   * Get all time series
   * @returns Array of time series
   */
  getAllTimeSeries(): TimeSeries[] {
    return withDb(db => {
      return db.prepare('SELECT * FROM TimeSeries').all() as TimeSeries[];
    });
  },

  /**
   * Get a single time series by ID
   * @param id Time series ID
   * @returns Time series or null if not found
   */
  getTimeSeriesById(id: string): TimeSeries | null {
    return withDb(db => {
      return db.prepare('SELECT * FROM TimeSeries WHERE Id = ?').get(id) as TimeSeries | null;
    });
  },

  /**
   * Get counts of geo event groups and events for a time series
   * @param timeSeriesId Time series ID
   * @returns Object with counts of geo event groups and events
   */
  getTimeSeriesCounts(timeSeriesId: string): { geoEventGroupsCount: number, geoEventsCount: number } {
    return withDb(db => {
      // Count geo event groups
      const geoEventGroups = db.prepare(`
        SELECT * FROM GeoEventGroups WHERE TimeSeriesId = ?
      `).all(timeSeriesId) as { Id: string }[];
      
      let geoEventsCount = 0;
      
      // Count events for each group
      for (const group of geoEventGroups) {
        const events = db.prepare(`
          SELECT COUNT(*) as count FROM GeoEvents WHERE GeoEventGroupId = ?
        `).get(group.Id) as { count: number };
        
        geoEventsCount += events.count;
      }
      
      return {
        geoEventGroupsCount: geoEventGroups.length,
        geoEventsCount: geoEventsCount
      };
    });
  },

  /**
   * Get time series for a topic
   * @param topicId Topic ID
   * @returns Array of time series with relation data
   */
  getTimeSeriesByTopicId(topicId: string): TimeSeriesWithRelations[] {
    return withDb(db => {
      // Get the topic-time series relationships
      const topicTimeSeries = db.prepare(`
        SELECT * FROM TopographicalTableTopicTimeSeries WHERE TopographicalTableTopicId = ?
      `).all(topicId) as TopicTimeSeries[];
      
      if (!topicTimeSeries.length) return [];
      
      // Get the time series for each relationship
      const timeSeriesWithRelations: TimeSeriesWithRelations[] = [];
      
      for (const relation of topicTimeSeries) {
        const timeSeries = db.prepare(`
          SELECT * FROM TimeSeries WHERE Id = ?
        `).get(relation.TimeSeriesId) as TimeSeries | null;
        
        if (timeSeries) {
          // Get counts using the dedicated function
          const { geoEventGroupsCount, geoEventsCount } = this.getTimeSeriesCounts(timeSeries.Id);
          
          timeSeriesWithRelations.push({
            ...timeSeries,
            GeoEventGroupsCount: geoEventGroupsCount,
            GeoEventsCount: geoEventsCount
          });
        }
      }
      
      return timeSeriesWithRelations;
    });
  },

  /**
   * Get geo event groups for a time series
   * @param timeSeriesId Time series ID
   * @returns Array of geo event groups
   */
  getGeoEventGroupsByTimeSeriesId(timeSeriesId: string): GeoEventGroup[] {
    return withDb(db => {
      return db.prepare(`
        SELECT * FROM GeoEventGroups WHERE TimeSeriesId = ?
      `).all(timeSeriesId) as GeoEventGroup[];
    });
  },

  /**
   * Get geo events for a geo event group
   * @param groupId Geo event group ID
   * @returns Array of geo events
   */
  getGeoEventsByGroupId(groupId: string): GeoEvent[] {
    return withDb(db => {
      return db.prepare(`
        SELECT * FROM GeoEvents WHERE GeoEventGroupId = ?
      `).all(groupId) as GeoEvent[];
    });
  },

  /**
   * Get available presentations for dropdown
   * @returns Array of presentations
   */
  getAvailablePresentations(): Presentation[] {
    return withDb(db => {
      return db.prepare(`
        SELECT * FROM MultimediaPresentations
      `).all() as Presentation[];
    });
  },

  /**
   * Update a time series
   * @param id Time series ID
   * @param data Updated time series data
   * @returns Updated time series
   */
  updateTimeSeries(id: string, data: { Name: string; Description: string | null }): TimeSeries {
    return withDb(db => {
      // Update the time series
      const stmt = db.prepare(`
        UPDATE TimeSeries
        SET Name = ?, Description = ?
        WHERE Id = ?
      `);
      
      stmt.run(data.Name, data.Description, id);
      
      // Return the updated time series
      return this.getTimeSeriesById(id) as TimeSeries;
    });
  },

  /**
   * Link a time series to a topic
   * @param topicId Topic ID
   * @param timeSeriesId Time series ID
   * @returns The created link
   */
  linkTimeSeriesWithTopic(topicId: string, timeSeriesId: string): TopicTimeSeries {
    return withDb(db => {
      // Check if the link already exists
      const existingLink = db.prepare(`
        SELECT * FROM TopographicalTableTopicTimeSeries WHERE TopographicalTableTopicId = ? AND TimeSeriesId = ?
      `).get(topicId, timeSeriesId) as TopicTimeSeries | null;
      
      if (existingLink) {
        return existingLink;
      }
      
      // Create a new link
      const id = uuidv4();
      
      db.prepare(`
        INSERT INTO TopographicalTableTopicTimeSeries (Id, TopographicalTableTopicId, TimeSeriesId)
        VALUES (?, ?, ?)
      `).run(id, topicId, timeSeriesId);
      
      return {
        Id: id,
        TopographicalTableTopicId: topicId,
        TimeSeriesId: timeSeriesId
      };
    });
  },

  /**
   * Unlink a time series from a topic
   * @param topicId Topic ID
   * @param timeSeriesId Time series ID
   * @returns Boolean indicating success
   */
  unlinkTimeSeriesFromTopic(topicId: string, timeSeriesId: string): boolean {
    return withDb(db => {
      // Check if the link exists
      const existingLink = db.prepare(`
        SELECT * FROM TopographicalTableTopicTimeSeries WHERE TopographicalTableTopicId = ? AND TimeSeriesId = ?
      `).get(topicId, timeSeriesId) as TopicTimeSeries | null;
      
      if (!existingLink) {
        return false; // Link doesn't exist, nothing to delete
      }
      
      // Delete the link
      const result = db.prepare(`
        DELETE FROM TopographicalTableTopicTimeSeries 
        WHERE TopographicalTableTopicId = ? AND TimeSeriesId = ?
      `).run(topicId, timeSeriesId);
      
      return result.changes > 0;
    });
  },

  /**
   * Create a new geo event
   * @param groupId Geo event group ID
   * @param eventData Event data
   * @returns The created geo event
   */
  createGeoEvent(groupId: string, eventData: {
    name: string;
    description: string | null;
    dateTime: string;
    latitude: number;
    longitude: number;
    multimediaPresentationId: string | null;
  }): GeoEvent {
    return withDb(db => {
      const id = uuidv4();
      
      db.prepare(`
        INSERT INTO GeoEvents (
          Id, GeoEventGroupId, Name, Description, DateTime, 
          Latitude, Longitude, MultiMediaPresentationId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        groupId,
        eventData.name,
        eventData.description,
        eventData.dateTime,
        eventData.latitude,
        eventData.longitude,
        eventData.multimediaPresentationId
      );
      
      return {
        Id: id,
        GeoEventGroupId: groupId,
        Name: eventData.name,
        Description: eventData.description,
        DateTime: eventData.dateTime,
        Latitude: eventData.latitude,
        Longitude: eventData.longitude,
        MultiMediaPresentationId: eventData.multimediaPresentationId
      };
    });
  },

  /**
   * Update an existing geo event
   * @param eventId Geo event ID
   * @param eventData Updated event data
   * @returns The updated geo event or null if not found
   */
  updateGeoEvent(eventId: string, eventData: {
    name: string;
    description: string | null;
    dateTime: string;
    latitude: number;
    longitude: number;
    multimediaPresentationId: string | null;
  }): GeoEvent | null {
    return withDb(db => {
      // Check if the event exists
      const existingEvent = db.prepare(`
        SELECT * FROM GeoEvents WHERE Id = ?
      `).get(eventId) as GeoEvent | null;
      
      if (!existingEvent) {
        return null;
      }
      
      // Update the event
      db.prepare(`
        UPDATE GeoEvents SET
          Name = ?,
          Description = ?,
          DateTime = ?,
          Latitude = ?,
          Longitude = ?,
          MultiMediaPresentationId = ?
        WHERE Id = ?
      `).run(
        eventData.name,
        eventData.description,
        eventData.dateTime,
        eventData.latitude,
        eventData.longitude,
        eventData.multimediaPresentationId,
        eventId
      );
      
      return {
        Id: eventId,
        GeoEventGroupId: existingEvent.GeoEventGroupId,
        Name: eventData.name,
        Description: eventData.description,
        DateTime: eventData.dateTime,
        Latitude: eventData.latitude,
        Longitude: eventData.longitude,
        MultiMediaPresentationId: eventData.multimediaPresentationId
      };
    });
  }
};
