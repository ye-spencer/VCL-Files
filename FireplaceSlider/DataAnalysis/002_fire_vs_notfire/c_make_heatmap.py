from matplotlib import pyplot as plt
import pandas as pd
import numpy as np

df = pd.read_csv('data/averaged_data.csv')

grouped_by_chunk = df.groupby("chunk_number")["averaged_value"].mean()

print(grouped_by_chunk)

chunk_values_series = grouped_by_chunk.to_numpy()

chunk_values_grid = np.array(chunk_values_series).reshape(10, 9).T

print(chunk_values_grid)

grouped_by_chunk.to_csv("outputs/grouped_by_chunk.csv", index=False)

# Create heatmap for dangerous scores
plt.figure(figsize=(10, 10))
plt.imshow(chunk_values_grid, cmap='Reds', aspect='equal')
plt.colorbar(label='Fire Likeness Score')
plt.title('Fire Likeness by Chunk')
plt.savefig(f'outputs/chunk_values_by_chunk.png')
