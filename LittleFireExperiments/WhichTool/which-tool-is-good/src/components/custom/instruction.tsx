"use client"

import { $instruction_level } from "@/lib/store";
import { END_LEVEL, TRIAL_LEVEL } from "@/lib/variables";
import { useStore } from "@nanostores/react";

export default function Instruction() 
{
    let instruction = "Central Level"
    const INSTRUCTION_LEVEL = useStore($instruction_level);


    if (INSTRUCTION_LEVEL === 0)
    {
        instruction = "Welcome to our task. In this task, you will be asked a question, and select your choice from the options provided. The question is on the next page.";
    }
    else if (INSTRUCTION_LEVEL === TRIAL_LEVEL)
    {
        instruction = "<p>Naked and Afraid is an American reality series that airs on the Discovery Channel. Each episode chronicles the lives of two survivalists who meet for the first time naked and are given the task of surviving a stay in the wilderness for 21 days. Each survivalist is allowed to bring one helpful item. After they meet in the assigned location, the partners must work together to build a shelter and find water and food.\n\nImagine that you are a contestant on this show. You are allowed to bring one item with you. What one item would you bring?</p>";
    }
    else if (INSTRUCTION_LEVEL === END_LEVEL)
    {
        instruction = "Thank you for your participation.";
    }
    else
    {
        instruction = "Error: Improper Button Click, Please Refresh"
    }

    // TODO: fix the link, update vercel env
    return (
        <div className="px-8 pt-10 pb-4 text-lg">
            <div dangerouslySetInnerHTML={{ __html: instruction }} />
            {INSTRUCTION_LEVEL === END_LEVEL && <a href="https://app.prolific.com/submissions/complete?cc=C1MRKKO5" className="text-blue-500 hover:text-blue-700 font-bold"> Please click this link to return to Prolific.</a>}
        </div>
    )
}