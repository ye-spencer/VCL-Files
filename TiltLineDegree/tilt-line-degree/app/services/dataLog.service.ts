"use server";

import { TrialData } from "../lib/types";
import { supabase } from "../lib/supabase";

export async function logTrialData(data: TrialData) {
    const { error } = await supabase.from("trials_data_rrr").insert(
        {
            prolific_id: data.prolificId,
            trial_number: data.trialNumber,
            rect_a_x_percent: data.rectAXPercent,
            rect_a_y_percent: data.rectAYPercent,
            rect_b_x_percent: data.rectBXPercent,
            rect_b_y_percent: data.rectBYPercent,
            rect_a_width_percent: data.rectAWidthPercent,
            rect_a_height_percent: data.rectAHeightPercent,
            rect_b_width_percent: data.rectBWidthPercent,
            rect_b_height_percent: data.rectBHeightPercent,
            rect_a_orientation: data.rectAOrientation,
            rect_b_orientation: data.rectBOrientation,
            rect_a_color: data.rectAColor,
            rect_b_color: data.rectBColor,
            response: data.response,
            response_time: data.responseTime,
        }
    );
    if (error) {
        console.error("Error logging trial data:", error);
    }
}