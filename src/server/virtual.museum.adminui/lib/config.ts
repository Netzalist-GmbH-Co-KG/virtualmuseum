/**
 * Application configuration
 */
export const config = {
  /**
   * Path to the SQLite database file
   * This can be overridden by setting the DB_PATH environment variable
   */
  dbPath: process.env.DB_PATH || 'E:\\db\\virtualmuseum.db',
}
