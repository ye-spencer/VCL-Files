import { trialData } from "../lib/types";

interface TrialProps {
    trialNumber: number,
    rectAXPercent: number, // x-coordinate as a percentage, should be between 5%-45%
    rectAYPercent: number, // y-coordinate as a percentage, should be between 5%-95%
    rectBXPercent: number, // x-coordinate as a percentage, should be between 55%-95%
    rectBYPercent: number, // y-coordinate as a percentage, should be between 5%-95%
    rectAWidthPercent: number, // width as a percentage
    rectAHeightPercent: number, // height as a percentage, should be between 5-10%
    rectBWidthPercent: number, // width as a percentage
    rectBHeightPercent: number, // height as a percentage, should be between 5-10%
    rectAOrientation: number, // degrees, between 0 and 180
    rectBOrientation: number, // degrees, between 0 and 180
    rectAColor: string, // color of rectangle A
    rectBColor: string, // color of rectangle B
    onComplete: (data: trialData) => void,
}

export default function Trial({ trialNumber, rectAXPercent, rectAYPercent, rectBXPercent, rectBYPercent, rectAWidthPercent, rectAHeightPercent, rectBWidthPercent, rectBHeightPercent, rectAOrientation, rectBOrientation, rectAColor, rectBColor, onComplete }: TrialProps) {
    return (
        <div>
            <h1>Trial {trialNumber}</h1>
        </div>
    );
}

// Start with a blank screen, flash the two rectangles for a set amount of time, then clear the screen and wait for the user to respond.

// Should rectangles have the same width? Should lengths be diff but ratio is same?

