import { withDb } from './db';
import { v4 as uuidv4 } from 'uuid';
import { TimeSeries, TimeSeriesWithRelations, TopicTimeSeries } from './types';

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
          // Count geo event groups and events
          const geoEventGroups = db.prepare(`
            SELECT * FROM GeoEventGroups WHERE TimeSeriesId = ?
          `).all(timeSeries.Id) as { Id: string }[];
          
          let geoEventsCount = 0;
          
          for (const group of geoEventGroups) {
            const events = db.prepare(`
              SELECT COUNT(*) as count FROM GeoEvents WHERE GeoEventGroupId = ?
            `).get(group.Id) as { count: number };
            
            geoEventsCount += events.count;
          }
          
          timeSeriesWithRelations.push({
            ...timeSeries,
            GeoEventGroupsCount: geoEventGroups.length,
            GeoEventsCount: geoEventsCount
          });
        }
      }
      
      return timeSeriesWithRelations;
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
  }
};
