// utils/db/migrate.ts
import * as dotenv from 'dotenv';
dotenv.config(); // ← 必ず一番上で呼ぶ

import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './db';

async function main() {
  await migrate(db, { migrationsFolder: './utils/db/migrations' });
  console.log("✅ Migrations complete.");
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
