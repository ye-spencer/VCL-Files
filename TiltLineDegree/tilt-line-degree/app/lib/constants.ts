import assert from "assert";

export const NUM_PRACTICE_TRIALS = 7;
export const NUM_TRIALS = 70;
export const NUM_POST_PRACTICE_INSTRUCTIONS = 1;
export const NUM_INSTRUCTIONS = 3;
export const NUM_END_SCREEN = 1;



export const INSTRUCTIONS = [
    "Hi! Welcome to our experiment! In this experiment, you will be guided through a series of trials where you will be asked to make judgments about rectangles. ",
    "In each trial, you will first see a blank screen, then you will see a rectangle appear on the screen for a brief moment. Then, the rectangle will disappear, and you will be asked to judge whether the rectangle was tilted to the left (counter-clockwise) or to the right (clockwise). Press 'Q' if the rectangle was tilted to the left. Press 'P' if the rectangle was tilted to the right.",
    "We will start with some practice trials. The practice trials will not be recorded, so please do not worry about making mistakes. They are just to get you familiar with the task. They will begin on the next page."
];

export const INSTRUCTION_WAIT_DELAY_MS = [
    7000,
    11000,
    7000,
];

export const POST_PRACTICE_INSTRUCTIONS = [
    "The practice trials are now over. The real trials will now begin. "
];

export const POST_PRACTICE_INSTRUCTION_WAIT_DELAY_MS = [
    3000,
];


assert(NUM_POST_PRACTICE_INSTRUCTIONS === POST_PRACTICE_INSTRUCTIONS.length);

assert(NUM_INSTRUCTIONS === INSTRUCTIONS.length);

assert(NUM_POST_PRACTICE_INSTRUCTIONS === POST_PRACTICE_INSTRUCTION_WAIT_DELAY_MS.length);

assert(NUM_INSTRUCTIONS === INSTRUCTION_WAIT_DELAY_MS.length);


export const END_SCREEN_URL = "https://app.prolific.co/submissions/complete?cc=C13ACROL";


// TRIAL PARAMETERS

export const BLANK_SCREEN_TIME_MS = 750;
export const DISPLAY_TIME_MS = 500;
export const KEY_PRESS_INSTRUCTION_LEFT_MAIN = "Press Q";
export const KEY_PRESS_INSTRUCTION_LEFT_SUB = "if the line was left of vertical";
export const KEY_PRESS_INSTRUCTION_RIGHT_MAIN = "Press P";
export const KEY_PRESS_INSTRUCTION_RIGHT_SUB = "if the line was right of vertical";


// EXPERIMENT PARAMETERS

export const RECTANGLE_COLORS = [
    "#000000"
];

export const WIDTHS_POSSIBLE = [
    1
]

export const HEIGHTS_POSSIBLE = [
    11
]

export const DEGREES_POSSIBLE_TRIALS = [
    ...Array(10).fill(15),
    ...Array(10).fill(10),
    ...Array(10).fill(5),
    ...Array(10).fill(2),
    ...Array(10).fill(1),
    ...Array(10).fill(0.5),
    ...Array(10).fill(0.1),
]

export const DEGREES_POSSIBLE_PRACTICE = [
    ...Array(1).fill(15),
    ...Array(1).fill(10),
    ...Array(1).fill(5),
    ...Array(1).fill(2),
    ...Array(1).fill(1),
    ...Array(1).fill(0.5),
    ...Array(1).fill(0.1),
]


assert(DEGREES_POSSIBLE_TRIALS.length === NUM_TRIALS);
assert(DEGREES_POSSIBLE_PRACTICE.length === NUM_PRACTICE_TRIALS)