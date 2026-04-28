import { useCallback, useEffect, useRef, useState } from "react";
import { TrialData, TrialParameters } from "../lib/types";
import { BLANK_SCREEN_TIME_MS, DISPLAY_TIME_MS, KEY_PRESS_INSTRUCTION_LEFT, KEY_PRESS_INSTRUCTION_RIGHT } from "../lib/constants";
import ProgressBar from "./progressbar";

interface TrialDisplayProps extends TrialParameters {
    numTrials: number,
    prolificId: string,
    onComplete: (data: TrialData) => void,
}

type TrialPhase = "blank" | "display" | "response";

export default function Trial({ trialNumber, degreesTilted, tiltDirection, rectangleHeightPercent, rectangleWidthPercent, rectangleColor, numTrials, prolificId, onComplete }: TrialDisplayProps) {

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
            degreesTilted,
            tiltDirection,
            rectangleHeightPercent,
            rectangleWidthPercent,
            rectangleColor,
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
                    {/* Rectangle */}
                    <div style={{
                        position: "absolute",
                        left: `50%`,
                        top: `50%`,
                        width: `${rectangleWidthPercent}%`,
                        height: `${rectangleHeightPercent}%`,
                        backgroundColor: rectangleColor,
                        transform: `translate(-50%, -50%) rotate(${degreesTilted}deg)`,
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
                top: `55%`,
                left: `15%`,
                width: `20%`,
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
                top: `55%`,
                left: `65%`,
                width: `20%`,
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

