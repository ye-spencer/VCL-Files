interface ProgressBarProps {
    currentTrial: number;
    totalTrials: number;
}

export default function progressBar({ currentTrial, totalTrials }: ProgressBarProps) {

    const progress = Math.max(0, Math.min(100, (currentTrial / totalTrials) * 100));

    return (
        <div style={{
            width: "15vw",
            height: "1.5vh",
            backgroundColor: "#555",
            borderRadius: "4px",
            overflow: "hidden",
        }}>
            <div style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#4CAF50",
                borderRadius: "4px",
                transition: "width 0.3s ease",
            }} />
        </div>
    );
}