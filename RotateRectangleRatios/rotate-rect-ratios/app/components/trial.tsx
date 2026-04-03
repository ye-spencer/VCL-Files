import { useCallback, useEffect, useRef, useState } from "react";
import { trialData, trialParameters } from "../lib/types";
import { BLANK_SCREEN_TIME_MS, DISPLAY_TIME_MS, AFTER_DISPLAY_INSTRUCTION, KEY_PRESS_INSTRUCTION } from "../lib/constants";

interface TrialDisplayProps extends trialParameters {
    prolificId: string,
    onComplete: (data: trialData) => void,
}

type TrialPhase = "blank" | "display" | "response";

export default function Trial({ trialNumber, rectAXPercent, rectAYPercent, rectBXPercent, rectBYPercent, rectAWidthPercent, rectAHeightPercent, rectBWidthPercent, rectBHeightPercent, rectAOrientation, rectBOrientation, rectAColor, rectBColor, prolificId, onComplete }: TrialDisplayProps) {

    const [phase, setPhase] = useState<TrialPhase>("blank");
    const responseStartTimeRef = useRef<number>(-1);

    useEffect(() => {
        if (phase === "blank") {
            const timer = setTimeout(() => {
                setPhase("display");
            }, BLANK_SCREEN_TIME_MS);
            return () => clearTimeout(timer);
        }

        if (phase === "display") {
            const timer = setTimeout(() => {
                setPhase("response");
                responseStartTimeRef.current = Date.now();
            }, DISPLAY_TIME_MS);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    // Listen for key presses during the response phase
    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (phase !== "response") return;

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

    // Phase 1: Blank screen
    if (phase === "blank") {
        return (
            <div style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "#808080",
            }} />
        );
    }

    // Phase 2: Display rectangles
    if (phase === "display") {
        return (
            <div style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                backgroundColor: "#808080",
                overflow: "hidden",
            }}>
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
            </div>
        );
    }

    // Phase 3: Response screen
    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#808080",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#ffffff",
            fontFamily: "Arial, sans-serif",
        }}>
            <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                {AFTER_DISPLAY_INSTRUCTION}
            </p>
            <p style={{ fontSize: "1.25rem" }}>
                {KEY_PRESS_INSTRUCTION}
            </p>
        </div>
    );
}

