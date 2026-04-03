"use client";

import { useEffect, useState } from "react";
import Instruction from "./components/instruction";
import Trial from "./components/trial";
import EndScreen from "./components/endscreen";
import { getInstruction, getPostPracticeInstruction, getTrialType, getInstructionWaitDelayMS, getPostPracticeInstructionWaitDelayMS } from "./lib/helpers";
import { generatePracticeTrialParameters, generateTrialParameters } from "./services/experimentData.service";
import { NUM_INSTRUCTIONS, NUM_POST_PRACTICE_INSTRUCTIONS, NUM_PRACTICE_TRIALS } from "./lib/constants";
import { trialParameters } from "./lib/types";
import { logTrialData } from "./services/dataLog.service";

export default function Home() {

    const [pageNumber, setPageNumber] = useState(1);

    const trialType = getTrialType(pageNumber);

    const [practiceTrialParameters, setPracticeTrialParameters] = useState<trialParameters[]>([]);
    const [trialParameters, setTrialParameters] = useState<trialParameters[]>([]);

    const [prolificId, setProlificId] = useState<string>("TEST OR UNKNOWN");

    useEffect(() => {
        // Capture Query Parameter for Prolific
        const urlParams = new URLSearchParams(window.location.search);
        const prolificIdTemp = urlParams.get("PROLIFIC_PID");
        if (prolificIdTemp) {
            setProlificId(prolificIdTemp);
        }

        // Generate and save trial parameters
        const practiceTrialParametersTemp = generatePracticeTrialParameters();
        const trialParametersTemp = generateTrialParameters();

        setPracticeTrialParameters(practiceTrialParametersTemp);
        setTrialParameters(trialParametersTemp);


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
                    {...practiceTrialParameters[pageNumber - (NUM_INSTRUCTIONS + 1)]}
                    prolificId={prolificId}
                    onComplete={(data) => {
                        logTrialData(data);
                        setPageNumber(pageNumber + 1);
                    }}
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
                    {...trialParameters[pageNumber - (NUM_INSTRUCTIONS + NUM_PRACTICE_TRIALS + NUM_POST_PRACTICE_INSTRUCTIONS + 1)]}
                    prolificId={prolificId}
                    onComplete={(data) => {
                        logTrialData(data);
                        setPageNumber(pageNumber + 1);
                    }}
                />
            }
            {
                trialType === "END" &&
                <EndScreen />
            }
        </div>
    );
}