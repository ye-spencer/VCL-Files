"use client"

import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { $instruction_level, increment_instruction, setStartTimeNow } from "@/lib/store";
import { useStore } from "@nanostores/react";

export default function CustomLoader()
{

    const loadingTimes = [
        6650, /* Level 1, Welcome */
        5000, /* Level 2,  the trial */
    ]

    const [progress, setProgress] = useState(0);
    const [loadingDuration, setNextDuration] = useState(loadingTimes[0]);
    const INSTRUCTION_LEVEL = useStore($instruction_level); 



    const handleClick = () => 
    {
        setProgress(0);
        increment_instruction();
        setNextDuration(loadingTimes[INSTRUCTION_LEVEL + 1]);
        setStartTimeNow();
    };

    useEffect(() => {
        const startTime = Date.now();
        
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percentage = Math.min((elapsed / loadingDuration) * 100, 100);
            setProgress(percentage);
    
            if (percentage >= 100)
            {
                clearInterval(interval)
            }
        }, 100);
    
        return () => clearInterval(interval);
      }, [loadingDuration, INSTRUCTION_LEVEL]);

    return (
        <div className="px-10 h-24">
            <div className="h-16 flex justify-center items-center">
                { progress >= 100 && 
                    ( <Button className="items-center" onClick={handleClick}> Next </Button> ) 
                }
            </div>
            <Progress value={ Math.min(100, progress * 1.03) }/>
        </div>
    )
}