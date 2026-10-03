// ---------------------------------------------------------------------------
// Experiment definition.
//
// Add / remove / reorder objects in the `PAGES` array below to change the
// experiment. The number of pages is whatever you put here — nothing else
// needs to change.
// ---------------------------------------------------------------------------

export type ExperimentImage = {
  src: string; // path under /public, e.g. "/images/example-1.png"
  alt?: string;
  selectable?: boolean; // can the participant click this as their answer?
};

export type Page = {
  id: string; // unique, used to key answers
  text: string; // instructions / question shown at the top
  images?: ExperimentImage[]; // 0 to 5 images
  waitSeconds: number; // delay before the Next button appears
  requireSelection?: boolean; // must a selectable image be chosen to continue?
};

export const PAGES: Page[] = [
  {
    id: "intro",
    text: "Welcome to the experiment. Please read each screen carefully. A Next button will appear after a short pause.",
    waitSeconds: 3,
  },
  {
    id: "example-1",
    text: "Here is an example of the kind of image you will see. These are just examples — you do not need to select anything.",
    images: [
      { src: "/A.png", alt: "Example A" },
      { src: "/A.png", alt: "Example B" },
    ],
    waitSeconds: 4,
  },
  {
    id: "survey-1",
    text: "Which image looks different from the others? Click it to select your answer, then press Next.",
    images: [
      { src: "/A.png", alt: "Option 1", selectable: true },
      { src: "/A.png", alt: "Option 2", selectable: true },
      { src: "/A.png", alt: "Option 3", selectable: true },
      { src: "/A.png", alt: "Option 4", selectable: true },
    ],
    waitSeconds: 2,
    requireSelection: true,
  },
  {
    id: "end",
    text: "Thank you! The experiment is complete.",
    waitSeconds: 1,
  },
];
