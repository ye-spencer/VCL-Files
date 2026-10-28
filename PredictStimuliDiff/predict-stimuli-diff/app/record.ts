"use server";

// Records a participant's response to the `responses` table (db/schema.sql).
// This is a Server Function: it runs on the server, but is callable from the
// client like a normal async function.

import { sql } from "./db";

export type Response = {
  order: string[]; // image srcs in the order they were displayed
  selected: string; // src of the image the participant chose
};

export async function recordResponse({ order, selected }: Response) {
  await sql`
    insert into responses (display_order, selected)
    values (${order}, ${selected})
  `;
}
