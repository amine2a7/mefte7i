import fs from "node:fs";
import path from "node:path";
import { createPool } from "@/lib/pg-pool";

process.loadEnvFile?.();

async function main() {
  const schema = fs.readFileSync(path.join(import.meta.dirname, "schema.sql"), "utf-8");
  const pool = createPool();
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
