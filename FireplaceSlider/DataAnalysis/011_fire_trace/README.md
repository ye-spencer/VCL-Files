# Fireplace Slider Data Analysis - Fire Trace

## What it does

Traces the top edge of the flames (where the fire meets the brick wall) in every frame of the fire video, then averages the y position of that edge at each x position. The result is a pyramid-like line showing where the fire's outline sits on average, with a ±1 SD band showing how much the flames jump around. This is meant to be compared against people's ratings to show how well they agree with the shape of the fire.

`a_trace_edge.py` finds the edge in each frame and saves the per-frame edges, the mean trace (`data/fire_edge_trace.csv`), and an average frame. `b_plot_trace.py` makes the figures in `outputs`. `c_overlay_heatmap.py` draws the mean edge on the pretty and dangerous chunk heatmaps from `001_danger_vs_pretty` (its `averaged_data.csv` is copied into `data`).

On the heatmaps the line is compressed into chunk coordinates. Each chunk's samples came from a 348 x 240 px region of the video (348, not 384, because of the known error in `FinalExperiment/GeneratingSuperpixels`), so the 10 columns only cover x = 0 to 3480 and the line is cut off there.

Everywhere else, coordinates are in video pixels (3840 x 2160, y = 0 at the top).

## How the edge is found

Rather than a generic edge detector (which also finds the brick seams, logs and embers), each frame is split into flame / not flame, and the edge is the highest flame pixel in each column.

1. Flames are yellow/white, so they are bright in the green channel, while the brick wall and its red glow have almost no green. A pixel is flame if its (blurred) green value is above `GREEN_THRESHOLD`.
2. Blobs smaller than `MIN_BLOB_AREA` are dropped, which removes sparks.
3. A column with no flame in a frame counts as an edge at the bottom of the frame.
4. Where a log blocks the flame, the highest flame pixel in a column can be the glowing rim inside the log, far below the flames next to it. Drops narrower than `GAP_BRIDGE_PX` are bridged at the height of the lower side.

These knobs are at the top of `a_trace_edge.py`. `outputs/edge_detection_check.png` shows the detected flame and edge on sample frames, and `outputs/edge_tolerance_sweep.png` shows how the mean edge moves as each knob changes.

## Requirements

`opencv-python`, `numpy`, `matplotlib`, `pandas`
