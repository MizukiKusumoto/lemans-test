import * as dotenv from 'dotenv';
dotenv.config(); // ← 必ず一番上で呼ぶ

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient);
