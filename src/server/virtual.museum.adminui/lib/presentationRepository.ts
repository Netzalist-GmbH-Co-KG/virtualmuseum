import { withDb } from './db';
import { v4 as uuidv4 } from 'uuid';

// Define the MultimediaPresentation interface
export interface MultimediaPresentation {
  Id: string;
  Name: string | null;
  Description: string | null;
}

// Define the PresentationItem interface
export interface PresentationItem {
  Id: string;
  MultimediaPresentationId: string;
  MediaFileId: string | null;
  SlotNumber: number;
  SequenceNumber: number;
  DurationInSeconds: number;
}

// Define the PresentationWithItemCount interface for listing presentations
export interface PresentationWithItemCount extends MultimediaPresentation {
  ItemsCount: number;
  UsageCount: number;
}

/**
 * Repository for multimedia presentations related database operations
 */
export const presentationRepository = {
  /**
   * Get all multimedia presentations with item counts and usage counts
   * @returns Array of presentations with item counts and usage counts
   */
  getAllPresentationsWithItemCounts(): PresentationWithItemCount[] {
    return withDb(db => {
      return db.prepare(`
        SELECT 
          p.Id, 
          p.Name, 
          p.Description, 
          COUNT(DISTINCT pi.Id) as ItemsCount,
          (SELECT COUNT(*) FROM GeoEvents ge WHERE ge.MultiMediaPresentationId = p.Id) as UsageCount
        FROM MultimediaPresentations p
        LEFT JOIN PresentationItems pi ON p.Id = pi.MultimediaPresentationId
        GROUP BY p.Id
      `).all() as PresentationWithItemCount[];
    });
  },

  /**
   * Get a single multimedia presentation by ID
   * @param id Presentation ID
   * @returns Presentation or null if not found
   */
  getPresentationById(id: string): MultimediaPresentation | null {
    return withDb(db => {
      return db.prepare('SELECT * FROM MultimediaPresentations WHERE Id = ?').get(id) as MultimediaPresentation | null;
    });
  },

  /**
   * Get presentation items for a presentation
   * @param presentationId Presentation ID
   * @returns Array of presentation items
   */
  getPresentationItems(presentationId: string): PresentationItem[] {
    return withDb(db => {
      return db.prepare(`
        SELECT * FROM PresentationItems 
        WHERE MultimediaPresentationId = ? 
        ORDER BY SlotNumber, SequenceNumber
      `).all(presentationId) as PresentationItem[];
    });
  },

  /**
   * Create a new multimedia presentation
   * @param data Presentation data
   * @returns The created presentation
   */
  createPresentation(data: Omit<MultimediaPresentation, 'Id'>): MultimediaPresentation {
    return withDb(db => {
      const id = uuidv4();
      
      db.prepare(`
        INSERT INTO MultimediaPresentations (Id, Name, Description)
        VALUES (?, ?, ?)
      `).run(id, data.Name, data.Description);
      
      return this.getPresentationById(id)!;
    });
  },

  /**
   * Update an existing multimedia presentation
   * @param id Presentation ID
   * @param data Updated presentation data
   * @returns The updated presentation
   */
  updatePresentation(id: string, data: Partial<Omit<MultimediaPresentation, 'Id'>>): MultimediaPresentation {
    return withDb(db => {
      // Get the existing presentation
      const existingPresentation = this.getPresentationById(id);
      
      if (!existingPresentation) {
        throw new Error(`Presentation with ID ${id} not found`);
      }
      
      // Build the update query dynamically based on provided fields
      const updateFields: string[] = [];
      const params: any[] = [];
      
      if (data.Name !== undefined) {
        updateFields.push('Name = ?');
        params.push(data.Name);
      }
      
      if (data.Description !== undefined) {
        updateFields.push('Description = ?');
        params.push(data.Description);
      }
      
      // If there are fields to update
      if (updateFields.length > 0) {
        // Add the ID as the last parameter
        params.push(id);
        
        // Execute the update
        db.prepare(`
          UPDATE MultimediaPresentations
          SET ${updateFields.join(', ')}
          WHERE Id = ?
        `).run(...params);
      }
      
      // Return the updated presentation
      return this.getPresentationById(id)!;
    });
  },

  /**
   * Delete a multimedia presentation
   * @param id Presentation ID
   * @returns True if the presentation was deleted, false otherwise
   */
  deletePresentation(id: string): boolean {
    return withDb(db => {
      // First delete all presentation items
      db.prepare('DELETE FROM PresentationItems WHERE MultimediaPresentationId = ?').run(id);
      
      // Then delete the presentation
      const result = db.prepare('DELETE FROM MultimediaPresentations WHERE Id = ?').run(id);
      
      return result.changes > 0;
    });
  },

  /**
   * Add a presentation item
   * @param data Presentation item data
   * @returns The created presentation item
   */
  addPresentationItem(data: Omit<PresentationItem, 'Id'>): PresentationItem {
    return withDb(db => {
      const id = uuidv4();
      
      db.prepare(`
        INSERT INTO PresentationItems (
          Id, 
          MultimediaPresentationId, 
          MediaFileId, 
          SlotNumber, 
          SequenceNumber, 
          DurationInSeconds
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        id, 
        data.MultimediaPresentationId, 
        data.MediaFileId, 
        data.SlotNumber, 
        data.SequenceNumber, 
        data.DurationInSeconds
      );
      
      return db.prepare('SELECT * FROM PresentationItems WHERE Id = ?').get(id) as PresentationItem;
    });
  },

  /**
   * Update a presentation item
   * @param id Presentation item ID
   * @param data Updated presentation item data
   * @returns The updated presentation item
   */
  updatePresentationItem(id: string, data: Partial<Omit<PresentationItem, 'Id'>>): PresentationItem {
    return withDb(db => {
      // Get the existing item
      const existingItem = db.prepare('SELECT * FROM PresentationItems WHERE Id = ?').get(id) as PresentationItem | null;
      
      if (!existingItem) {
        throw new Error(`Presentation item with ID ${id} not found`);
      }
      
      // Build the update query dynamically based on provided fields
      const updateFields: string[] = [];
      const params: any[] = [];
      
      if (data.MediaFileId !== undefined) {
        updateFields.push('MediaFileId = ?');
        params.push(data.MediaFileId);
      }
      
      if (data.SlotNumber !== undefined) {
        updateFields.push('SlotNumber = ?');
        params.push(data.SlotNumber);
      }
      
      if (data.SequenceNumber !== undefined) {
        updateFields.push('SequenceNumber = ?');
        params.push(data.SequenceNumber);
      }
      
      if (data.DurationInSeconds !== undefined) {
        updateFields.push('DurationInSeconds = ?');
        params.push(data.DurationInSeconds);
      }
      
      // If there are fields to update
      if (updateFields.length > 0) {
        // Add the ID as the last parameter
        params.push(id);
        
        // Execute the update
        db.prepare(`
          UPDATE PresentationItems
          SET ${updateFields.join(', ')}
          WHERE Id = ?
        `).run(...params);
      }
      
      // Return the updated item
      return db.prepare('SELECT * FROM PresentationItems WHERE Id = ?').get(id) as PresentationItem;
    });
  },

  /**
   * Delete a presentation item
   * @param id Presentation item ID
   * @returns True if the item was deleted, false otherwise
   */
  deletePresentationItem(id: string): boolean {
    return withDb(db => {
      const result = db.prepare('DELETE FROM PresentationItems WHERE Id = ?').run(id);
      return result.changes > 0;
    });
  }
};
