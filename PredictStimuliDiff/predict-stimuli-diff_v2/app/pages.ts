// ---------------------------------------------------------------------------
// Experiment definition — content transcribed from experiment_b.pdf, using the
// slide captures in /public (*_V1.png).
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
  gapClass?: string; // optional Tailwind override for the spacing between images
  waitSeconds: number;
  requireSelection?: boolean;
  record?: boolean; // record the response (order + selection) when leaving the page
  shuffle?: boolean; // randomize the display order of images (once per session)
  link?: { url: string; label: string }; // show a link button instead of Next
};

// Where the final page sends participants back to. Change this as needed.
export const PROLIFIC_RETURN_URL = "https://app.prolific.com/submissions/complete?cc=CI7BRYWK";

export const PAGES: Page[] = [
  {
    id: "intro",
    text: "For this question, your job will be to reflect on what it feels like to know that one bag of sand is heavier than another.",
    waitSeconds: 3.75,
  },
  {
    id: "task",
    text: "Imagine that you are asked to judge which of two bags of sand is heavier, just by feeling the weight of the bags in your hands with your eyes closed.",
    images: [{ src: "/A_V1.png", alt: "Two bags of sand" }],
    waitSeconds: 5,
  },
  {
    id: "grains",
    text: "The creators of the experiment have a “sand grain counter” and will use the numbers of grains of sand as a stand-in for the weight of each bag.",
    images: [{ src: "/B_V1.png", alt: "Two bags of sand: 5000 grains of sand and 6000 grains of sand" }],
    waitSeconds: 5,
  },
  {
    id: "five-graphs",
    text: "You will be presented with 2 different graphs that show the possible outcomes from many such comparisons and your job will be to decide which one appears to be the correct graph for you.",
    waitSeconds: 5,
  },
  {
    id: "x-axis",
    text: "In each of the figures you will see, the bottom axis shows the numbers of grains to be compared. The easiest trials appear on the right (e.g., 6000 versus 4000 grains of sand) and the hardest trials on the left (e.g., 6000 versus 6001 grains of sand) with some relevant trials noted in between (e.g., 6000 versus 5600 grains of sand).",
    images: [{ src: "/C_V1.png", alt: "The horizontal axis of comparisons" }],
    waitSeconds: 6.25,
  },
  {
    id: "y-axis",
    text: "The vertical axis will show how often you feel that “I know which one is heavier” (that is, for each type of comparison, how often would you say that you know which one is heavier).",
    images: [{ src: "/D_V1.png", alt: "Empty graph axes" }],
    waitSeconds: 6.25,
  },
  {
    id: "imagine",
    text: "For each comparison, imagine attempting to do the trial yourself and decide “how often will I say that I know which one is heavier”).",
    images: [{ src: "/D_V1.png", alt: "Empty graph axes" }],
    waitSeconds: 5,
  },
  {
    id: "anchor-easy",
    text: "The creators of the experiment have provided two values to guide us. For the easiest trial (e.g., 6000 vs 4000), the creators estimate that “99 times out of 100 people will say they know which one is heavier” – because this trial is easy enough that nearly all people will successfully feel which bag is heavier.",
    images: [{ src: "/E_V1.png", alt: "Graph with the easiest trial marked “I Totally Know”" }],
    waitSeconds: 6.25,
  },
  {
    id: "anchor-hard",
    text: "For the hardest trial (e.g., 6000 vs 6001), the creators estimate that “1 time out of 100 people will say that they know which one is heavier” – because this trial is so difficult.",
    images: [{ src: "/F_V1.png", alt: "Graph with the hardest trial marked “I Don’t Know!”" }],
    waitSeconds: 6.25,
  },
  {
    id: "preview",
    text: "Now, imagine all of the possible combinations in between these two values. How do you expect the figure to look after many experimental trials of these sorts. We’ll show you 2 possible graphs.",
    images: [
      { src: "/G_V1.png", alt: "Graph with only the easiest and hardest trials marked", sizeClass: "max-h-[55vh] w-auto" },
      { src: "/H_V1.png", alt: "Graph with only the easiest and hardest trials marked", sizeClass: "max-h-[55vh] w-auto" },
    ],
    gapClass: "gap-16",
    waitSeconds: 5,
  },
  {
    id: "question",
    text: "For each comparison dot, how often will say that you know which one is heavier? Which pattern do you feel is most likely to match the actual performance of regular human participants (choose one).",
    images: [
      { src: "/I_V1.png", alt: "Candidate graph 1", selectable: true, sizeClass: "max-h-[55vh] w-auto" },
      { src: "/J_V1.png", alt: "Candidate graph 2", selectable: true, sizeClass: "max-h-[55vh] w-auto" },
    ],
    gapClass: "gap-16",
    waitSeconds: 10,
    requireSelection: true,
    record: true,
    shuffle: true,
  },
  {
    id: "thanks",
    text: "Thank you for participating! Click the button below to return to Prolific.",
    waitSeconds: 0,
    link: { url: PROLIFIC_RETURN_URL, label: "Return to Prolific" },
  },
];
