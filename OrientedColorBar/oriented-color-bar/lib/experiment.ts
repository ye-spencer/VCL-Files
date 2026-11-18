// Trial generation. One trial = 2-5 miniblock screens (all color singletons or
// all orientation singletons), one redundant screen (a single bar that differs
// in both), then a question about the redundant bar. See BRAINSTORM.md.

export const NUM_TRIALS = 100;
export const NUM_BARS = 6;
export const STIMULUS_MS = 500;
export const BLANK_MS = 500;
export const MINIBLOCKS = [2, 5] as const;
export const COLOR_OFFSET = [90, 180] as const; // hue degrees
export const ORIENTATION_OFFSET = [10, 45] as const; // degrees of tilt
export const STAIRCASE_START = 20;
export const STAIRCASE_STEP = 2;
export const STAIRCASE_MIN = 2;

export type TrialType = "color" | "orientation";
export type Side = "left" | "right";

// Six bars arranged in a circle; bar numbers are 0-5, clockwise from the top.
// Orientations are degrees clockwise from vertical, colors are HSL hues.
export type SearchScreen = {
  default_color_degree: number;
  default_orientation_degree: number;
  diff_orientation: boolean;
  diff_orientation_number: number | null;
  diff_orientation_degree: number | null;
  diff_color: boolean;
  diff_color_number: number | null;
  diff_color_degree: number | null;
};

export type QuestionScreen = {
  trial_type: TrialType;
  which_correct: Side;
  correct_color: number | null; // null = gray
  diff_color: number;
  correct_orientation: number;
  diff_orientation: number;
};

export type Trial = {
  trial_number: number;
  miniblock_type: TrialType;
  miniblocks: SearchScreen[];
  redundant: SearchScreen;
  question: QuestionScreen;
};

// Current question difference, in degrees, for each question type.
export type Staircase = Record<TrialType, number>;

export type TrialResult = {
  prolific_id: string;
  trial: Trial;
  response: Side;
  correct: boolean;
  rt_ms: number;
};

const randInt = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1));
const pick = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const sign = () => pick([1, -1]);
const mod = (n: number, m: number) => ((n % m) + m) % m;

function searchScreen(diffColor: boolean, diffOrientation: boolean): SearchScreen {
  const color = randInt(0, 359);
  const orientation = randInt(0, 179);
  const target = randInt(0, NUM_BARS - 1);
  return {
    default_color_degree: color,
    default_orientation_degree: orientation,
    diff_orientation: diffOrientation,
    diff_orientation_number: diffOrientation ? target : null,
    diff_orientation_degree: diffOrientation
      ? mod(orientation + sign() * randInt(...ORIENTATION_OFFSET), 180)
      : null,
    diff_color: diffColor,
    diff_color_number: diffColor ? target : null,
    diff_color_degree: diffColor
      ? mod(color + sign() * randInt(...COLOR_OFFSET), 360)
      : null,
  };
}

// Generated one at a time because the question difference depends on the
// staircase, which depends on earlier answers.
export function generateTrial(trial_number: number, staircase: Staircase): Trial {
  const miniblock_type = pick<TrialType>(["color", "orientation"]);
  const miniblocks = Array.from({ length: randInt(...MINIBLOCKS) }, () =>
    searchScreen(miniblock_type === "color", miniblock_type === "orientation"),
  );
  const redundant = searchScreen(true, true);

  const trial_type = pick<TrialType>(["color", "orientation"]);
  const which_correct = pick<Side>(["left", "right"]);
  const question: QuestionScreen =
    trial_type === "color"
      ? {
          trial_type,
          which_correct,
          correct_color: redundant.diff_color_degree,
          diff_color: sign() * staircase.color,
          correct_orientation: 0, // vertical
          diff_orientation: 0,
        }
      : {
          trial_type,
          which_correct,
          correct_color: null, // gray
          diff_color: 0,
          correct_orientation: redundant.diff_orientation_degree!,
          diff_orientation: sign() * staircase.orientation,
        };

  return { trial_number, miniblock_type, miniblocks, redundant, question };
}

export function updateStaircase(
  staircase: Staircase,
  type: TrialType,
  correct: boolean,
): Staircase {
  const next = staircase[type] + (correct ? -STAIRCASE_STEP : STAIRCASE_STEP);
  // Never reach 0, or both question bars would be identical.
  return { ...staircase, [type]: Math.max(STAIRCASE_MIN, next) };
}
