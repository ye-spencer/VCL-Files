// export type TrialData = TrialParameters & {
//     response: string,
//     responseTime: number,
//     prolificId: string,
// }

// export type TrialParameters = {
//     trialNumber: number,
//     rectAXPercent: number, // x-coordinate as a percentage, should be between 5%-45%
//     rectAYPercent: number, // y-coordinate as a percentage, should be between 5%-95%
//     rectBXPercent: number, // x-coordinate as a percentage, should be between 55%-95%
//     rectBYPercent: number, // y-coordinate as a percentage, should be between 5%-95%
//     rectAWidthPercent: number, // width as a percentage
//     rectAHeightPercent: number, // height as a percentage, should be between 5-10%
//     rectBWidthPercent: number, // width as a percentage
//     rectBHeightPercent: number, // height as a percentage, should be between 5-10%
//     rectAOrientation: number, // degrees, between 0 and 180
//     rectBOrientation: number, // degrees, between 0 and 180
//     rectAColor: string, // color of rectangle A
//     rectBColor: string, // color of rectangle B
// }

import { z } from "zod";

export const TrialParametersSchema = z.object({
    trialNumber: z.number().int(),
    rectAXPercent: z.number().min(5).max(45),
    rectAYPercent: z.number().min(5).max(95),
    rectBXPercent: z.number().min(55).max(95),
    rectBYPercent: z.number().min(5).max(95),
    rectAWidthPercent: z.number().min(0).max(100),
    rectAHeightPercent: z.number().min(5).max(10),
    rectBWidthPercent: z.number().min(0).max(100),
    rectBHeightPercent: z.number().min(5).max(10),
    rectAOrientation: z.number().min(0).max(180),
    rectBOrientation: z.number().min(0).max(180),
    rectAColor: z.string().min(1).max(50),
    rectBColor: z.string().min(1).max(50),
});

export const TrialDataSchema = TrialParametersSchema.extend({
    response: z.string().min(1).max(1),
    responseTime: z.number().min(0).max(600_000), // 10 minute ceiling, sanity check
    prolificId: z.string().min(1).max(100),
});

export type TrialParameters = z.infer<typeof TrialParametersSchema>;
export type TrialData = z.infer<typeof TrialDataSchema>;
