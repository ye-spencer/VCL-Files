import numpy as np
from scipy.ndimage import gaussian_filter
from CONFIG import ACCEPTABLE_PARSED_LIST, ACCEPTABLE_WORD_LIST, COLOR_MAP_LIST
import matplotlib.pyplot as plt

def normalize_to_unit_range(arr):
    return (arr - np.min(arr)) / (np.max(arr) - np.min(arr))

combined_colors_matrix = np.zeros((2160, 3840, 3))

for i in range(len(ACCEPTABLE_PARSED_LIST)):
    ACCEPTABLE_PARSED = ACCEPTABLE_PARSED_LIST[i]
    ACCEPTABLE_WORD = ACCEPTABLE_WORD_LIST[i]
    COLOR_MAP = COLOR_MAP_LIST[i]

    sparse_matrix = np.load(f"data/{ACCEPTABLE_PARSED}_averaged_values_matrix.npy")

    # Note: like steps E and F, we apply 3x128 sigma smoothing
    sparse_matrix = gaussian_filter(sparse_matrix, sigma=128)
    sparse_matrix = gaussian_filter(sparse_matrix, sigma=128)
    sparse_matrix = gaussian_filter(sparse_matrix, sigma=128)

    # Doesn't matter if we do this once or three times
    normalized_smoothed = normalize_to_unit_range(sparse_matrix)

    colored_normalized_smoothed = COLOR_MAP(normalized_smoothed)
    # colored_normalized_smoothed is (H, W, 4) RGBA, so we multiply RGB by A and drop A
    opacity = colored_normalized_smoothed[..., 3:4]  # shape (H, W, 1)
    colored_normalized_smoothed = colored_normalized_smoothed[..., :3] * opacity  # shape (H, W, 3)

    combined_colors_matrix += colored_normalized_smoothed

combined_colors_matrix = combined_colors_matrix / len(ACCEPTABLE_PARSED_LIST)

plt.imshow(combined_colors_matrix)
plt.title(f"Blended Smoothed Matrix Total")
plt.savefig("outputs/combined_colors_matrix.png", dpi=300, transparent=True)
plt.close()
