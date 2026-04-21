import { END_SCREEN_URL } from "../lib/constants";

export default function EndScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
            <div className="w-full max-w-[75%] flex flex-col gap-6 text-center">
                <h1 className="text-[clamp(1.5rem,3vw,3rem)] font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
                    Thank you for participating in this experiment.
                </h1>
                <p className="text-[clamp(1rem,2vw,1.75rem)] leading-relaxed text-neutral-600 dark:text-neutral-300">
                    If you are participating in this experiment through Prolific, please click the button below to return to the Prolific website.
                </p>
                <button
                    onClick={() => window.location.href = END_SCREEN_URL}
                    className="mx-auto mt-4 px-8 py-3 rounded-lg text-[clamp(0.9rem,1.5vw,1.25rem)] font-medium
                               bg-neutral-800 text-white hover:bg-neutral-700
                               dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200
                               transition-colors duration-200 cursor-pointer
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                >
                    Return to Prolific
                </button>
            </div>
        </div>
    );
}
