import cv2
import numpy as np
import pandas as pd

# For every frame of the fire video, find the top edge of the flames: in each x column,
# the highest pixel that belongs to a flame. Then average that y position across all frames.

VIDEO_PATH = "data/fire0.mp4"

# Frames are downscaled before processing (3840 -> 960 is a factor of 4). Results are saved in
# full-resolution video pixel coordinates.
PROCESS_WIDTH = 960

# Tolerance knobs:
#   Flames are yellow/white, so they are bright in the green channel. The brick wall and the
#   red glow on it are almost pure red (green < ~40), so a green threshold separates them.
#   Lower thresholds pick up dimmer orange flame tongues (and embers, which sit below the edge anyway).
#   Blobs smaller than MIN_BLOB_AREA (in processing pixels) are dropped, which removes sparks.
GREEN_THRESHOLD = 110
THRESHOLD_SWEEP = [80, 110, 140, 170]  # also traced so the tolerance choice can be compared
MIN_BLOB_AREA = 150

# Where a log blocks the flame, a column's highest flame pixel can be the glowing rim inside the log,
# far below the flames on either side. Per frame, downward drops narrower than GAP_BRIDGE_PX
# (full-resolution px) are bridged at the height of the lower side. 0 turns this off.
GAP_BRIDGE_PX = 200


def downscale(frame):
    height, width = frame.shape[:2]
    size = (PROCESS_WIDTH, round(height * PROCESS_WIDTH / width))
    return cv2.resize(frame, size, interpolation=cv2.INTER_AREA)


def blurred_green(frame_small):
    return cv2.GaussianBlur(frame_small[:, :, 1], (5, 5), 0)


def flame_mask(green, green_threshold):
    mask = (green > green_threshold).astype(np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))

    n_labels, labels, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
    keep = np.zeros(n_labels, dtype=bool)
    keep[1:] = stats[1:, cv2.CC_STAT_AREA] >= MIN_BLOB_AREA
    return keep[labels]


def top_edge(mask):
    """Row index of the highest flame pixel in each column (NaN where the column has no flame)."""
    has_flame = mask.any(axis=0)
    first_row = mask.argmax(axis=0).astype(float)
    first_row[~has_flame] = np.nan
    return first_row


def clean_edges(edges_px, height, scale, gap_bridge_px=GAP_BRIDGE_PX):
    """Frames x columns of edge y (full-res px, NaN = no flame) -> the edges that get averaged.

    A column with no flame counts as an edge at the bottom of the frame (averaging only the frames
    that have flame would pull the sides of the fire up). Then narrow drops are bridged.
    """
    edges = np.where(np.isnan(edges_px), height, edges_px).astype(np.float32)
    kernel_width = round(gap_bridge_px / scale) | 1
    if kernel_width <= 1:
        return edges
    # A grey opening of y fills drops narrower than the kernel. Outside the frame counts as no flame.
    padded = cv2.copyMakeBorder(edges, 0, 0, kernel_width, kernel_width, cv2.BORDER_CONSTANT, value=height)
    opened = cv2.morphologyEx(padded, cv2.MORPH_OPEN, np.ones((1, kernel_width), np.uint8))
    return opened[:, kernel_width:-kernel_width]


if __name__ == "__main__":
    cap = cv2.VideoCapture(VIDEO_PATH)
    if not cap.isOpened():
        raise FileNotFoundError(f"Could not open video file {VIDEO_PATH}")

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    scale = width / PROCESS_WIDTH
    print(f"Video info: {frame_count} frames, {width}x{height}, {fps} FPS")

    # The chosen threshold is always traced, even if it is not in the sweep
    thresholds = sorted({*THRESHOLD_SWEEP, GREEN_THRESHOLD})
    edges = {t: [] for t in thresholds}
    frame_sum = 0.0

    frame_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        small = downscale(frame)
        frame_sum += small
        green = blurred_green(small)
        for t in thresholds:
            edges[t].append(top_edge(flame_mask(green, t)))

        frame_idx += 1
        if frame_idx % 100 == 0:
            print(f"{frame_idx:04d}/{frame_count}")
    cap.release()

    # Convert to full-resolution pixel coordinates (centre of each processed column / row)
    x_px = (np.arange(PROCESS_WIDTH) + 0.5) * scale
    edges_px = {t: (np.array(e) + 0.5) * scale for t, e in edges.items()}

    np.savez_compressed(
        "data/edge_y_by_frame.npz",
        x_px=x_px,
        video_size=np.array([width, height]),
        fps=fps,
        thresholds=np.array(thresholds),
        **{f"edge_y_px_g{t}": e for t, e in edges_px.items()},
    )

    edge = clean_edges(edges_px[GREEN_THRESHOLD], height, scale)
    pd.DataFrame({
        "x_px": x_px,
        "mean_y_px": edge.mean(axis=0),
        "median_y_px": np.median(edge, axis=0),
        "std_y_px": edge.std(axis=0),
        "frames_with_flame": (~np.isnan(edges_px[GREEN_THRESHOLD])).sum(axis=0),
    }).to_csv("data/fire_edge_trace.csv", index=False, float_format="%.2f")

    mean_frame = (frame_sum / frame_idx).round().astype(np.uint8)
    cv2.imwrite("data/mean_frame.png", mean_frame)

    print(f"Traced {frame_idx} frames")
