import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patheffects as pe

# Overlay the mean flame edge on chunk heatmaps of the ratings in data/averaged_data.csv.

# word_one of each slider pair in averaged_data.csv (word_two is the "More ..." end).
PRETTY_WORD = 'Less Pretty Stone'  # jeweler pretty
DANGEROUS_WORD = 'Less Good for Danger Signal'

# Rule: one heatmap cell = one chunk offset, 384 x 240 px of video (384 is the chunk offset established
# in the missing gaps analysis). Chunk n's column spans video x in [384n, 384n + 384), so the 10 columns
# x 9 rows cover the full 3840 x 2160 frame.
CHUNK_WIDTH_PX = 384
CHUNK_HEIGHT_PX = 240
X_NUM_CHUNKS = 10
Y_NUM_CHUNKS = 9

CMAP = "YlOrRd"  # low scores yellow, high scores red
LINE_COLOR = "#0b0b0b"
LINE_OUTLINE = [pe.withStroke(linewidth=4.5, foreground="white", alpha=0.9)]


def plot_heatmap_with_edge(scores, word, trace):
    # Same grid as 001_danger_vs_pretty/c_make_graphs.py (colormap flipped). Cells are square but chunks
    # are not, so the line is compressed into chunk coordinates.
    grid = np.array(scores).reshape(X_NUM_CHUNKS, Y_NUM_CHUNKS).T

    col = trace["x_px"] / CHUNK_WIDTH_PX - 0.5
    row = trace["mean_y_px"] / CHUNK_HEIGHT_PX - 0.5

    plt.figure(figsize=(10, 6))
    plt.imshow(grid, cmap=CMAP, aspect='equal')
    plt.colorbar(label=f'{word} Score')
    plt.plot(col, row, color=LINE_COLOR, linewidth=2, path_effects=LINE_OUTLINE)
    plt.xlim(-0.5, X_NUM_CHUNKS - 0.5)
    plt.ylim(Y_NUM_CHUNKS - 0.5, -0.5)
    plt.title(f'{word} Scores by Chunk with Mean Flame Edge')
    plt.savefig(f'outputs/{word.lower()}_scores_by_chunk_with_edge.png')
    plt.close()


def to_percent(scores):
    """Min-max scale scores to 0-100 (lowest chunk = 0, highest = 100)."""
    return (scores - scores.min()) / (scores.max() - scores.min()) * 100


def plot_combined_heatmap_at_video_scale(pretty, dangerous, trace):
    """Pretty % + Dangerous % per chunk, with each cell drawn at its 384 x 240 px chunk size so the
    edge is plotted in video pixels instead of being compressed into chunk coordinates."""
    combined = to_percent(pretty) + to_percent(dangerous)
    grid = np.array(combined).reshape(X_NUM_CHUNKS, Y_NUM_CHUNKS).T
    width, height = X_NUM_CHUNKS * CHUNK_WIDTH_PX, Y_NUM_CHUNKS * CHUNK_HEIGHT_PX

    plt.figure(figsize=(12, 6))
    plt.imshow(grid, cmap=CMAP, extent=(0, width, height, 0))
    plt.colorbar(label='Pretty % + Dangerous %')
    plt.plot(trace["x_px"], trace["mean_y_px"], color=LINE_COLOR, linewidth=2, path_effects=LINE_OUTLINE)
    plt.xlim(0, width)
    plt.ylim(height, 0)
    plt.xlabel('x (video px)')
    plt.ylabel('y (video px)')
    plt.title('Pretty % + Dangerous % by Chunk with Mean Flame Edge')
    plt.savefig('outputs/pretty_plus_dangerous_by_chunk_with_edge.png')
    plt.close()


if __name__ == "__main__":
    df = pd.read_csv('data/averaged_data.csv')
    grouped = df.groupby(['word_one', 'chunk_number'])['averaged_value'].mean()
    pretty, dangerous = grouped.loc[PRETTY_WORD].sort_index(), grouped.loc[DANGEROUS_WORD].sort_index()

    trace = pd.read_csv('data/fire_edge_trace.csv')

    plot_heatmap_with_edge(pretty, 'Pretty', trace)
    plot_heatmap_with_edge(dangerous, 'Dangerous', trace)
    plot_combined_heatmap_at_video_scale(pretty, dangerous, trace)
