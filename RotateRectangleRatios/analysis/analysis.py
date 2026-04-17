import os
from dotenv import load_dotenv
from supabase import create_client
import pandas as pd
import numpy as np

DEBUG = False

EXPECTED_TRIALS_PER_PARTICIPANT = 70

RATIOS = {
    "A: 51:50" : 51/50,
    "B: 41:40" : 41/40,
    "C: 31:30" : 31/30,
    "D: 21:20" : 21/20,
    "E: 5:4" : 5/4,
    "F: 4:3" : 4/3,
    "G: 3:2" : 3/2,
}

target_labels = list(RATIOS.keys())
target_values = np.array(list(RATIOS.values()))


### Step 1: Load environment variables ###

load_dotenv()

url = os.environ["SUPABASE_URL"]
key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

### Step 2: Connect to Supabase and Query Data ###

supabase = create_client(url, key)

response = supabase.table("trials_data_rrr").select("*").execute()

### Step 3: Clean and Process Data ###

# Convert to pandas DataFrame
df = pd.DataFrame(response.data)

print("Number of Raw Trials: ", len(df))

if DEBUG:
    print("\nColumns and Types: \n", df.dtypes)

# Remove Test / Unknown Participants

df.drop(df[df["prolific_id"] == "TEST OR UNKNOWN"].index, inplace=True)

print("Number of Trials After Removing Test Participants: ", len(df))

# Remove Practice Trials

df.drop(df[df["trial_number"] <= 0].index, inplace=True)

print("Number of Trials After Removing Practice Trials: ", len(df))

# Remove Participants with Incomplete or Too Much Data (Not EXPECTED_TRIALS_PER_PARTICIPANT trials)

count_trials_per_participant = df.groupby("prolific_id")["trial_number"].count()

if DEBUG:
    print("\nNumber of Trials per Participant: \n", count_trials_per_participant)

df_valid_participants = df[df["prolific_id"].isin(count_trials_per_participant[count_trials_per_participant == EXPECTED_TRIALS_PER_PARTICIPANT].index)].copy()

print("Number of Valid Participants: ", len(df_valid_participants) / EXPECTED_TRIALS_PER_PARTICIPANT)

# Add Column Indicating if Trial was Correct

df_valid_participants["correct_response"] = df_valid_participants.apply(lambda x: "q" if x["rect_a_height_percent"] > x["rect_b_height_percent"] else "p", axis=1)

df_valid_participants["is_correct"] = df_valid_participants["response"] == df_valid_participants["correct_response"]

if DEBUG:
    print("\nPercent Correct: \n", df_valid_participants["is_correct"].mean())

# Add Column Indicating Trial Ratio

df_valid_participants["raw_ratio"] = (
    np.maximum(df_valid_participants["rect_a_height_percent"], df_valid_participants["rect_b_height_percent"]) / 
    np.minimum(df_valid_participants["rect_a_height_percent"], df_valid_participants["rect_b_height_percent"])
)


# Distance from each row's ratio to every target
diffs = np.abs(df_valid_participants["raw_ratio"].values[:, None] - target_values[None, :])

# Closest target per row
best_idx = diffs.argmin(axis=1)
best_diff = diffs[np.arange(len(df_valid_participants)), best_idx]

# Label, flagging anything too far as "other"
df_valid_participants["ratio_group"] = np.where(
    best_diff < 0.001,
    np.array(target_labels)[best_idx],
    "other",
)

if DEBUG:
    print("Head of Final DataFrame: \n", df_valid_participants.head())
    print("Columns in Final DataFrame: \n", df_valid_participants.dtypes)

### Step 4: Analyze Data ###

print("Correct By Ratio Group: \n", df_valid_participants.groupby("ratio_group")["is_correct"].mean())




