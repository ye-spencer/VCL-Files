// Fair coin flip, used to randomize the bar direction per participant.
export function coinFlip(): boolean {
    return Math.random() < 0.5;
}

// Fisher-Yates shuffle, used to randomize the order questions are presented in.
export function shuffle<T>(array: readonly T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
