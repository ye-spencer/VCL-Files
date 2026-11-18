"""
Plots the distribution of agreement scores for each survey question.

Pulls every response from the Supabase table `survey_responses_sds` (credentials
from analysis/.env) and writes two figures to analysis/figures/:

    score_histogram.png  responses grouped into bins along the bar
    score_dotplot.png    one circle per participant, at the exact position they clicked,
                         drawn on the response bar with a line at the mean

Scores are the canonical agreement score logged by the survey
(0 = Strongly Disagree end of the bar, 100 = Strongly Agree end), so participants
who saw the flipped bar are already on the same axis as everyone else.

Usage: python analysis.py
"""

import math
import os
import random
from collections import defaultdict

import matplotlib.pyplot as plt
import requests
from dotenv import load_dotenv
from matplotlib.collections import PatchCollection
from matplotlib.patches import Circle, FancyBboxPatch

HERE = os.path.dirname(os.path.abspath(__file__))
FIGURE_DIR = os.path.join(HERE, "figures")

TABLE = "survey_responses_sds"
TEST_ID = "TEST OR UNKNOWN"  # prolific_id logged when PROLIFIC_PID is missing

# Questions in the order they are plotted, with a readable panel title.
QUESTION_TITLES = {
    "threshold_jnd": "Threshold / just noticeable difference",
    "human_dog_smell": "Humans and dogs smell the same molecules",
}

# Labels as they appear under the bar on the survey: four equal-width cells,
# outer labels flush to the bar ends and the middle two centered in their cells.
SCALE_LABELS = ["Strongly Disagree", "Weakly Disagree", "Weakly Agree", "Strongly Agree"]
SCALE_LABEL_POSITIONS = [0, 37.5, 62.5, 100]
SCALE_LABEL_ALIGNMENT = ["left", "center", "center", "right"]

BIN_WIDTH = 5  # histogram bin width, in score points

# Dot plot geometry, in score points.
DOT_DIAMETER = 1.0
BAR_HEIGHT = 8
BAR_ROUNDING = 0.8
MEAN_OVERHANG = 1  # how far the mean line sticks out past the bar
JITTER_TRIES = 30  # random heights tried per dot before settling for the roomiest

COLOR = "#2a78d6"
MEAN_COLOR = "#2f5be6"
BAR_COLOR = "#e4e4e4"
SURFACE = "#fcfcfb"
TEXT_PRIMARY = "#0b0b0b"
TEXT_SECONDARY = "#52514e"
GRID = "#e1e0d9"
AXIS = "#c3c2b7"


def fetch_scores():
    """Return {question_id: [score, ...]} for all non-test participants."""
    load_dotenv(os.path.join(HERE, ".env"))
    url = os.environ["SUPABASE_URL"].rstrip("/")
    key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

    response = requests.get(
        f"{url}/rest/v1/{TABLE}",
        params={"select": "prolific_id,question_id,score", "prolific_id": f"neq.{TEST_ID}"},
        headers={"apikey": key, "Authorization": f"Bearer {key}"},
        timeout=30,
    )
    response.raise_for_status()
    rows = response.json()
    # Supabase silently caps a single request at 1000 rows.
    assert len(rows) < 1000, "Response may be truncated; paginate the request."

    scores = defaultdict(list)
    for row in rows:
        scores[row["question_id"]].append(row["score"])
    return scores


def style_axes(ax):
    ax.set_facecolor(SURFACE)
    for side in ("top", "right", "left"):
        ax.spines[side].set_visible(False)
    ax.spines["bottom"].set_color(AXIS)
    ax.tick_params(colors=TEXT_SECONDARY, length=0, labelsize=9)
    ax.set_xlim(-2, 102)
    # Disagree / agree boundary.
    ax.axvline(50, color=AXIS, linewidth=1, zorder=0)


def label_scale(ax):
    ax.set_xticks(SCALE_LABEL_POSITIONS, SCALE_LABELS, fontsize=10, color=TEXT_PRIMARY)
    for label, alignment in zip(ax.get_xticklabels(), SCALE_LABEL_ALIGNMENT):
        label.set_horizontalalignment(alignment)


def panel_title(ax, question_id, values):
    title = QUESTION_TITLES.get(question_id, question_id)
    mean = sum(values) / len(values)
    ax.set_title(title, loc="left", fontsize=11, color=TEXT_PRIMARY, fontweight="bold")
    # Offset like the title so the two share a baseline whatever the panel height.
    ax.annotate(f"n = {len(values)}   mean = {mean:.1f}", xy=(1, 1), xycoords="axes fraction",
                xytext=(0, plt.rcParams["axes.titlepad"]), textcoords="offset points",
                ha="right", va="baseline", fontsize=9, color=TEXT_SECONDARY)


def plot_histogram(scores, path):
    fig, axes = plt.subplots(len(scores), 1, figsize=(9, 2.6 * len(scores)),
                             sharex=True, sharey=True, layout="constrained")
    fig.set_facecolor(SURFACE)
    bins = list(range(0, 100 + BIN_WIDTH, BIN_WIDTH))

    for ax, (question_id, values) in zip(axes, scores.items()):
        style_axes(ax)
        ax.hist(values, bins=bins, color=COLOR, edgecolor=SURFACE, linewidth=1.5, zorder=2)
        ax.yaxis.grid(True, color=GRID, linewidth=0.8, zorder=0)
        ax.set_ylabel("Participants", fontsize=9, color=TEXT_SECONDARY)
        panel_title(ax, question_id, values)

    label_scale(axes[-1])
    fig.suptitle(f"Agreement scores, {BIN_WIDTH}-point bins", x=0.01, ha="left",
                 fontsize=13, color=TEXT_PRIMARY)
    fig.savefig(path, dpi=200)
    plt.close(fig)


def jitter_dots(values, low, high, spacing):
    """
    Place each value at its exact x and give it a random height between low and
    high, scattering the dots across the bar. Each dot keeps the first random
    height that clears every dot already placed, or the roomiest one tried in
    crowded regions. Returns a list of (x, y) pairs.
    """
    rng = random.Random(0)  # fixed seed so reruns draw the same figure
    placed = []
    for x in sorted(values):
        best_y, best_gap = None, -1
        for _ in range(JITTER_TRIES):
            y = rng.uniform(low, high)
            gap = min((math.dist((x, y), dot) for dot in placed), default=math.inf)
            if gap > best_gap:
                best_y, best_gap = y, gap
            if gap >= spacing:
                break
        placed.append((x, best_y))
    return placed


def plot_dots(scores, path):
    spacing = DOT_DIAMETER * 1.15  # small gap between neighboring dots
    inset = DOT_DIAMETER * 0.75  # keeps dots off the bar's top and bottom edges
    bottom, top = -MEAN_OVERHANG, BAR_HEIGHT + MEAN_OVERHANG

    # Equal aspect keeps dots round, so panel height follows the bar height.
    panel_height = 8.4 * (top - bottom) / 104 + 0.75
    fig, axes = plt.subplots(len(scores), 1, figsize=(9, panel_height * len(scores) + 0.5),
                             layout="constrained")
    fig.set_facecolor(SURFACE)

    for ax, (question_id, values) in zip(axes, scores.items()):
        ax.set_facecolor(SURFACE)
        for spine in ax.spines.values():
            spine.set_visible(False)
        ax.tick_params(length=0, pad=6)
        ax.set_xlim(-2, 102)
        ax.set_ylim(bottom, top)
        ax.set_aspect("equal")
        ax.set_yticks([])

        # The response bar as participants saw it, with the mean marked across it.
        ax.add_patch(FancyBboxPatch((0, 0), 100, BAR_HEIGHT,
                                    boxstyle=f"round,pad=0,rounding_size={BAR_ROUNDING}",
                                    facecolor=BAR_COLOR, edgecolor="none", zorder=1))
        mean = sum(values) / len(values)
        ax.plot([mean, mean], [bottom, top], color=MEAN_COLOR, linewidth=2.5,
                solid_capstyle="butt", zorder=2)

        placed = jitter_dots(values, inset, BAR_HEIGHT - inset, spacing)
        dots = [Circle(xy, DOT_DIAMETER / 2) for xy in placed]
        ax.add_collection(PatchCollection(dots, facecolor="none", edgecolor=TEXT_PRIMARY,
                                          linewidth=1, zorder=3))
        label_scale(ax)
        panel_title(ax, question_id, values)

    fig.suptitle("Agreement scores: one circle per participant, blue line at the mean",
                 x=0.01, ha="left", fontsize=13, color=TEXT_PRIMARY)
    fig.savefig(path, dpi=200)
    plt.close(fig)


def main():
    scores = fetch_scores()
    # Plot known questions in a fixed order, then anything unexpected after.
    ordered = [q for q in QUESTION_TITLES if q in scores] + sorted(set(scores) - set(QUESTION_TITLES))
    scores = {q: scores[q] for q in ordered}

    for question_id, values in scores.items():
        print(f"{question_id}: n = {len(values)}, mean = {sum(values) / len(values):.2f}")

    os.makedirs(FIGURE_DIR, exist_ok=True)
    plot_histogram(scores, os.path.join(FIGURE_DIR, "score_histogram.png"))
    plot_dots(scores, os.path.join(FIGURE_DIR, "score_dotplot.png"))
    print(f"Figures written to {FIGURE_DIR}")


if __name__ == "__main__":
    main()
