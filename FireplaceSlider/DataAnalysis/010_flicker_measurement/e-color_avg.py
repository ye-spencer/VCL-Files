import json
import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter1d


colors = json.load(open('data/colors_avg_24.json', 'r'))

with open("data/flickerness_sum_24.json", "r") as f:
    flicker_scores = json.load(f)

max_flicker_score = max(flicker_scores)
flicker_scores = [score / max_flicker_score for score in flicker_scores]

## Option 1: Lines In Order (Not Correct Space)
sorted_idx = np.argsort(flicker_scores)
sorted_colors = [colors[i] for i in sorted_idx]
sorted_flicker_scores = [flicker_scores[i] for i in sorted_idx]
plt.figure(figsize=(10, 6))
plt.imshow([sorted_colors], extent=[0, 100, 0, 20])
plt.savefig(f'outputs/color_avg_24_lines_false_space.png')
plt.close()

## Option 2: Scatter Plot In Correct Space
plt.scatter(flicker_scores, np.zeros_like(flicker_scores), c=colors, s=200, marker='|')
plt.yticks([])
plt.xlabel("Value (0 → 1)")
plt.title("Colors at Their Value Positions")
plt.savefig(f'outputs/color_avg_24_scatter.png')
plt.close()

## Option 3: Blurred Lines In Correct Space
# TODO: need to tune sigma and iterations to get a good result
rgb_line = np.zeros((1000, 3))
x_smooth = np.linspace(0, 1, 1000)
indices = np.searchsorted(x_smooth, flicker_scores)
rgb_line[indices] = colors
rgb_blurred = rgb_line.copy()

sigma = 50
for iteration in range(5):
    rgb_blurred = gaussian_filter1d(rgb_blurred, sigma=sigma, axis=0, mode='nearest')
    rgb_blurred[indices] = colors


plt.imshow([rgb_blurred], extent=[0, 1, 0, 0.2], aspect='auto')
plt.yticks([])
plt.xlabel("Value (0 → 1)")
plt.title(f"Gaussian-blurred Color Map (sigma={sigma})")
plt.savefig(f'outputs/color_avg_24_blurred_lines.png')
plt.close()
