import { NUM_PRACTICE_TRIALS, NUM_TRIALS, NUM_POST_PRACTICE_INSTRUCTIONS, NUM_INSTRUCTIONS, NUM_END_SCREEN, POST_PRACTICE_INSTRUCTIONS, INSTRUCTIONS, INSTRUCTION_WAIT_DELAY_MS, POST_PRACTICE_INSTRUCTION_WAIT_DELAY_MS } from "./constants";

export function getTrialType(pageNumber: number) {
    if (pageNumber <= NUM_INSTRUCTIONS) {
        return "INSTRUCTION";
    }
    if (pageNumber <= NUM_INSTRUCTIONS + NUM_PRACTICE_TRIALS) {
        return "PRACTICE";
    }
    if (pageNumber <= NUM_INSTRUCTIONS + NUM_PRACTICE_TRIALS + NUM_POST_PRACTICE_INSTRUCTIONS) {
        return "POST_PRACTICE_INSTRUCTION";
    }
    if (pageNumber <= NUM_INSTRUCTIONS + NUM_PRACTICE_TRIALS + NUM_POST_PRACTICE_INSTRUCTIONS + NUM_TRIALS) {
        return "TRIAL";
    }
    if (pageNumber <= NUM_INSTRUCTIONS + NUM_PRACTICE_TRIALS + NUM_POST_PRACTICE_INSTRUCTIONS + NUM_TRIALS + NUM_END_SCREEN) {
        return "END";
    }
    return "UNKNOWN";
}

export function getInstruction(pageNumber: number) {
    const index = pageNumber - 1;
    if (index < 0 || index >= INSTRUCTIONS.length) {
        throw new Error("Invalid page number for instruction");
    }
    return INSTRUCTIONS[index];
}

export function getInstructionWaitDelayMS(pageNumber: number) {
    const index = pageNumber - 1;
    if (index < 0 || index >= INSTRUCTION_WAIT_DELAY_MS.length) {
        throw new Error("Invalid page number for instruction wait delay");
    }
    return INSTRUCTION_WAIT_DELAY_MS[index];
}

export function getPostPracticeInstruction(pageNumber: number) {
    const index = pageNumber - NUM_INSTRUCTIONS - NUM_PRACTICE_TRIALS;
    if (index < 0 || index >= POST_PRACTICE_INSTRUCTIONS.length) {
        throw new Error("Invalid page number for post practice instruction");
    }
    return POST_PRACTICE_INSTRUCTIONS[index];
}

export function getPostPracticeInstructionWaitDelayMS(pageNumber: number) {
    const index = pageNumber - NUM_INSTRUCTIONS - NUM_PRACTICE_TRIALS;
    if (index < 0 || index >= POST_PRACTICE_INSTRUCTION_WAIT_DELAY_MS.length) {
        throw new Error("Invalid page number for post practice instruction wait delay");
    }
    return POST_PRACTICE_INSTRUCTION_WAIT_DELAY_MS[index];
}
