import { useCallback, useEffect, useRef, useState } from "react";
import { TrialData, TrialParameters } from "../lib/types";
import { BLANK_SCREEN_TIME_MS, DISPLAY_TIME_MS, KEY_PRESS_INSTRUCTION_LEFT, KEY_PRESS_INSTRUCTION_RIGHT, ALLOWABLE_RECTANGLE_LEFT_X_MIN, ALLOWABLE_RECTANGLE_LEFT_X_MAX, ALLOWABLE_RECTANGLE_RIGHT_X_MIN, ALLOWABLE_RECTANGLE_RIGHT_X_MAX, ALLOWABLE_RECTANGLE_Y_MIN, ALLOWABLE_RECTANGLE_Y_MAX, MAX_HEIGHT_RECTANGLE_HALF } from "../lib/constants";
import ProgressBar from "./progressbar";

interface TrialDisplayProps extends TrialParameters {
    numTrials: number,
    prolificId: string,
    onComplete: (data: TrialData) => void,
}

type TrialPhase = "blank" | "display" | "response";

export default function Trial({ trialNumber, rectAXPercent, rectAYPercent, rectBXPercent, rectBYPercent, rectAWidthPercent, rectAHeightPercent, rectBWidthPercent, rectBHeightPercent, rectAOrientation, rectBOrientation, rectAColor, rectBColor, numTrials, prolificId, onComplete }: TrialDisplayProps) {

    const [phase, setPhase] = useState<TrialPhase>("blank");
    const responseStartTimeRef = useRef<number>(-1);

    useEffect(() => {
        if (phase === "blank") {
            const timer = setTimeout(() => {
                setPhase("display");
                responseStartTimeRef.current = Date.now();
            }, BLANK_SCREEN_TIME_MS);
            return () => clearTimeout(timer);
        }

        if (phase === "display") {
            const timer = setTimeout(() => {
                setPhase("response");
            }, DISPLAY_TIME_MS);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    // Listen for key presses during the response phase
    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (phase !== "response" && phase !== "display") return;

        const key = e.key.toLowerCase();
        if (key !== "q" && key !== "p") return;

        const responseTime = Date.now() - responseStartTimeRef.current;

        onComplete({
            trialNumber,
            rectAXPercent,
            rectAYPercent,
            rectBXPercent,
            rectBYPercent,
            rectAWidthPercent,
            rectAHeightPercent,
            rectBWidthPercent,
            rectBHeightPercent,
            rectAOrientation,
            rectBOrientation,
            rectAColor,
            rectBColor,
            prolificId,
            response: key,
            responseTime,
        });

        setPhase("blank");
    }, [phase, onComplete]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [handleKeyPress]);

    return (
        <div style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            backgroundColor: "#808080",
            overflow: "hidden",
        }}>
            {/* Persistent outline boxes showing allowable rectangle areas */}
            <div style={{
                position: "absolute",
                left: `${ALLOWABLE_RECTANGLE_LEFT_X_MIN - MAX_HEIGHT_RECTANGLE_HALF}%`,
                top: `${ALLOWABLE_RECTANGLE_Y_MIN - MAX_HEIGHT_RECTANGLE_HALF}%`,
                width: `${ALLOWABLE_RECTANGLE_LEFT_X_MAX - ALLOWABLE_RECTANGLE_LEFT_X_MIN + MAX_HEIGHT_RECTANGLE_HALF * 2}%`,
                height: `${ALLOWABLE_RECTANGLE_Y_MAX - ALLOWABLE_RECTANGLE_Y_MIN + MAX_HEIGHT_RECTANGLE_HALF * 2}%`,
                border: "2px solid rgba(11, 1, 1, 0.4)",
                boxSizing: "border-box",
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute",
                left: `${ALLOWABLE_RECTANGLE_RIGHT_X_MIN - MAX_HEIGHT_RECTANGLE_HALF}%`,
                top: `${ALLOWABLE_RECTANGLE_Y_MIN - MAX_HEIGHT_RECTANGLE_HALF}%`,
                width: `${ALLOWABLE_RECTANGLE_RIGHT_X_MAX - ALLOWABLE_RECTANGLE_RIGHT_X_MIN + MAX_HEIGHT_RECTANGLE_HALF * 2}%`,
                height: `${ALLOWABLE_RECTANGLE_Y_MAX - ALLOWABLE_RECTANGLE_Y_MIN + MAX_HEIGHT_RECTANGLE_HALF * 2}%`,
                border: "2px solid rgba(11, 1, 1, 0.4)",
                boxSizing: "border-box",
                pointerEvents: "none",
            }} />

            {/* Phase-specific content */}
            {phase === "display" && (
                <>
                    {/* Rectangle A */}
                    <div style={{
                        position: "absolute",
                        left: `${rectAXPercent}%`,
                        top: `${rectAYPercent}%`,
                        width: `${rectAWidthPercent}%`,
                        height: `${rectAHeightPercent}%`,
                        backgroundColor: rectAColor,
                        transform: `translate(-50%, -50%) rotate(${rectAOrientation}deg)`,
                    }} />
                    {/* Rectangle B */}
                    <div style={{
                        position: "absolute",
                        left: `${rectBXPercent}%`,
                        top: `${rectBYPercent}%`,
                        width: `${rectBWidthPercent}%`,
                        height: `${rectBHeightPercent}%`,
                        backgroundColor: rectBColor,
                        transform: `translate(-50%, -50%) rotate(${rectBOrientation}deg)`,
                    }} />
                </>
            )}

            {phase === "response" && (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                }}>
                </div>
            )}

            {/* Left instruction — centered beneath left box */}
            <p style={{
                position: "absolute",
                top: `${ALLOWABLE_RECTANGLE_Y_MAX + MAX_HEIGHT_RECTANGLE_HALF + 2}%`,
                left: `${ALLOWABLE_RECTANGLE_LEFT_X_MIN - MAX_HEIGHT_RECTANGLE_HALF}%`,
                width: `${ALLOWABLE_RECTANGLE_LEFT_X_MAX - ALLOWABLE_RECTANGLE_LEFT_X_MIN + MAX_HEIGHT_RECTANGLE_HALF * 2}%`,
                textAlign: "center",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "1.25rem",
                margin: 0,
                pointerEvents: "none",
            }}>
                {KEY_PRESS_INSTRUCTION_LEFT}
            </p>

            {/* Progress bar — centered between boxes */}
            <div style={{
                position: "absolute",
                top: `90%`,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                pointerEvents: "none",
            }}>
                <p style={{ fontSize: "1.25rem", margin: "0 0 0.25rem 0" }}>
                    Time Remaining
                </p>
                <ProgressBar currentTrial={trialNumber} totalTrials={numTrials} />
            </div>

            {/* Right instruction — centered beneath right box */}
            <p style={{
                position: "absolute",
                top: `${ALLOWABLE_RECTANGLE_Y_MAX + MAX_HEIGHT_RECTANGLE_HALF + 2}%`,
                left: `${ALLOWABLE_RECTANGLE_RIGHT_X_MIN - MAX_HEIGHT_RECTANGLE_HALF}%`,
                width: `${ALLOWABLE_RECTANGLE_RIGHT_X_MAX - ALLOWABLE_RECTANGLE_RIGHT_X_MIN + MAX_HEIGHT_RECTANGLE_HALF * 2}%`,
                textAlign: "center",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "1.25rem",
                margin: 0,
                pointerEvents: "none",
            }}>
                {KEY_PRESS_INSTRUCTION_RIGHT}
            </p>
        </div>
    );
}

