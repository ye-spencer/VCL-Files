import numpy as np
from scipy.ndimage import gaussian_filter
from CONFIG import ACCEPTABLE_WORD, ACCEPTABLE_PARSED, COLOR_MAP
import matplotlib.pyplot as plt
from matplotlib.cm import ScalarMappable
from matplotlib.colors import Normalize

def normalize_to_unit_range(arr):
    normalized = (arr - np.min(arr)) / (np.max(arr) - np.min(arr))
    
    # Now, these are 0-1, and we can apply some function to it
    # Or, edit the color map

    return normalized

sparse_matrix = np.load(f"data/{ACCEPTABLE_PARSED}_averaged_values_matrix.npy")

# Note: like steps E and F, we apply 3x128 sigma smoothing
sparse_matrix = gaussian_filter(sparse_matrix, sigma=128)
sparse_matrix = gaussian_filter(sparse_matrix, sigma=128)
sparse_matrix = gaussian_filter(sparse_matrix, sigma=128)

normalized_smoothed = normalize_to_unit_range(sparse_matrix)

fig, ax = plt.subplots()

counts, bins, patches = ax.hist(normalized_smoothed.flatten(), bins=100, edgecolor="black")
for bin_center, patch in zip(0.5 * (bins[:-1] + bins[1:]), patches):
    patch.set_facecolor(COLOR_MAP(bin_center))

ax.set_xlim(0, 1)
ax.set_title(f"Histogram of {ACCEPTABLE_WORD}")

norm = Normalize(vmin=0, vmax=1)
sm = ScalarMappable(cmap=COLOR_MAP, norm=norm)
sm.set_array([])  # required for colorbar
cbar = fig.colorbar(sm, ax=ax, orientation="horizontal", pad=0.15)
cbar.set_label("Colormap scale")

plt.savefig(f"outputs/{ACCEPTABLE_PARSED}_histogram_of_{ACCEPTABLE_WORD}.png")
plt.close()


