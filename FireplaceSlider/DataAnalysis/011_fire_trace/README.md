# Fireplace Slider Data Analysis - Fire Trace

## What it does

Traces the top edge of the flames (where the fire meets the brick wall) in every frame of the fire video, then averages the y position of that edge at each x position. The result is a pyramid-like line showing where the fire's outline sits on average, with a ±1 SD band showing how much the flames jump around. This is meant to be compared against people's ratings to show how well they agree with the shape of the fire.

`a_trace_edge.py` finds the edge in each frame and saves the per-frame edges, the mean trace (`data/fire_edge_trace.csv`), and an average frame. `b_plot_trace.py` makes the figures in `outputs`. `c_overlay_heatmap.py` draws the mean edge on pretty and dangerous chunk heatmaps of the ratings in `data/averaged_data.csv`. Pretty is the jeweler pretty question ("Less Pretty Stone" to "More Pretty Stone") and dangerous is "Less Good for Danger Signal" to "More Good for Danger Signal". Each chunk's score is its mean `averaged_value`.

The rule for every heatmap: one cell is one chunk offset, 384 x 240 px of video, where 384 is the chunk offset established in the missing gaps analysis. Chunk n's column covers x = 384n to 384n + 384, so the 10 x 9 grid spans the full 3840 x 2160 frame. On the pretty and dangerous heatmaps the cells are square, so the line is compressed into chunk coordinates.

`c_overlay_heatmap.py` also makes a third heatmap, `pretty_plus_dangerous_by_chunk_with_edge.png`. Each word's chunk scores are min-max scaled to a percentage, (score - min) / (max - min) * 100, and the two percentages are added (0 to 200). Each cell is drawn at its 384 x 240 px size, so the heatmap is the same size as the video and the line is drawn in video pixels without being compressed.

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
