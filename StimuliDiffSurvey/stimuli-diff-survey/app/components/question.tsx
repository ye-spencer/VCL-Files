"use client";

import { useRef, useState } from "react";
import { RESPONSE_PROMPT } from "../lib/constants";

interface QuestionProps {
    preamble: string,
    statement: string,
    labels: string[], // displayed left -> right beneath the bar
    onSubmit: (displayPercent: number) => void, // 0 = far left of bar, 100 = far right
}

export default function Question({ preamble, statement, labels, onSubmit }: QuestionProps) {
    const barRef = useRef<HTMLDivElement>(null);
    // null until the participant clicks the bar; no marker / disabled submit before then.
    const [percent, setPercent] = useState<number | null>(null);

    function handleBarClick(e: React.MouseEvent<HTMLDivElement>) {
        const rect = barRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
        setPercent(pct);
    }

    const hasAnswer = percent !== null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900 px-6 py-12">
            <div className="w-full max-w-[75%] flex flex-col gap-8">
                <p className="text-[clamp(1rem,1.8vw,1.5rem)] leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {preamble}
                </p>

                <p className="text-[clamp(1rem,1.8vw,1.5rem)] leading-relaxed text-neutral-800 dark:text-neutral-100">
                    How strongly would you agree or disagree with the following statement?
                </p>

                <blockquote className="border-l-4 border-neutral-300 dark:border-neutral-600 pl-4 italic text-[clamp(1rem,1.9vw,1.6rem)] leading-relaxed text-neutral-800 dark:text-neutral-100">
                    “{statement}”
                </blockquote>

                <p className="text-[clamp(0.9rem,1.5vw,1.25rem)] text-neutral-600 dark:text-neutral-300">
                    {RESPONSE_PROMPT}
                </p>

                <div className="flex flex-col gap-2 select-none">
                    {/* Clickable response bar */}
                    <div
                        ref={barRef}
                        onClick={handleBarClick}
                        className="relative w-full h-12 rounded-lg bg-neutral-200 dark:bg-neutral-700 cursor-pointer"
                    >
                        {hasAnswer && (
                            <div
                                className="absolute top-[-6px] bottom-[-6px] w-1 -translate-x-1/2 rounded bg-blue-600 dark:bg-blue-400 pointer-events-none"
                                style={{ left: `${percent}%` }}
                            />
                        )}
                    </div>

                    {/* Scale labels, evenly spaced beneath the bar */}
                    <div className="flex justify-between text-[clamp(0.7rem,1.2vw,1rem)] text-neutral-600 dark:text-neutral-300">
                        {labels.map((label) => (
                            <span key={label} className="text-center flex-1 first:text-left last:text-right">
                                {label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={() => hasAnswer && onSubmit(percent)}
                        disabled={!hasAnswer}
                        className="px-8 py-3 rounded-lg text-[clamp(0.9rem,1.5vw,1.25rem)] font-medium
                                   bg-neutral-800 text-white hover:bg-neutral-700
                                   dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200
                                   transition-colors duration-200 cursor-pointer
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500
                                   disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-800
                                   dark:disabled:hover:bg-neutral-100"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
