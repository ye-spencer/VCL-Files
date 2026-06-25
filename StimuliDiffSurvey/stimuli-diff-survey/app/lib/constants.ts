// INTRO / END SCREEN

export const INTRO_TEXT =
    "In this experiment, you will be asked two questions. " +
    "Each question presents a piece of background information followed by a statement. For each statement, " +
    "you will indicate how strongly you agree or disagree by clicking on a response bar. ";

// TODO: replace with the real Prolific completion URL / code for this study.
export const END_SCREEN_URL = "https://app.prolific.com/submissions/complete?cc=C5N2CHI5";

// QUESTION SCREENS

export const RESPONSE_PROMPT =
    "Please click anywhere on the bar to indicate how strongly you agree or disagree with the statement:";

// Labels shown beneath the bar, ordered from "most disagree" to "most agree".
// The order is reversed for participants whose bar is flipped.
export const SCALE_LABELS = [
    "Strongly Disagree",
    "Weakly Disagree",
    "Weakly Agree",
    "Strongly Agree",
];

export type Question = {
    id: string;
    preamble: string;
    statement: string;
};

export const QUESTIONS: Question[] = [
    {
        id: "threshold_jnd",
        preamble:
            "In psychological measurements, a threshold is a measure of how much two stimuli need to differ in " +
            "order for someone to be able to detect the difference. The point at which a person is barely able to " +
            "be good at detecting the difference is also sometimes called a just noticeable difference.",
        statement:
            "Considering the smells of two similar roses, the sugariness of two similar cakes, the brightness of " +
            "two similar lights, and the sounds of two similar dog barks, for everything we can sense and judge " +
            "there is a point at which the difference between two stimuli is so small that we can no longer " +
            "discriminate them. They just seem the same to us.",
    },
    {
        id: "human_dog_smell",
        preamble:
            "Humans have about 5 to 6 million smell (olfactory) receptors in their nasal cavities, whereas dogs " +
            "have between 100 million and 300 million. This means a dog's sense of smell is more sensitive than " +
            "ours, allowing them to detect scents at concentrations of parts per trillion.",
        statement: "Humans and dogs can smell the exact same chemical molecules and odors in the air.",
    },
];
