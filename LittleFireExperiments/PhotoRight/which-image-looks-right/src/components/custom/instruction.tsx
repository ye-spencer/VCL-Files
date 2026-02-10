"use client"

import { $instruction_level } from "@/lib/store";
import { END_LEVEL, TRIAL_LEVEL } from "@/lib/variables";
import { useStore } from "@nanostores/react";

export default function Instruction() {
    let instruction = "Central Level"
    const INSTRUCTION_LEVEL = useStore($instruction_level);


    if (INSTRUCTION_LEVEL === 0) {
        instruction = "Welcome to our task! In this task, you will see four pictures. Each picture includes a person, a dog, and a fireplace. Your job is to click on which picture has the most natural or typical or expected relationship between the person, the dog, and the fireplace. The images are on the next page.";
    }
    else if (INSTRUCTION_LEVEL === TRIAL_LEVEL) {
        instruction = "Which of these images has the most natural or typical or expected relationship between the person, the dog, and the fireplace?";
    }
    else if (INSTRUCTION_LEVEL === END_LEVEL) {
        instruction = "Thank you for your participation.";
    }
    else {
        instruction = "Error: Improper Button Click, Please Refresh"
    }

    return (
        <div className="px-8 pt-10 pb-4 text-lg">
            <div dangerouslySetInnerHTML={{ __html: instruction }} />
            {INSTRUCTION_LEVEL === END_LEVEL && <a href="https://app.prolific.com/submissions/complete?cc=C1MRKKO5" className="text-blue-500 hover:text-blue-700 font-bold"> Please click this link to return to Prolific.</a>}
        </div>
    )
}