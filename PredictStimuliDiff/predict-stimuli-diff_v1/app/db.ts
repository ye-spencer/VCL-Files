import "server-only";
import postgres from "postgres";

// Shared Postgres client. Connections are opened lazily on first query.
// `prepare: false` keeps this working if DATABASE_URL is later pointed at
// Supabase's transaction pooler (which doesn't support prepared statements).
export const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
