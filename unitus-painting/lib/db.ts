// lib/db.ts
import { neon, neonConfig } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';

// Optional: Configure neon to use WebSocket for transaction support
neonConfig.webSocketConstructor = WebSocket;

// Declare type for the global connection
declare global {
  var dbConnection: Pool | undefined;
}

// Create connection singleton
const createConnection = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  // Create connection pool
  return new Pool({ connectionString: process.env.DATABASE_URL });
};

// Get or create connection
export const db = globalThis.dbConnection ?? createConnection();

// For development: Prevent multiple connections during hot reload
if (process.env.NODE_ENV !== 'production') {
  globalThis.dbConnection = db;
}

// Helper function to time queries (similar to your Prisma extension)
export async function timedQuery<T>(queryFn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await queryFn();
  const end = performance.now();
  const time = end - start;
  console.log(`Query took ${time}ms`);
  return result;
}