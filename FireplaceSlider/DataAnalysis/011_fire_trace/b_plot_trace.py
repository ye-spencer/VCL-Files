import cv2
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patheffects as pe

from a_trace_edge import (
    VIDEO_PATH, PROCESS_WIDTH, GREEN_THRESHOLD, MIN_BLOB_AREA, GAP_BRIDGE_PX,
    downscale, blurred_green, flame_mask, clean_edges,
)

SAMPLE_FRAMES = [0, 100, 250, 400, 550, 700]
GAP_BRIDGE_SWEEP = [0, 100, 200, 300, 400]

LINE_COLOR = "white"
BAND_COLOR = "#86b6ef"
LINE_OUTLINE = [pe.withStroke(linewidth=4, foreground="black", alpha=0.6)]

data = dict(np.load("data/edge_y_by_frame.npz"))
trace = pd.read_csv("data/fire_edge_trace.csv")
width, height = data["video_size"].tolist()
scale = width / PROCESS_WIDTH
x = data["x_px"]
n_frames = len(data[f"edge_y_px_g{GREEN_THRESHOLD}"])


def edges_for(threshold=GREEN_THRESHOLD, gap_bridge_px=GAP_BRIDGE_PX):
    """Cleaned per-frame edges (frames x columns)."""
    return clean_edges(data[f"edge_y_px_g{threshold}"], height, scale, gap_bridge_px)


def plot_mean_trace():
    mean, std = trace["mean_y_px"], trace["std_y_px"]
    background = cv2.cvtColor(cv2.imread("data/mean_frame.png"), cv2.COLOR_BGR2RGB)

    fig, ax = plt.subplots(figsize=(12, 7))
    ax.imshow(background, extent=(0, width, height, 0))
    ax.fill_between(x, np.clip(mean - std, 0, height), np.clip(mean + std, 0, height),
                    color=BAND_COLOR, alpha=0.25, linewidth=0, label="±1 SD across frames")
    ax.plot(x, mean, color=LINE_COLOR, linewidth=2, path_effects=LINE_OUTLINE, label="Mean edge y")
    ax.set_xlim(0, width)
    ax.set_ylim(height, 0)
    ax.set_xlabel("x (video px)")
    ax.set_ylabel("y (video px)")
    ax.set_title(f"Mean top edge of the flames across {n_frames} frames "
                 f"(green > {GREEN_THRESHOLD}, gaps < {GAP_BRIDGE_PX} px bridged, "
                 f"background = average frame)", fontsize="medium")
    ax.legend(loc="upper right", framealpha=0.9, fontsize="small")
    plt.tight_layout()
    plt.savefig("outputs/fire_edge_trace.png", dpi=150)
    plt.close(fig)


def plot_detection_check():
    """Sample frames with the detected flame (tinted) and that frame's edge, for dialing in the tolerance."""
    edges = edges_for()

    cap = cv2.VideoCapture(VIDEO_PATH)
    fig, axes = plt.subplots(3, 2, figsize=(14, 12))
    for ax, idx in zip(axes.flat, SAMPLE_FRAMES):
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if not ret:
            raise ValueError(f"Could not read frame {idx}")
        small = downscale(frame)
        mask = flame_mask(blurred_green(small), GREEN_THRESHOLD)
        rgb = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)
        rgb[mask] = (0.5 * rgb[mask] + 0.5 * np.array([0, 255, 255])).astype(np.uint8)

        ax.imshow(rgb, extent=(0, width, height, 0))
        ax.plot(x, trace["mean_y_px"], color=LINE_COLOR, linewidth=1, linestyle="--", alpha=0.8,
                label="Mean edge (all frames)")
        ax.plot(x, edges[idx], color=LINE_COLOR, linewidth=2, path_effects=LINE_OUTLINE, label="This frame's edge")
        ax.set_title(f"Frame {idx} ({idx / data['fps']:.2f}s)", fontsize="medium")
        ax.axis("off")
    cap.release()

    axes.flat[0].legend(loc="upper left", framealpha=0.9, fontsize="small")
    fig.suptitle(f"Detected flame (cyan tint) and top edge per frame: green > {GREEN_THRESHOLD}, "
                 f"min blob {MIN_BLOB_AREA} px, gaps < {GAP_BRIDGE_PX} px bridged")
    plt.tight_layout()
    plt.savefig("outputs/edge_detection_check.png", dpi=120)
    plt.close(fig)


def plot_sweep_panel(ax, means, labels, chosen_index, title):
    colors = plt.cm.Blues(np.linspace(0.4, 0.95, len(means)))  # light -> dark = low -> high setting
    for i, (mean, label, color) in enumerate(zip(means, labels, colors)):
        chosen = i == chosen_index
        ax.plot(x, mean, color=color, linewidth=2.5 if chosen else 1.5,
                label=label + (" (used)" if chosen else ""))
    ax.set_xlim(0, width)
    ax.set_ylim(height, 0)
    ax.set_aspect("equal")
    ax.grid(color="#e5e4e0", linewidth=0.5)
    ax.set_axisbelow(True)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    ax.set_xlabel("x (video px)")
    ax.set_ylabel("y (video px)")
    ax.set_title(title, fontsize="medium")
    ax.legend(loc="upper right", fontsize="small")


def plot_sweeps():
    """How much the mean edge moves when each tolerance knob changes (the other held fixed)."""
    fig, (ax_t, ax_b) = plt.subplots(2, 1, figsize=(11, 13))

    thresholds = list(data["thresholds"])
    plot_sweep_panel(
        ax_t,
        [edges_for(threshold=t).mean(axis=0) for t in thresholds],
        [f"green > {t}" for t in thresholds],
        thresholds.index(GREEN_THRESHOLD),
        f"Detection threshold (gaps < {GAP_BRIDGE_PX} px bridged)",
    )

    bridges = sorted({*GAP_BRIDGE_SWEEP, GAP_BRIDGE_PX})
    plot_sweep_panel(
        ax_b,
        [edges_for(gap_bridge_px=b).mean(axis=0) for b in bridges],
        [f"bridge {b} px" for b in bridges],
        bridges.index(GAP_BRIDGE_PX),
        f"Gap bridging width (green > {GREEN_THRESHOLD})",
    )

    fig.suptitle("Mean flame edge under different tolerance settings")
    plt.tight_layout()
    plt.savefig("outputs/edge_tolerance_sweep.png", dpi=150)
    plt.close(fig)


if __name__ == "__main__":
    plot_mean_trace()
    plot_detection_check()
    plot_sweeps()
