import { TrialParameters } from "../lib/types";
import { NUM_PRACTICE_TRIALS, NUM_TRIALS, RATIOS_LONG_PRACTICE, RATIOS_LONG_TRIALS, WIDTHS_POSSIBLE, HEIGHTS_POSSIBLE, RECTANGLE_COLORS, ALLOWABLE_RECTANGLE_LEFT_X_MIN, ALLOWABLE_RECTANGLE_LEFT_X_MAX, ALLOWABLE_RECTANGLE_RIGHT_X_MIN, ALLOWABLE_RECTANGLE_RIGHT_X_MAX, ALLOWABLE_RECTANGLE_Y_MIN, ALLOWABLE_RECTANGLE_Y_MAX, ALLOWABLE_RECTANGLE_ROTATION_MIN, ALLOWABLE_RECTANGLE_ROTATION_MAX } from "../lib/constants";

function getRandomBetween(min: number, max: number): number {
    return (Math.random() * (max - min)) + min;
}

function getRandomIndex(arr: any[]): number {
    return Math.floor(Math.random() * arr.length);
}

export function generatePracticeTrialParameters(): TrialParameters[] {
    const trialParameters: TrialParameters[] = [];

    const shuffledRatios = [...RATIOS_LONG_PRACTICE].sort(() => Math.random() - 0.5);

    for (let i = 0; i < NUM_PRACTICE_TRIALS; i++) {

        const widthFactor = WIDTHS_POSSIBLE[getRandomIndex(WIDTHS_POSSIBLE)];
        const heightFactor = HEIGHTS_POSSIBLE[getRandomIndex(HEIGHTS_POSSIBLE)];

        const larger = heightFactor * shuffledRatios[i];
        const [rectAHeightPercent, rectBHeightPercent] =
            Math.random() < 0.5 ? [heightFactor, larger] : [larger, heightFactor];

        trialParameters.push({
            trialNumber: -1 * (NUM_PRACTICE_TRIALS - i),
            rectAXPercent: getRandomBetween(ALLOWABLE_RECTANGLE_LEFT_X_MIN, ALLOWABLE_RECTANGLE_LEFT_X_MAX),
            rectAYPercent: getRandomBetween(ALLOWABLE_RECTANGLE_Y_MIN, ALLOWABLE_RECTANGLE_Y_MAX),
            rectBXPercent: getRandomBetween(ALLOWABLE_RECTANGLE_RIGHT_X_MIN, ALLOWABLE_RECTANGLE_RIGHT_X_MAX),
            rectBYPercent: getRandomBetween(ALLOWABLE_RECTANGLE_Y_MIN, ALLOWABLE_RECTANGLE_Y_MAX),
            rectAWidthPercent: widthFactor,
            rectAHeightPercent: rectAHeightPercent,
            rectBWidthPercent: widthFactor,
            rectBHeightPercent: rectBHeightPercent,
            rectAOrientation: getRandomBetween(ALLOWABLE_RECTANGLE_ROTATION_MIN, ALLOWABLE_RECTANGLE_ROTATION_MAX),
            rectBOrientation: getRandomBetween(ALLOWABLE_RECTANGLE_ROTATION_MIN, ALLOWABLE_RECTANGLE_ROTATION_MAX),
            rectAColor: RECTANGLE_COLORS[getRandomIndex(RECTANGLE_COLORS)],
            rectBColor: RECTANGLE_COLORS[getRandomIndex(RECTANGLE_COLORS)],
        });
    }
    return trialParameters;
}

export function generateTrialParameters(): TrialParameters[] {
    const trialParameters: TrialParameters[] = [];

    const shuffledRatios = [...RATIOS_LONG_TRIALS].sort(() => Math.random() - 0.5);

    for (let i = 0; i < NUM_TRIALS; i++) {

        const widthFactor = WIDTHS_POSSIBLE[getRandomIndex(WIDTHS_POSSIBLE)];
        const heightFactor = HEIGHTS_POSSIBLE[getRandomIndex(HEIGHTS_POSSIBLE)];

        const larger = heightFactor * shuffledRatios[i];
        const [rectAHeightPercent, rectBHeightPercent] =
            Math.random() < 0.5 ? [heightFactor, larger] : [larger, heightFactor];

        trialParameters.push({
            trialNumber: i + 1,
            rectAXPercent: getRandomBetween(ALLOWABLE_RECTANGLE_LEFT_X_MIN, ALLOWABLE_RECTANGLE_LEFT_X_MAX),
            rectAYPercent: getRandomBetween(ALLOWABLE_RECTANGLE_Y_MIN, ALLOWABLE_RECTANGLE_Y_MAX),
            rectBXPercent: getRandomBetween(ALLOWABLE_RECTANGLE_RIGHT_X_MIN, ALLOWABLE_RECTANGLE_RIGHT_X_MAX),
            rectBYPercent: getRandomBetween(ALLOWABLE_RECTANGLE_Y_MIN, ALLOWABLE_RECTANGLE_Y_MAX),
            rectAWidthPercent: widthFactor,
            rectAHeightPercent: rectAHeightPercent,
            rectBWidthPercent: widthFactor,
            rectBHeightPercent: rectBHeightPercent,
            rectAOrientation: getRandomBetween(ALLOWABLE_RECTANGLE_ROTATION_MIN, ALLOWABLE_RECTANGLE_ROTATION_MAX),
            rectBOrientation: getRandomBetween(ALLOWABLE_RECTANGLE_ROTATION_MIN, ALLOWABLE_RECTANGLE_ROTATION_MAX),
            rectAColor: RECTANGLE_COLORS[getRandomIndex(RECTANGLE_COLORS)],
            rectBColor: RECTANGLE_COLORS[getRandomIndex(RECTANGLE_COLORS)],
        });
    }
    return trialParameters;
}