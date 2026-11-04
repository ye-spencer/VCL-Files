"use server";

import type { TrialResult } from "./experiment";

// Stub: prints to the terminal running the server. Replace the body with a
// database insert later; callers don't need to change.
export async function saveTrialResult(result: TrialResult) {
  console.log("saveTrialResult", JSON.stringify(result));
}
