"use server";

// Records a participant's response to the `survey_predict_graphs` table (db/schema.sql).
// This is a Server Function: it runs on the server, but is callable from the
// client like a normal async function.

import { sql } from "./db";

export type Response = {
  prolificPid: string | null; // from the PROLIFIC_PID URL param, if present
  order: string[]; // image srcs in the order they were displayed
  selected: string; // src of the image the participant chose
};

export async function recordResponse({ prolificPid, order, selected }: Response) {
  await sql`
    insert into survey_predict_graphs (prolific_pid, display_order, selected)
    values (${prolificPid || "DEV TEST OR MISSING"}, ${order}, ${selected})
  `;
}
