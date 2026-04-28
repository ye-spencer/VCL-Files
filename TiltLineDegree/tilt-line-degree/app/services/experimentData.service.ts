import { TrialParameters } from "../lib/types";
import { NUM_PRACTICE_TRIALS, NUM_TRIALS, DEGREES_POSSIBLE_PRACTICE, DEGREES_POSSIBLE_TRIALS, WIDTHS_POSSIBLE, HEIGHTS_POSSIBLE, RECTANGLE_COLORS } from "../lib/constants";

function getRandomIndex(arr: any[]): number {
    return Math.floor(Math.random() * arr.length);
}

export function generatePracticeTrialParameters(): TrialParameters[] {
    const trialParameters: TrialParameters[] = [];

    const shuffledDegrees = [...DEGREES_POSSIBLE_PRACTICE].sort(() => Math.random() - 0.5);

    for (let i = 0; i < NUM_PRACTICE_TRIALS; i++) {

        const widthFactor = WIDTHS_POSSIBLE[getRandomIndex(WIDTHS_POSSIBLE)];
        const heightFactor = HEIGHTS_POSSIBLE[getRandomIndex(HEIGHTS_POSSIBLE)];

        const tiltDirection = Math.random() < 0.5 ? "left" : "right";
        const degreesTilted = tiltDirection === "right" ? shuffledDegrees[i] : -shuffledDegrees[i];

        trialParameters.push({
            trialNumber: -1 * (NUM_PRACTICE_TRIALS - i),
            degreesTilted: degreesTilted,
            tiltDirection: tiltDirection,
            rectangleHeightPercent: heightFactor,
            rectangleWidthPercent: widthFactor,
            rectangleColor: RECTANGLE_COLORS[getRandomIndex(RECTANGLE_COLORS)],
        });
    }
    return trialParameters;
}

export function generateTrialParameters(): TrialParameters[] {
    const trialParameters: TrialParameters[] = [];

    const shuffledDegrees = [...DEGREES_POSSIBLE_TRIALS].sort(() => Math.random() - 0.5);

    for (let i = 0; i < NUM_TRIALS; i++) {

        const widthFactor = WIDTHS_POSSIBLE[getRandomIndex(WIDTHS_POSSIBLE)];
        const heightFactor = HEIGHTS_POSSIBLE[getRandomIndex(HEIGHTS_POSSIBLE)];

        const tiltDirection = Math.random() < 0.5 ? "left" : "right";
        const degreesTilted = tiltDirection === "right" ? shuffledDegrees[i] : -shuffledDegrees[i];

        trialParameters.push({
            trialNumber: i + 1,
            degreesTilted: degreesTilted,
            tiltDirection: tiltDirection,
            rectangleHeightPercent: heightFactor,
            rectangleWidthPercent: widthFactor,
            rectangleColor: RECTANGLE_COLORS[getRandomIndex(RECTANGLE_COLORS)],
        });
    }
    return trialParameters;
}