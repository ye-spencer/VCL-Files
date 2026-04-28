import assert from "assert";

export const NUM_PRACTICE_TRIALS = 7;
export const NUM_TRIALS = 70;
export const NUM_POST_PRACTICE_INSTRUCTIONS = 1;
export const NUM_INSTRUCTIONS = 3;
export const NUM_END_SCREEN = 1;



export const INSTRUCTIONS = [
    "Hi! Welcome to our experiment! In this experiment, you will be guided through a series of trials where you will be asked to make judgments about rectangles. ",
    "In each trial, you will first see a blank screen, then you will see two rectangles appear on the screen for a brief moment. Then, the rectangles will disappear, and you will be asked to judge which rectangle was longer. Press 'Q' if the left rectangle was longer. Press 'P' if the right rectangle was longer.",
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


export const END_SCREEN_URL = "https://app.prolific.com/submissions/complete?cc=C13ACROL";


// TRIAL PARAMETERS

export const BLANK_SCREEN_TIME_MS = 750;
export const DISPLAY_TIME_MS = 500;
export const AFTER_DISPLAY_INSTRUCTION = "Which rectangle was longer?";
export const KEY_PRESS_INSTRUCTION_LEFT = "Press 'Q' if the left rectangle was longer.";
export const KEY_PRESS_INSTRUCTION_RIGHT = "Press 'P' if the right rectangle was longer.";


// EXPERIMENT PARAMETERS

export const RECTANGLE_COLORS = [
    "#e74c3c",
    "#3498db",
    "#2ecc71",
    "#f39c12",
    "#9b59b6",
    "#1abc9c",
    "#e67e22",
    "#2980b9",
    "#27ae60",
    "#8e44ad",
];

export const WIDTHS_POSSIBLE = [
    1
]

export const HEIGHTS_POSSIBLE = [
    5, 7, 9
]

export const RATIOS_LONG_TRIALS = [
    ...Array(10).fill(51 / 50),
    ...Array(10).fill(41 / 40),
    ...Array(10).fill(31 / 30),
    ...Array(10).fill(21 / 20),
    ...Array(10).fill(5 / 4),
    ...Array(10).fill(4 / 3),
    ...Array(10).fill(3 / 2),
]

export const RATIOS_LONG_PRACTICE = [
    ...Array(1).fill(51 / 50),
    ...Array(1).fill(41 / 40),
    ...Array(1).fill(31 / 30),
    ...Array(1).fill(21 / 20),
    ...Array(1).fill(5 / 4),
    ...Array(1).fill(4 / 3),
    ...Array(1).fill(3 / 2),
]

export const ALLOWABLE_RECTANGLE_LEFT_X_MIN = 25;
export const ALLOWABLE_RECTANGLE_LEFT_X_MAX = 42.5;

export const ALLOWABLE_RECTANGLE_RIGHT_X_MIN = 57.5;
export const ALLOWABLE_RECTANGLE_RIGHT_X_MAX = 75;

export const ALLOWABLE_RECTANGLE_Y_MIN = 10;
export const ALLOWABLE_RECTANGLE_Y_MAX = 70;

export const ALLOWABLE_RECTANGLE_ROTATION_MIN = 0;
export const ALLOWABLE_RECTANGLE_ROTATION_MAX = 180;

export const MAX_HEIGHT_RECTANGLE_HALF = 5;


assert(RATIOS_LONG_TRIALS.length === NUM_TRIALS);
assert(RATIOS_LONG_PRACTICE.length === NUM_PRACTICE_TRIALS);

// TODO: Tune these values
