"""Export trial-level data to all_trials.csv for the Weber fitting Rmd.

The Rmd expects these columns:
  Subject, Status, Grade, ActualNumberRatio, Response_converted

We don't have group/grade info in this study, so Status and Grade are filled
with constants so the Rmd's grouping loops still execute.
"""

import os
from dotenv import load_dotenv
from supabase import create_client
import pandas as pd
import numpy as np

NUM_TRIALS_PER_RATIO_GROUP = 10
RATIOS = {
    "A: 51:50": 51 / 50,
    "B: 41:40": 41 / 40,
    "C: 31:30": 31 / 30,
    "D: 21:20": 21 / 20,
    "E: 5:4": 5 / 4,
    "F: 4:3": 4 / 3,
    "G: 3:2": 3 / 2,
}
EXPECTED_TRIALS_PER_PARTICIPANT = len(RATIOS) * NUM_TRIALS_PER_RATIO_GROUP

load_dotenv()
supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])
df = pd.DataFrame(supabase.table("trials_data_rrr").select("*").execute().data)

df.drop(df[df["prolific_id"] == "TEST OR UNKNOWN"].index, inplace=True)
df.drop(df[df["trial_number"] <= 0].index, inplace=True)

counts = df.groupby("prolific_id")["trial_number"].count()
complete_ids = counts[counts == EXPECTED_TRIALS_PER_PARTICIPANT].index
df = df[df["prolific_id"].isin(complete_ids)].copy()

df["correct_response"] = np.where(
    df["rect_a_height_percent"] > df["rect_b_height_percent"], "q", "p"
)
df["is_correct"] = (df["response"] == df["correct_response"]).astype(int)

df["raw_ratio"] = (
    np.maximum(df["rect_a_height_percent"], df["rect_b_height_percent"])
    / np.minimum(df["rect_a_height_percent"], df["rect_b_height_percent"])
)

out = pd.DataFrame({
    "Subject": df["prolific_id"],
    "Status": "CP",
    "Grade": "adult",
    "ActualNumberRatio": df["raw_ratio"],
    "Response_converted": df["is_correct"],
})

out.to_csv("all_trials.csv", index=False)
print(f"Wrote all_trials.csv ({len(out)} trials, {out['Subject'].nunique()} subjects)")
