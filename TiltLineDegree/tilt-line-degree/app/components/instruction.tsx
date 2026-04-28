import LoadingBar from "./loadingbar";

interface InstructionProps {
    instruction: string,
    waitDelayMS: number,
    onNext: () => void,
}

export default function Instruction({ instruction, waitDelayMS, onNext }: InstructionProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
            <div className="w-full max-w-[75%] flex flex-col gap-6">
                <h1 className="text-[clamp(1.5rem,3vw,3rem)] font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
                    Instructions
                </h1>
                <p className="text-[clamp(1rem,2vw,1.75rem)] leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {instruction}
                </p>
                <LoadingBar waitDelayMS={waitDelayMS} onComplete={onNext} />
            </div>
        </div>
    );
}
