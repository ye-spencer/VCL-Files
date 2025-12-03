import { atom } from "nanostores";

export const $instruction_level = atom<number>(0);
export function increment_instruction()
{
    $instruction_level.set($instruction_level.get() + 1);
}

export const $trial_start_time = atom<number>(0);
export function setStartTimeNow()
{
    $trial_start_time.set((new Date()).getTime());
}


export const $order = atom<string[]>([]);

export function initializeData(order : string[])
{
    $order.set(order);
}

export function getOrder()
{
    return $order.get();
}

export const $prolificId = atom<string>("");
export const $studyId = atom<string>("");
export const $sessionId = atom<string>("");

export function getProlificId()
{
    return $prolificId.get();
}

export function getStudyId()
{
    return $studyId.get();
}

export function getSessionId()
{
    return $sessionId.get();
}

export function setProlificId(prolificId : string)
{
    $prolificId.set(prolificId);
}

export function setStudyId(studyId : string)
{
    $studyId.set(studyId);
}

export function setSessionId(sessionId : string)
{
    $sessionId.set(sessionId);
}