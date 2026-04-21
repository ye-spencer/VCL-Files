import os
from dotenv import load_dotenv
from supabase import create_client
import pandas as pd
import numpy as np

DEBUG = True

NUM_TRIALS_PER_RATIO_GROUP = 10

RATIOS = {
    "A: 51:50" : 51/50,
    "B: 41:40" : 41/40,
    "C: 31:30" : 31/30,
    "D: 21:20" : 21/20,
    "E: 5:4" : 5/4,
    "F: 4:3" : 4/3,
    "G: 3:2" : 3/2,
}

EXPECTED_TRIALS_PER_PARTICIPANT = len(RATIOS) * NUM_TRIALS_PER_RATIO_GROUP

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


NUM_VALID_PARTICIPANTS = len(df_valid_participants) / EXPECTED_TRIALS_PER_PARTICIPANT

print("Number of Valid Participants: ", NUM_VALID_PARTICIPANTS)

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

### Step 4: Analyze Data | Average Correct By Ratio Group ###

print("Average Correct By Ratio Group: \n", df_valid_participants.groupby("ratio_group")["is_correct"].mean())
print("\n\n")

### Step 5: Analyze Data | Main Graph no Fit ###

df_valid_participants_correct_by_ratio = df_valid_participants.groupby(["ratio_group", "prolific_id"])["is_correct"].sum().reset_index()

df_valid_participants_correct_by_ratio["is_correct_ratio"] = df_valid_participants_correct_by_ratio["is_correct"] / NUM_TRIALS_PER_RATIO_GROUP

if DEBUG:
    print(df_valid_participants_correct_by_ratio)

final_df = df_valid_participants_correct_by_ratio.groupby("ratio_group")["is_correct_ratio"].agg(["mean", "std"]).reset_index()

final_df["std_err"] = final_df["std"] / np.sqrt(NUM_VALID_PARTICIPANTS)

final_df["ratio_value"] = final_df["ratio_group"].apply(lambda x: RATIOS[x])

if DEBUG:
    print(final_df)

# Create a graph of the data. y-axis is from 0.5 to 1.0 representing the proportion of correct responses. x-axis is 1 to 1.6 representing the ratio group. There should be a std_err for each point.

import matplotlib.pyplot as plt

final_df_sorted = final_df.sort_values("ratio_value")

fig, ax = plt.subplots(figsize=(8, 5))

ax.errorbar(
    final_df_sorted["ratio_value"],
    final_df_sorted["mean"],
    yerr=final_df_sorted["std_err"],
    fmt="o",
    capsize=4,
    capthick=1,
    markersize=7,
    linewidth=1,
    color="#2b6cb0",
    ecolor="#4a5568",
    alpha=0.5,
    label="Proportion Correct",
)

ax.set_xlim(1.0, 1.55)
ax.set_ylim(0.5, 1.0)
ax.set_xlabel("Rectangle Height Ratio (Larger / Smaller)", fontsize=12)
ax.set_ylabel("Proportion Correct", fontsize=12)
ax.set_title("Accuracy by Rectangle Ratio", fontsize=14)
ax.legend(loc="lower right")
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("accuracy_by_ratio.png", dpi=150)
plt.show()

print("Graph saved to accuracy_by_ratio.png")





