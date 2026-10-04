// ---------------------------------------------------------------------------
// Experiment definition — content transcribed from SlideDesign.pptx, using the
// slide screenshots in /public.
//
// Add / remove / reorder objects in the `PAGES` array to change the
// experiment. The number of pages is whatever you put here.
//
// A page shows some `text` and zero or more `images`. Any image can be
// `selectable`; set `requireSelection` to force an answer before continuing.
// ---------------------------------------------------------------------------

export type Image = {
  src: string; // path under /public
  alt?: string;
  caption?: string;
  selectable?: boolean;
  sizeClass?: string; // optional Tailwind override for this image's size
};

export type Page = {
  id: string;
  text: string;
  images?: Image[];
  layout?: "row" | "grid"; // how to arrange multiple images (default "row")
  waitSeconds: number;
  requireSelection?: boolean;
  link?: { url: string; label: string }; // show a link button instead of Next
};

// Where the final page sends participants back to. Change this as needed.
export const PROLIFIC_RETURN_URL = "https://app.prolific.com/submissions/complete";

export const PAGES: Page[] = [
  {
    id: "intro",
    text: "For this question, your job will be to consider the likely results of a psychology experiment.",
    waitSeconds: 3,
  },
  {
    id: "task",
    text: "Imagine that 100 regular people are asked to judge which of two bags of sand is heavier, just by feeling the weight of the bags in their hands with their eyes closed.",
    images: [
      { src: "/bag_left.png", alt: "A bag of sand" },
      { src: "/bag_right.png", alt: "A bag of sand" },
    ],
    waitSeconds: 4,
  },
  {
    id: "grains",
    text: "The creators of the experiment have a “sand grain counter” and will use the numbers of grains of sand as a stand-in for the weight of each bag.",
    images: [
      { src: "/bag_left.png", alt: "A bag of sand", caption: "5000 grains of sand" },
      { src: "/bag_right.png", alt: "A bag of sand", caption: "6000 grains of sand" },
    ],
    waitSeconds: 4,
  },
  {
    id: "five-graphs",
    text: "You will be presented with 5 different graphs that show the possible outcomes from many such comparisons and your job will be to decide which one appears to be the correct graph.",
    waitSeconds: 4,
  },
  {
    id: "x-axis",
    text: "In each figure, the bottom axis shows the numbers of grains to be compared. The easiest trials appear on the right (e.g., 6000 versus 4000 grains) and the hardest on the left (e.g., 6000 versus 6001 grains), with relevant trials in between.",
    images: [{ src: "/A.png", alt: "The horizontal axis of comparisons" }],
    waitSeconds: 5,
  },
  {
    id: "y-axis",
    text: "The vertical axis shows the number of people, out of 100, who will choose the correct bag of sand (i.e., with their eyes closed, will be able to feel which bag is heavier).",
    images: [{ src: "/B.png", alt: "Empty graph axes" }],
    waitSeconds: 5,
  },
  {
    id: "imagine",
    text: "For each comparison, imagine attempting to do the trial yourself and decide “how many people out of 100 will choose the correct bag of sand.”",
    images: [{ src: "/B.png", alt: "Empty graph axes" }],
    waitSeconds: 4,
  },
  {
    id: "anchor-easy",
    text: "The creators provide two values to guide us. For the easiest trial (6000 vs 4000), they estimate that 99 people out of 100 will get it correct — this trial is easy enough that nearly everyone can feel which bag is heavier.",
    images: [{ src: "/C.png", alt: "Graph with the easiest trial marked “Getting it Right!”" }],
    waitSeconds: 5,
  },
  {
    id: "anchor-hard",
    text: "For the hardest trial (6000 vs 6001), they estimate that 51 people out of 100 will get it correct — this trial is so difficult that people are near chance. Guessing alone is right half the time, which is why the worst performance is 50 out of 100.",
    images: [{ src: "/D.png", alt: "Graph with the hardest trial marked “At Chance!”" }],
    waitSeconds: 5,
  },
  {
    id: "preview",
    text: "Now, imagine all of the possible combinations in between these two values. How do you expect the figure to look after many experimental trials? We’ll show you 5 possible graphs.",
    images: [{ src: "/E.png", alt: "Graph with only the easiest and hardest trials marked" }],
    waitSeconds: 4,
  },
  {
    id: "question",
    text: "For each comparison dot, how many people out of 100 will choose the correct bag? Which pattern do you feel is most likely to match the actual performance of regular human participants? (Choose one.)",
    images: [
      { src: "/F.png", alt: "Candidate graph 1", selectable: true },
      { src: "/G.png", alt: "Candidate graph 2", selectable: true },
      { src: "/H.png", alt: "Candidate graph 3", selectable: true },
      { src: "/I.png", alt: "Candidate graph 4", selectable: true },
      { src: "/J.png", alt: "Candidate graph 5", selectable: true },
    ],
    layout: "grid",
    waitSeconds: 3,
    requireSelection: true,
  },
  {
    id: "thanks",
    text: "Thank you for participating! Click the button below to return to Prolific.",
    waitSeconds: 0,
    link: { url: PROLIFIC_RETURN_URL, label: "Return to Prolific" },
  },
];
