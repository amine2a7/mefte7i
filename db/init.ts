import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";

process.loadEnvFile?.();

async function main() {
  const schema = fs.readFileSync(path.join(import.meta.dirname, "schema.sql"), "utf-8");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(schema);
    console.log("Database schema created.");
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
