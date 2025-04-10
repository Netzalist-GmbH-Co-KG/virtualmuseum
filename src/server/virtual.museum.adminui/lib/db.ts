import Database from 'better-sqlite3';
import path from 'path';
import { config } from './config';

/**
 * Creates a database connection
 * @returns A database connection instance
 */
export function getDbConnection() {
  // Resolve the database path relative to the project root
  const dbPath = path.resolve(process.cwd(), config.dbPath);
  
  try {
    // Create a new database connection
    const db = new Database(dbPath, { 
      readonly: false, // Set to true for read-only operations if needed
      fileMustExist: true, // Ensure the database file exists
    });
    
    // Enable foreign keys for referential integrity
    db.pragma('foreign_keys = ON');
    
    return db;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw new Error(`Failed to connect to database at ${dbPath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Executes a database operation with proper connection handling
 * @param operation Function that performs database operations
 * @returns Result of the operation
 */
export function withDb<T>(operation: (db: Database.Database) => T): T {
  const db = getDbConnection();
  
  try {
    return operation(db);
  } finally {
    // Always close the database connection when done
    db.close();
  }
}
