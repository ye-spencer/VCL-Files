import { z } from "zod";

// A single participant response to one agree/disagree question.
export const ResponseDataSchema = z.object({
    prolificId: z.string().min(1).max(100),
    questionId: z.string().min(1).max(100),
    // Canonical agreement score: 0 = does not agree, 100 = agrees.
    // This is direction-independent (the displayed bar may be flipped).
    score: z.number().min(0).max(100),
    // Metadata describing how the bar was shown to this participant.
    leftLabel: z.string().min(1).max(100), // label shown on the far left of the bar
    rightLabel: z.string().min(1).max(100), // label shown on the far right of the bar
    questionPosition: z.number().int().min(1).max(2), // 1 if shown first, 2 if shown second
});

export type ResponseData = z.infer<typeof ResponseDataSchema>;
