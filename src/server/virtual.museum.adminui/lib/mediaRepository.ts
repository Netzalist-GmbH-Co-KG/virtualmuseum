import { withDb } from './db';
import { v4 as uuidv4 } from 'uuid';

// Define the MediaFile interface
export interface MediaFile {
  Id: string;
  Description: string | null;
  DurationInSeconds: number;
  FileName: string | null;
  Name: string | null;
  Type: number;
  Url: string | null;
}

// Media type enum to match the database values
export enum MediaType {
  Image2D = 0,
  Image3D = 1,
  Image360Degree = 2,
  Video2D = 3,
  Video3D = 4,
  Video360Degree = 5,
  Audio = 6
}

/**
 * Repository for media files related database operations
 */
export const mediaRepository = {
  /**
   * Get all media files
   * @returns Array of media files
   */
  getAllMediaFiles(): MediaFile[] {
    return withDb(db => {
      return db.prepare('SELECT * FROM MediaFiles').all() as MediaFile[];
    });
  },

  /**
   * Get a single media file by ID
   * @param id Media file ID
   * @returns Media file or null if not found
   */
  getMediaFileById(id: string): MediaFile | null {
    return withDb(db => {
      return db.prepare('SELECT * FROM MediaFiles WHERE Id = ?').get(id) as MediaFile | null;
    });
  },

  /**
   * Search media files by name or description
   * @param searchTerm Search term
   * @returns Array of media files matching the search term
   */
  searchMediaFiles(searchTerm: string): MediaFile[] {
    return withDb(db => {
      return db.prepare(`
        SELECT * FROM MediaFiles 
        WHERE Name LIKE ? OR Description LIKE ?
      `).all(`%${searchTerm}%`, `%${searchTerm}%`) as MediaFile[];
    });
  },

  /**
   * Filter media files by type
   * @param type Media type
   * @returns Array of media files of the specified type
   */
  getMediaFilesByType(type: MediaType): MediaFile[] {
    return withDb(db => {
      return db.prepare('SELECT * FROM MediaFiles WHERE Type = ?').all(type) as MediaFile[];
    });
  },

  /**
   * Create a new media file
   * @param data Media file data
   * @returns The created media file
   */
  createMediaFile(data: Omit<MediaFile, 'Id'>): MediaFile {
    return withDb(db => {
      const id = uuidv4();
      
      db.prepare(`
        INSERT INTO MediaFiles (Id, Description, DurationInSeconds, FileName, Name, Type, Url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        data.Description,
        data.DurationInSeconds,
        data.FileName,
        data.Name,
        data.Type,
        data.Url
      );
      
      return this.getMediaFileById(id) as MediaFile;
    });
  },

  /**
   * Update an existing media file
   * @param id Media file ID
   * @param data Updated media file data
   * @returns The updated media file
   */
  updateMediaFile(id: string, data: Partial<Omit<MediaFile, 'Id'>>): MediaFile {
    return withDb(db => {
      // Get the current media file
      const mediaFile = this.getMediaFileById(id);
      
      if (!mediaFile) {
        throw new Error(`Media file with ID ${id} not found`);
      }
      
      // Build the update query
      const updates: string[] = [];
      const params: any[] = [];
      
      if (data.Description !== undefined) {
        updates.push('Description = ?');
        params.push(data.Description);
      }
      
      if (data.DurationInSeconds !== undefined) {
        updates.push('DurationInSeconds = ?');
        params.push(data.DurationInSeconds);
      }
      
      if (data.FileName !== undefined) {
        updates.push('FileName = ?');
        params.push(data.FileName);
      }
      
      if (data.Name !== undefined) {
        updates.push('Name = ?');
        params.push(data.Name);
      }
      
      if (data.Type !== undefined) {
        updates.push('Type = ?');
        params.push(data.Type);
      }
      
      if (data.Url !== undefined) {
        updates.push('Url = ?');
        params.push(data.Url);
      }
      
      // Add the ID as the last parameter
      params.push(id);
      
      // Execute the update
      if (updates.length > 0) {
        db.prepare(`
          UPDATE MediaFiles
          SET ${updates.join(', ')}
          WHERE Id = ?
        `).run(...params);
      }
      
      // Return the updated media file
      return this.getMediaFileById(id) as MediaFile;
    });
  },

  /**
   * Delete a media file
   * @param id Media file ID
   * @returns True if the media file was deleted, false otherwise
   */
  deleteMediaFile(id: string): boolean {
    return withDb(db => {
      const result = db.prepare('DELETE FROM MediaFiles WHERE Id = ?').run(id);
      return result.changes > 0;
    });
  }
};
