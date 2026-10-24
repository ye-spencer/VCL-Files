import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patheffects as pe

# Overlay the mean flame edge on the chunk heatmaps from 001_danger_vs_pretty
# (data/averaged_data.csv is copied from there).

# Heatmap cells are square but chunks are not, so the line is compressed into chunk coordinates.
# Chunk n's samples come from video x in [348n, 348n + 348), not 384 (see the "Known Very Big Error"
# in FinalExperiment/GeneratingSuperpixels), so the 10 columns only reach x = 3480 and the right
# edge of the video was never rated. The line is clipped there.
CHUNK_WIDTH_PX = 348
CHUNK_HEIGHT_PX = 240
X_NUM_CHUNKS = 10
Y_NUM_CHUNKS = 9

LINE_COLOR = "#0b0b0b"
LINE_OUTLINE = [pe.withStroke(linewidth=4.5, foreground="white", alpha=0.9)]


def plot_heatmap_with_edge(scores, word, trace):
    # Same grid and colormap as 001_danger_vs_pretty/c_make_graphs.py
    grid = np.array(scores).reshape(X_NUM_CHUNKS, Y_NUM_CHUNKS).T

    col = trace["x_px"] / CHUNK_WIDTH_PX - 0.5
    row = trace["mean_y_px"] / CHUNK_HEIGHT_PX - 0.5

    plt.figure(figsize=(10, 6))
    plt.imshow(grid, cmap='YlOrRd_r', aspect='equal')
    plt.colorbar(label=f'{word} Score')
    plt.plot(col, row, color=LINE_COLOR, linewidth=2, path_effects=LINE_OUTLINE)
    plt.xlim(-0.5, X_NUM_CHUNKS - 0.5)
    plt.ylim(Y_NUM_CHUNKS - 0.5, -0.5)
    plt.title(f'{word} Scores by Chunk with Mean Flame Edge')
    plt.savefig(f'outputs/{word.lower()}_scores_by_chunk_with_edge.png')
    plt.close()


if __name__ == "__main__":
    df = pd.read_csv('data/averaged_data.csv')
    grouped = df.groupby(['word_one', 'chunk_number'])['averaged_value'].mean()

    trace = pd.read_csv('data/fire_edge_trace.csv')
    trace = trace[trace["x_px"] < X_NUM_CHUNKS * CHUNK_WIDTH_PX]

    for word in ['Pretty', 'Dangerous']:
        plot_heatmap_with_edge(grouped.loc[word].sort_index(), word, trace)
