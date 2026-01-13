import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter

from CONFIG import ACCEPTABLE_WORD, ACCEPTABLE_PARSED, COLOR_MAP

sparse_matrix = np.load(f"data/{ACCEPTABLE_PARSED}_averaged_values_matrix.npy")


# Note: Previously tested with up to 5 iterations
# Note: Previously tested with sigma 1, 2, 4, 8, 16, 32, 64, 128, 196
# 3 iterations with sigma 128 had the best results
for sigma in [128]:
    for i in range(3):
        sparse_matrix = gaussian_filter(sparse_matrix, sigma=sigma)
        if i == 2:
            plt.imshow(sparse_matrix, cmap=COLOR_MAP)
            plt.colorbar(label='Smoothed Value')
            plt.title(f"Smoothed Matrix for {ACCEPTABLE_WORD}")
            plt.savefig(f"outputs/{ACCEPTABLE_PARSED}_smoothed_matrix_sigma_{sigma}_step_{i}.png", dpi=300)
            plt.close()