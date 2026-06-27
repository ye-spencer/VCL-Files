import { INTRO_TEXT } from "../lib/constants";

interface IntroProps {
    onNext: () => void,
}

export default function Intro({ onNext }: IntroProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900 px-6">
            <div className="w-full max-w-[75%] flex flex-col gap-6">
                <h1 className="text-[clamp(1.5rem,3vw,3rem)] font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
                    Welcome
                </h1>
                <p className="text-[clamp(1rem,2vw,1.75rem)] leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {INTRO_TEXT}
                </p>
                <div className="flex justify-end">
                    <button
                        onClick={onNext}
                        className="px-8 py-3 rounded-lg text-[clamp(0.9rem,1.5vw,1.25rem)] font-medium
                                   bg-neutral-800 text-white hover:bg-neutral-700
                                   dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200
                                   transition-colors duration-200 cursor-pointer
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                    >
                        Begin
                    </button>
                </div>
            </div>
        </div>
    );
}
