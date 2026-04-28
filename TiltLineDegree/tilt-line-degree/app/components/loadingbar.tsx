"use client";

import { useEffect, useRef, useState } from "react";

interface LoadingBarProps {
    waitDelayMS: number,
    onComplete: () => void,
}

export default function LoadingBar({ waitDelayMS, onComplete }: LoadingBarProps) {
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
    const startTimeRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        setDone(false);
        setProgress(0);
        startTimeRef.current = performance.now();

        function tick(now: number) {
            const elapsed = now - startTimeRef.current!;
            const pct = Math.min((elapsed / waitDelayMS) * 100, 100);
            setProgress(pct);
            if (pct < 100) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                setDone(true);
            }
        }

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [waitDelayMS]);

    return (
        <div className="flex flex-col gap-4">
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-end">
                <button
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer invisible data-[visible=true]:visible"
                    data-visible={done}
                    onClick={done ? onComplete : undefined}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
