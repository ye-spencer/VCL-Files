// Stub for recording a participant's response. Later this will POST to the
// backend; for now it just logs so the shape is easy to see.

export type Response = {
  pageId: string;
  order: string[]; // image srcs in the order they were displayed
  selected: string; // src of the image the participant chose
};

export function recordResponse(response: Response) {
  // TODO: replace with a POST to the backend.
  console.log("recordResponse", response);
}
