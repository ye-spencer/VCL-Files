"use client"

import CustomLoader from "@/components/custom/custom-loader";
import Instruction from "@/components/custom/instruction";
import TrialScreen from "@/components/custom/trial-screen";
import { getDataPermutation } from "@/lib/api";
import { $instruction_level, initializeData, setProlificId, setSessionId, setStudyId } from "@/lib/store";
import { TRIAL_LEVEL } from "@/lib/variables";
import { useStore } from "@nanostores/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function Home() 
{
    const INSTRUCTION_LEVEL = useStore($instruction_level);

    useEffect(() => {
        const initialize = async () => {
            const dataPermutation = await getDataPermutation();
            const { order } = dataPermutation;
            initializeData(order);
        };
        initialize();
    }, []);

    const Params = () => {
        const searchParams = useSearchParams();
        const prolificId = searchParams.get('PROLIFIC_PID') || 'X';
        const studyId = searchParams.get('STUDY_ID') || 'X';
        const sessionId = searchParams.get('SESSION_ID') || 'X';

        useEffect(() => {
            setStudyId(studyId);
            setSessionId(sessionId);
            setProlificId(prolificId);
        }, [prolificId, studyId, sessionId]);

        return null;
    }

    return (
        <div className="flex min-h-dvh">
            <Suspense>
                <Params />
            </Suspense>
            <div className="flex-1 min-w-3 border border-gray-200">
            </div>
            <div className="flex-5 flex flex-col min-h-screen p-1 border border-gray-200">
                <Instruction/>
                { INSTRUCTION_LEVEL === TRIAL_LEVEL && <TrialScreen/> }
                <div className="flex-grow">{/* Buffer */}</div>
                { INSTRUCTION_LEVEL < TRIAL_LEVEL && <CustomLoader/> }
            </div>
            <div className="flex-1 min-w-3 border border-gray-200">
            </div>
        </div>
    );
}


// TODO: update trial screen,
// TODO: update instruction screen,
// TODO: update api hits
// TODO: update data permutation
// TODO: set up database
// 
