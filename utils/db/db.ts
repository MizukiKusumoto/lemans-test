import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Use DATABASE_URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(databaseUrl);
export const db = drizzle(client);

