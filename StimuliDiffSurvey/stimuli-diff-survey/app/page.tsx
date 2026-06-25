"use client";

import { useEffect, useState } from "react";
import Intro from "./components/intro";
import Question from "./components/question";
import EndScreen from "./components/endscreen";
import { QUESTIONS, SCALE_LABELS } from "./lib/constants";
import { coinFlip, shuffle } from "./lib/helpers";
import { logResponse } from "./services/dataLog.service";

// Four screens: 0 = intro, 1 = first question, 2 = second question, 3 = end.
export default function Home() {

    const [screen, setScreen] = useState(0);

    const [prolificId, setProlificId] = useState<string>("TEST OR UNKNOWN");

    // Per-participant randomization, decided once on mount.
    // agreeOnRight === true  -> bar reads Strongly Disagree (left) ... Strongly Agree (right)
    // agreeOnRight === false -> the bar (and its labels) are flipped.
    const [agreeOnRight, setAgreeOnRight] = useState(true);
    // The order the two questions are presented in, e.g. [1, 0].
    const [order, setOrder] = useState<number[]>([0, 1]);

    useEffect(() => {
        // Capture Prolific ID from the query parameters.
        const urlParams = new URLSearchParams(window.location.search);
        const prolificIdTemp = urlParams.get("PROLIFIC_PID");
        if (prolificIdTemp) {
            setProlificId(prolificIdTemp);
        }

        // Randomize bar direction (same for both questions) and question order.
        setAgreeOnRight(coinFlip());
        setOrder(shuffle([0, 1]));
    }, []);

    const labels = agreeOnRight ? SCALE_LABELS : [...SCALE_LABELS].reverse();
    const leftLabel = labels[0];
    const rightLabel = labels[labels.length - 1];

    // screen 1 -> position 1, screen 2 -> position 2
    const position = screen;
    const questionIndex = order[position - 1];
    const question = QUESTIONS[questionIndex];

    function handleSubmit(displayPercent: number) {
        // Convert the clicked bar position into a canonical agreement score
        // (0 = does not agree, 100 = agrees), independent of display direction.
        const score = agreeOnRight ? displayPercent : 100 - displayPercent;

        logResponse({
            prolificId,
            questionId: question.id,
            score,
            leftLabel,
            rightLabel,
            questionPosition: position,
        });

        setScreen(screen + 1);
    }

    return (
        <div>
            {screen === 0 && <Intro onNext={() => setScreen(1)} />}
            {(screen === 1 || screen === 2) && (
                <Question
                    key={question.id}
                    preamble={question.preamble}
                    statement={question.statement}
                    labels={labels}
                    onSubmit={handleSubmit}
                />
            )}
            {screen === 3 && <EndScreen />}
        </div>
    );
}
