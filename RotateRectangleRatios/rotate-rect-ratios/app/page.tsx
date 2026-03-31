"use client";

import { useEffect, useState } from "react";
import Instruction from "./components/instruction";
import Trial from "./components/trial";
import EndScreen from "./components/endscreen";
import { getInstruction, getPostPracticeInstruction, getTrialType, getInstructionWaitDelayMS, getPostPracticeInstructionWaitDelayMS } from "./lib/helpers";

export default function Home() {

    const [pageNumber, setPageNumber] = useState(1);

    const trialType = getTrialType(pageNumber);

    useEffect(() => {
        // Capture Query Parameter for Prolific
        // Generate and save trial parameters
    }, []);

    return (
        <div>
            {
                trialType === "INSTRUCTION" &&
                <Instruction
                    instruction={getInstruction(pageNumber)}
                    waitDelayMS={getInstructionWaitDelayMS(pageNumber)}
                    onNext={() => setPageNumber(pageNumber + 1)}
                />
            }
            {
                trialType === "PRACTICE" &&
                <Trial
                    trialNumber={pageNumber}
                    onComplete={() => setPageNumber(pageNumber + 1)}
                />
            }
            {
                trialType === "POST_PRACTICE_INSTRUCTION" &&
                <Instruction
                    instruction={getPostPracticeInstruction(pageNumber)}
                    waitDelayMS={getPostPracticeInstructionWaitDelayMS(pageNumber)}
                    onNext={() => setPageNumber(pageNumber + 1)}
                />
            }
            {
                trialType === "TRIAL" &&
                <Trial
                    trialNumber={pageNumber}
                    onComplete={() => setPageNumber(pageNumber + 1)}
                />
            }
            {
                trialType === "END" &&
                <EndScreen />
            }
        </div>
    );
}