"use server";

import { ResponseData } from "../lib/types";
import { supabase } from "../lib/supabase";

export async function logResponse(data: ResponseData) {
    const { error } = await supabase.from("survey_responses_sds").insert(
        {
            prolific_id: data.prolificId,
            question_id: data.questionId,
            score: data.score,
            left_label: data.leftLabel,
            right_label: data.rightLabel,
            question_position: data.questionPosition,
        }
    );
    if (error) {
        console.error("Error logging response data:", error);
    }
}
