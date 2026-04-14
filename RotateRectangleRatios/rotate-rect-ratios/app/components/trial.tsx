import { useCallback, useEffect, useRef, useState } from "react";
import { TrialData, TrialParameters } from "../lib/types";
import { BLANK_SCREEN_TIME_MS, DISPLAY_TIME_MS, KEY_PRESS_INSTRUCTION_LEFT, KEY_PRESS_INSTRUCTION_RIGHT } from "../lib/constants";
import ProgressBar from "./progressbar";

type TrialDisplayProps = TrialParameters & {
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
            {/* Phase-specific content */}
            {phase === "display" && (
                <>
                    {/* Rectangle A */}
                    <div style={{
                        position: "absolute",
                        left: `${rectAXPercent}%`,
                        top: `${rectAYPercent}%`,
                        width: `${rectAWidthPercent}vw`,
                        height: `${rectAHeightPercent}vh`,
                        backgroundColor: rectAColor,
                        transform: `translate(-50%, -50%) rotate(${rectAOrientation}deg)`,
                    }} />
                    {/* Rectangle B */}
                    <div style={{
                        position: "absolute",
                        left: `${rectBXPercent}%`,
                        top: `${rectBYPercent}%`,
                        width: `${rectBWidthPercent}vw`,
                        height: `${rectBHeightPercent}vh`,
                        backgroundColor: rectBColor,
                        transform: `translate(-50%, -50%) rotate(${rectBOrientation}deg)`,
                    }} />
                    {/* Fixation cross */}
                    <div style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#ffffff",
                        fontSize: "2rem",
                        fontFamily: "Arial, sans-serif",
                        userSelect: "none",
                    }}>+</div>
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

            {/* Persistent bottom instructions — visible in all phases */}
            <div style={{
                position: "absolute",
                bottom: "2rem",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "space-between",
                padding: "0 4rem",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
            }}>
                <p style={{ fontSize: "1.25rem" }}>
                    {KEY_PRESS_INSTRUCTION_LEFT}
                </p>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <p style={{ fontSize: "1.25rem", margin: "0 0 0.25rem 0" }}>
                        Time Remaining
                    </p>
                    <ProgressBar currentTrial={trialNumber} totalTrials={numTrials} />
                </div>
                <p style={{ fontSize: "1.25rem" }}>
                    {KEY_PRESS_INSTRUCTION_RIGHT}
                </p>
            </div>
        </div>
    );
}

