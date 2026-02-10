import { Button } from "@/components/ui/button";
import { $instruction_level, getOrder, getProlificId, getSessionId, getStudyId, increment_instruction } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react";
import { sendDataToServer } from "@/lib/api";

export default function TrialScreen() {

    const [trialStartTime, setTrialStartTime] = useState(0);

    const [selected, setSelected] = useState<string>("");

    const handleClick = (choice: string) => {
        setSelected(choice);
    }

    const handleSubmit = () => {
        sendDataToServer({
            duration: Date.now() - trialStartTime,
            selected: selected,
            prolificId: getProlificId(),
            studyId: getStudyId(),
            sessionId: getSessionId(),
            order: getOrder()
        });
        increment_instruction();
    }

    const [progress, setProgress] = useState(0);
    const loadingDuration = 10000;
    const INSTRUCTION_LEVEL = useStore($instruction_level);

    useEffect(() => {
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percentage = Math.min((elapsed / loadingDuration) * 100, 100);
            setProgress(percentage);

            if (percentage >= 100) {
                clearInterval(interval)
                setTrialStartTime(Date.now());
            }
        }, 100);

        return () => clearInterval(interval);
    }, [INSTRUCTION_LEVEL]);


    const order = getOrder();


    return (
        <div className="w-full">
            {progress < 100 ? (
                <div className="px-10">
                    <div className="flex-grow">{/* Buffer */}</div>
                    <Progress value={Math.min(100, progress * 1.03)} />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-2 my-2 justify-items-center">
                        {order.map((item, index) => (
                            <Button
                                key={index}
                                onClick={() => handleClick(item)}
                                className={`text-xl p-4 shadow-lg transform hover:scale-110 transition-transform w-[85%] h-[95%] border-2 relative break-words whitespace-normal ${selected === item
                                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                                    : 'bg-white hover:bg-gray-100 text-black border-black'
                                    }`}>
                                <div className="flex flex-col items-center">
                                    <img
                                        src={`${item}`}
                                        alt={item}
                                        className="h-[20%] object-contain"
                                        style={{ maxWidth: "70%" }}
                                    />
                                </div>
                            </Button>
                        ))}

                    </div>
                    <div className="h-16 flex justify-center items-center">
                        {selected && <Button className="relative" onClick={handleSubmit}> Submit Answer </Button>}
                    </div>
                </>
            )}
        </div>
    );
}
