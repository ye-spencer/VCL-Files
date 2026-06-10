import os
from dotenv import load_dotenv
from supabase import create_client
import pandas as pd
import numpy as np
from scipy.stats import norm
from scipy.optimize import minimize

DEBUG = True

NUM_TRIALS_PER_RATIO_GROUP = 10

RATIOS = [0.1, 0.5, 1, 2, 5, 10, 15]

EXPECTED_TRIALS_PER_PARTICIPANT = len(RATIOS) * NUM_TRIALS_PER_RATIO_GROUP

FILTER_CORRECT_PERCENTAGE = 0.65


### Step 1: Load environment variables ###

load_dotenv()

url = os.environ["SUPABASE_URL"]
key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

### Step 2: Connect to Supabase and Query Data ###

supabase = create_client(url, key)

response = supabase.table("trials_data_tld").select("*").execute()

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

# Add Column Indicating if Trial was Correct

df_valid_participants["correct_response"] = df_valid_participants.apply(lambda x: "q" if x["tilt_direction"] == "left" else "p", axis=1)

df_valid_participants["is_correct"] = df_valid_participants["response"] == df_valid_participants["correct_response"]

NUM_VALID_PARTICIPANTS = len(df_valid_participants) / EXPECTED_TRIALS_PER_PARTICIPANT

print("Number of Valid Participants: ", NUM_VALID_PARTICIPANTS)

if DEBUG:
    print("\nPercent Correct: \n", df_valid_participants["is_correct"].mean())

# Remove participants with under a certain percentage of correctness

mean_correct = df_valid_participants.groupby("prolific_id")["is_correct"].mean()
keep_ids = mean_correct[mean_correct >= FILTER_CORRECT_PERCENTAGE].index

if DEBUG:
    print("\n Mean Correctness:")
    print(mean_correct)
    dropped = mean_correct[mean_correct < FILTER_CORRECT_PERCENTAGE]
    print(f"\n Dropping {len(dropped)} participants:\n{dropped}")

df_valid_participants = df_valid_participants[df_valid_participants["prolific_id"].isin(keep_ids)]

# Create column for degree_magnitude

df_valid_participants["degree_magnitude"] = np.abs(df_valid_participants["degrees_tilted"])


if DEBUG:
    print("Head of Final DataFrame: \n", df_valid_participants.head())
    print("Columns in Final DataFrame: \n", df_valid_participants.dtypes)

### Step 4: Analyze Data | Average Correct By Ratio Group ###

print("Average Correct By Ratio Group: \n", df_valid_participants.groupby("degree_magnitude")["is_correct"].mean())
print("\n\n")

# ### Step 4b: Fit Weber Model (with guess rate) Per Participant ###

# # probability of correct given Weber fraction w, guess rate g, ratio r
# def prob_wg(w, g, r):
#     return (1 - g) * norm.cdf((r - 1) / (w * np.sqrt(1 + r**2))) + g / 2

# # negative log-likelihood for trial-level (0/1) outcomes
# def nll_wg(params, r, y):
#     p = prob_wg(params[0], params[1], r)
#     p = np.clip(p, 1e-12, 1 - 1e-12)
#     return -np.sum(np.log(p * y + (1 - p) * (1 - y)))

# WG_BOUNDS = [(1e-4, 3.0), (0.0, 1.0)]
# WG_START = [1 / 3, 1 / 3]

# fits = []
# for pid, sub in df_valid_participants.groupby("prolific_id"):
#     r = sub["raw_ratio"].to_numpy(dtype=float)
#     y = sub["is_correct"].to_numpy(dtype=float)
#     res = minimize(nll_wg, WG_START, args=(r, y), method="L-BFGS-B", bounds=WG_BOUNDS)
#     fits.append({"prolific_id": pid, "w_fit": res.x[0], "g_fit": res.x[1], "converged": res.success})

# model_fits = pd.DataFrame(fits)
# print("\nPer-participant Weber fits:")
# print(model_fits.describe()[["w_fit", "g_fit"]])

# # Group-level fit on pooled trials (for overlay curve)
# r_all = df_valid_participants["raw_ratio"].to_numpy(dtype=float)
# y_all = df_valid_participants["is_correct"].to_numpy(dtype=float)
# group_res = minimize(nll_wg, WG_START, args=(r_all, y_all), method="L-BFGS-B", bounds=WG_BOUNDS)
# w_group, g_group = group_res.x
# print(f"\nGroup-level fit (pooled): w = {w_group:.4f}, g = {g_group:.4f}")

# ### Step 5: Analyze Data | Main Graph with Weber Fit ###

# df_valid_participants_correct_by_ratio = df_valid_participants.groupby(["ratio_group", "prolific_id"])["is_correct"].sum().reset_index()

# df_valid_participants_correct_by_ratio["is_correct_ratio"] = df_valid_participants_correct_by_ratio["is_correct"] / NUM_TRIALS_PER_RATIO_GROUP

# if DEBUG:
#     print(df_valid_participants_correct_by_ratio)

# final_df = df_valid_participants_correct_by_ratio.groupby("ratio_group")["is_correct_ratio"].agg(["mean", "std"]).reset_index()

# final_df["std_err"] = final_df["std"] / np.sqrt(NUM_VALID_PARTICIPANTS)

# final_df["ratio_value"] = final_df["ratio_group"].apply(lambda x: RATIOS[x])

# if DEBUG:
#     print(final_df)

# # Create a graph of the data. y-axis is from 0.5 to 1.0 representing the proportion of correct responses. x-axis is 1 to 1.6 representing the ratio group. There should be a std_err for each point.

# import matplotlib.pyplot as plt

# final_df_sorted = final_df.sort_values("ratio_value")

# fig, ax = plt.subplots(figsize=(8, 5))

# ax.errorbar(
#     final_df_sorted["ratio_value"],
#     final_df_sorted["mean"],
#     yerr=final_df_sorted["std_err"],
#     fmt="o",
#     capsize=4,
#     capthick=1,
#     markersize=7,
#     linewidth=1,
#     color="#2b6cb0",
#     ecolor="#4a5568",
#     alpha=0.5,
#     label="Proportion Correct",
# )

# # Overlay Weber model fit (pooled across participants)
# r_grid = np.linspace(1.0, 1.55, 200)
# ax.plot(
#     r_grid,
#     prob_wg(w_group, g_group, r_grid),
#     color="#c53030",
#     linewidth=2,
#     label=f"Weber fit (w={w_group:.3f}, g={g_group:.3f})",
# )

# ax.set_xlim(1.0, 1.55)
# ax.set_ylim(0.5, 1.0)
# ax.set_xlabel("Rectangle Height Ratio (Larger / Smaller)", fontsize=12)
# ax.set_ylabel("Proportion Correct", fontsize=12)
# ax.set_title("Accuracy by Rectangle Ratio", fontsize=14)
# ax.legend(loc="lower right")
# ax.grid(True, alpha=0.3)

# plt.tight_layout()
# plt.savefig("accuracy_by_ratio.png", dpi=300)
# plt.show()

# print("Graph saved to accuracy_by_ratio.png")





