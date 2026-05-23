import { CORRECT_SOUND_URL, INCORRECT_SOUND_URL } from "../lib/constants";

let audioContext: AudioContext | null = null;
let correctBuffer: AudioBuffer | null = null;
let incorrectBuffer: AudioBuffer | null = null;

function getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!audioContext) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return null;
        audioContext = new Ctx();
    }
    return audioContext;
}

async function loadBuffer(ctx: AudioContext, url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await ctx.decodeAudioData(arrayBuffer);
}

export function warmupFeedbackSounds(): void {
    const ctx = getContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
    }
    if (!correctBuffer) {
        loadBuffer(ctx, CORRECT_SOUND_URL).then(b => { correctBuffer = b; }).catch(() => {});
    }
    if (!incorrectBuffer) {
        loadBuffer(ctx, INCORRECT_SOUND_URL).then(b => { incorrectBuffer = b; }).catch(() => {});
    }
}

export function playFeedbackSound(isCorrect: boolean): void {
    const ctx = getContext();
    if (!ctx) return;

    const buffer = isCorrect ? correctBuffer : incorrectBuffer;
    if (!buffer) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
}
