import { z } from "zod";

export const TrialParametersSchema = z.object({
    trialNumber: z.number().int(),
    degreesTilted: z.number().min(0).max(20),
    tiltDirection: z.string().min(1).max(10),
    rectangleHeightPercent: z.number().min(0).max(100),
    rectangleWidthPercent: z.number().min(0).max(100),
    rectangleColor: z.string().min(1).max(50),
});

export const TrialDataSchema = TrialParametersSchema.extend({
    response: z.string().min(1).max(1),
    responseTime: z.number().min(0).max(600_000), // 10 minute ceiling, sanity check
    prolificId: z.string().min(1).max(100),
});

export type TrialParameters = z.infer<typeof TrialParametersSchema>;
export type TrialData = z.infer<typeof TrialDataSchema>;
