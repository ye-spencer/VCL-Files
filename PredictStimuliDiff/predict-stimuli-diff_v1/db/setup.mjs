// Applies db/schema.sql to the database in DATABASE_URL.
// Run with `npm run db:setup` (which loads .env).

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });
try {
  await sql.file(new URL("./schema.sql", import.meta.url).pathname);
  console.log("Schema applied.");
} finally {
  await sql.end();
}
