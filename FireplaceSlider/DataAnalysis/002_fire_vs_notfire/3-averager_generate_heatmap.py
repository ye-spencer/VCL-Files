import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv('datatable.csv')

grouped_by_prolific = df.groupby('prolific_id')['value'].mean()

min_per_prolific = df.groupby('prolific_id')['value'].min()
max_per_prolific = df.groupby('prolific_id')['value'].max()

print("\nMean values by prolific_id:")
print(grouped_by_prolific.sort_values(ascending=True))


difference_per_prolific = max_per_prolific - min_per_prolific


# For each row, calculate the percentage, which is the value minus the min divided by the difference
df["averaged_value"] = df.apply(lambda row: (row['value'] - min_per_prolific[row['prolific_id']]) / difference_per_prolific[row['prolific_id']], axis=1)

grouped_by_prolific_averaged = df.groupby('prolific_id')['averaged_value'].mean()

print("\nAveraged values by prolific_id:")
print(grouped_by_prolific_averaged.sort_values(ascending=True))


# Save the averaged data to a new CSV file
df.to_csv('averaged_data.csv', index=False)

grouped_by_chunk = df.groupby("chunk_number")["averaged_value"].mean()

chunk_values_series = grouped_by_chunk.to_numpy()

chunk_values_grid = np.array(chunk_values_series).reshape(10, 9).T


plt.figure(figsize=(10, 6))
plt.imshow(chunk_values_grid, cmap='Reds', aspect='equal')
plt.colorbar(label='Fire Likeness Average')
plt.title('Fire Likeness by Chunk Averaged')
plt.savefig(f'graphs/averaged_chunk_values_by_chunk.png')













