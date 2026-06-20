import os
from dotenv import load_dotenv
from supabase import create_client
import pandas as pd
import numpy as np
from scipy.stats import norm
from scipy.optimize import minimize

DEBUG = True

NUM_TRIALS_PER_DEGREE_MAGNITUDE = 10

# Distinct tilt magnitudes (degrees) presented per participant, matching
# DEGREES_POSSIBLE_TRIALS in the experiment's constants.ts (EXPERIMENT_VERSION 2).
DEGREES = [0.3, 0.5, 0.8, 1, 2, 5, 10]

EXPECTED_TRIALS_PER_PARTICIPANT = len(DEGREES) * NUM_TRIALS_PER_DEGREE_MAGNITUDE

FILTER_CORRECT_PERCENTAGE = 0.65

EXPERIMENT_VERSION = 2

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

# Select Experiment Version

df.drop(df[df["experiment_version"] != EXPERIMENT_VERSION].index, inplace=True)

print(f"Number of Trials After Selecting Experiment Version {EXPERIMENT_VERSION}: ", len(df))

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

### Step 4b: Fit Weber Model (with guess rate) Per Participant ###

# probability of correct given Weber threshold w (in degrees), guess rate g, tilt magnitude d
def prob_wg(w, g, d):
    return (1 - g) * norm.cdf(d / w) + g / 2

# negative log-likelihood for trial-level (0/1) outcomes
def nll_wg(params, d, y):
    p = prob_wg(params[0], params[1], d)
    p = np.clip(p, 1e-12, 1 - 1e-12)
    return -np.sum(np.log(p * y + (1 - p) * (1 - y)))

WG_BOUNDS = [(1e-4, 30.0), (0.0, 1.0)]
WG_START = [5.0, 1 / 3]

fits = []
for pid, sub in df_valid_participants.groupby("prolific_id"):
    d = sub["degree_magnitude"].to_numpy(dtype=float)
    y = sub["is_correct"].to_numpy(dtype=float)
    res = minimize(nll_wg, WG_START, args=(d, y), method="L-BFGS-B", bounds=WG_BOUNDS)
    fits.append({"prolific_id": pid, "w_fit": res.x[0], "g_fit": res.x[1], "converged": res.success})

model_fits = pd.DataFrame(fits)
print("\nPer-participant Weber fits:")
print(model_fits.describe()[["w_fit", "g_fit"]])

# Group-level fit on pooled trials (for overlay curve)
d_all = df_valid_participants["degree_magnitude"].to_numpy(dtype=float)
y_all = df_valid_participants["is_correct"].to_numpy(dtype=float)
group_res = minimize(nll_wg, WG_START, args=(d_all, y_all), method="L-BFGS-B", bounds=WG_BOUNDS)
w_group, g_group = group_res.x
print(f"\nGroup-level fit (pooled): w = {w_group:.4f}, g = {g_group:.4f}")

### Step 5: Analyze Data | Main Graph with Weber Fit ###

df_valid_participants_correct_by_ratio = df_valid_participants.groupby(["degree_magnitude", "prolific_id"])["is_correct"].sum().reset_index()

df_valid_participants_correct_by_ratio["is_correct_ratio"] = df_valid_participants_correct_by_ratio["is_correct"] / NUM_TRIALS_PER_DEGREE_MAGNITUDE

if DEBUG:
    print(df_valid_participants_correct_by_ratio)

final_df = df_valid_participants_correct_by_ratio.groupby("degree_magnitude")["is_correct_ratio"].agg(["mean", "std"]).reset_index()

final_df["std_err"] = final_df["std"] / np.sqrt(NUM_VALID_PARTICIPANTS)

if DEBUG:
    print(final_df)

# Create a graph of the data. y-axis is from 0.5 to 1.0 representing the proportion of correct responses. x-axis is 1 to 1.6 representing the ratio group. There should be a std_err for each point.

import matplotlib.pyplot as plt

final_df_sorted = final_df.sort_values("degree_magnitude")

fig, ax = plt.subplots(figsize=(8, 5))

ax.errorbar(
    final_df_sorted["degree_magnitude"],
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

# Overlay Weber model fit (pooled across participants)
d_grid = np.linspace(0, 15, 200)
ax.plot(
    d_grid,
    prob_wg(w_group, g_group, d_grid),
    color="#c53030",
    linewidth=2,
    label=f"Weber fit (w={w_group:.3f}, g={g_group:.3f})",
)

ax.set_xlim(0, 11)
ax.set_ylim(0.5, 1.0)
ax.set_xlabel("Degree Tilt", fontsize=12)
ax.set_ylabel("Proportion Correct", fontsize=12)
ax.set_title("Accuracy by Degree Tilt", fontsize=14)
ax.legend(loc="lower right")
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("accuracy_by_ratio.png", dpi=300)
plt.show()

print("Graph saved to accuracy_by_ratio.png")


### Step 6: Fit Weber Model in Log-Degree Space (with guess rate) ###

# Same psychometric idea as prob_wg, but the rise is modeled in log-degrees so that
# location (threshold) and steepness (slope) are independent parameters -- the natural
# "Weber" axis for log-spaced stimuli. Chance is held at 0.5 (2AFC); ceiling is 1 - g/2.
#   mu    = log-degree threshold (where the curve crosses halfway to ceiling)
#   sigma = log-degree slope (larger -> more gradual)
#   g     = lapse rate
def prob_wg_log(mu, sigma, g, d):
    return 0.5 + (0.5 - g / 2) * norm.cdf((np.log(d) - mu) / sigma)

def nll_wg_log(params, d, y):
    p = prob_wg_log(params[0], params[1], params[2], d)
    p = np.clip(p, 1e-12, 1 - 1e-12)
    return -np.sum(np.log(p * y + (1 - p) * (1 - y)))

WG_LOG_BOUNDS = [(-3.0, 3.0), (1e-2, 10.0), (0.0, 1.0)]
WG_LOG_START = [np.log(2.0), 1.0, 0.05]

fits_log = []
for pid, sub in df_valid_participants.groupby("prolific_id"):
    d = sub["degree_magnitude"].to_numpy(dtype=float)
    y = sub["is_correct"].to_numpy(dtype=float)
    res = minimize(nll_wg_log, WG_LOG_START, args=(d, y), method="L-BFGS-B", bounds=WG_LOG_BOUNDS)
    fits_log.append({"prolific_id": pid, "mu_fit": res.x[0], "sigma_fit": res.x[1], "g_fit": res.x[2], "converged": res.success})

model_fits_log = pd.DataFrame(fits_log)
print("\nPer-participant Weber fits (log-degree):")
print(model_fits_log.describe()[["mu_fit", "sigma_fit", "g_fit"]])

# Group-level fit on pooled trials (for overlay curve)
group_res_log = minimize(nll_wg_log, WG_LOG_START, args=(d_all, y_all), method="L-BFGS-B", bounds=WG_LOG_BOUNDS)
mu_group, sigma_group, g_group_log = group_res_log.x
print(f"\nGroup-level fit (log-degree, pooled): mu = {mu_group:.4f} (threshold = {np.exp(mu_group):.3f} deg), sigma = {sigma_group:.4f}, g = {g_group_log:.4f}")

### Step 7: Analyze Data | Second Graph on Log X-Axis with Log-Degree Weber Fit ###

fig2, ax2 = plt.subplots(figsize=(8, 5))

ax2.errorbar(
    final_df_sorted["degree_magnitude"],
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

# Overlay log-degree Weber fit (pooled across participants), evaluated on a log-spaced grid
d_grid_log = np.geomspace(0.2, 12, 200)
ax2.plot(
    d_grid_log,
    prob_wg_log(mu_group, sigma_group, g_group_log, d_grid_log),
    color="#c53030",
    linewidth=2,
    label=f"Weber fit (log): thr={np.exp(mu_group):.2f}°, σ={sigma_group:.2f}, g={g_group_log:.3f}",
)

ax2.set_xscale("log")
ax2.set_xlim(0.2, 12)
ax2.set_ylim(0.5, 1.0)
ax2.set_xlabel("Degree Tilt (log scale)", fontsize=12)
ax2.set_ylabel("Proportion Correct", fontsize=12)
ax2.set_title("Accuracy by Degree Tilt (Log Axis)", fontsize=14)
ax2.legend(loc="lower right")
ax2.grid(True, which="both", alpha=0.3)

plt.tight_layout()
plt.savefig("accuracy_by_degree_log.png", dpi=300)
plt.show()

print("Graph saved to accuracy_by_degree_log.png")





