import assert from "assert";

export const NUM_PRACTICE_TRIALS = 3;
export const NUM_TRIALS = 80;
export const NUM_POST_PRACTICE_INSTRUCTIONS = 1;
export const NUM_INSTRUCTIONS = 4;
export const NUM_END_SCREEN = 1;



export const INSTRUCTIONS = [
    "Here is some information. A",
    "Here is some information. B",
    "Here is some information. C",
    "The practice trials will now begin. "
];

export const INSTRUCTION_WAIT_DELAY_MS = [
    20000,
    15000,
    10000,
    5000
];

export const POST_PRACTICE_INSTRUCTIONS = [
    "The practice trials are now over. The real trials will now begin. "
];

export const POST_PRACTICE_INSTRUCTION_WAIT_DELAY_MS = [
    10000,
];


assert(NUM_POST_PRACTICE_INSTRUCTIONS === POST_PRACTICE_INSTRUCTIONS.length);

assert(NUM_INSTRUCTIONS === INSTRUCTIONS.length);

assert(NUM_POST_PRACTICE_INSTRUCTIONS === POST_PRACTICE_INSTRUCTION_WAIT_DELAY_MS.length);

assert(NUM_INSTRUCTIONS === INSTRUCTION_WAIT_DELAY_MS.length);


export const TRIAL_BLANK_TIME = 500;
export const TRIAL_DISPLAY_TIME = 100;

export const END_SCREEN_URL = "https://app.prolific.co/submissions/complete?cc=C1MRKKO5"; // TODO: Update with actual URL
