"use server";

import { TrialData } from "../lib/types";
import { supabase } from "../lib/supabase";

export async function logTrialData(data: TrialData) {

    const { error } = await supabase.from("trials_data_tld").insert(
        {
            prolific_id: data.prolificId,
            trial_number: data.trialNumber,
            degrees_tilted: data.degreesTilted,
            tilt_direction: data.tiltDirection,
            rectangle_height_percent: data.rectangleHeightPercent,
            rectangle_width_percent: data.rectangleWidthPercent,
            rectangle_color: data.rectangleColor,
            response: data.response,
            response_time: data.responseTime,
        }
    );
    if (error) {
        console.error("Error logging trial data:", error);
    }
}