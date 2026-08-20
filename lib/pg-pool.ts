import { Pool } from "pg";

function needsSsl(connectionString: string | undefined) {
  if (!connectionString) return false;
  return !/(localhost|127\.0\.0\.1)/.test(connectionString);
}

export function createPool(connectionString = process.env.DATABASE_URL) {
  return new Pool({
    connectionString,
    // Managed Postgres (Neon, Supabase, etc.) requires TLS; local dev clusters don't.
    ssl: needsSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
  });
}
