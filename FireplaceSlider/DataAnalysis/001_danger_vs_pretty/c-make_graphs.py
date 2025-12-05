import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Read the cleaned data
df = pd.read_csv('data/averaged_data.csv')

# Group by word_one and word_two, and calculate the mean value for each chunk_number
grouped = df.groupby(['word_one', 'chunk_number'])['averaged_value'].mean()

# Print the scores for each word
dangerous_scores = grouped.loc['Dangerous'].sort_index()
print("\nDangerous scores by chunk number:")
print(dangerous_scores)

pretty_scores = grouped.loc['Pretty'].sort_index()
print("\nPretty scores by chunk number:")
print(pretty_scores)

# Create a scatter plot
plt.figure(figsize=(10, 6))
plt.scatter(dangerous_scores, pretty_scores, alpha=0.5)

plt.xlabel('Dangerous Score')
plt.ylabel('Pretty Score') 
plt.title('Dangerous vs Pretty Scores')

plt.xlim(0, 1)
plt.ylim(0, 1)

# Add linear regression line
z = np.polyfit(dangerous_scores, pretty_scores, 1)
p = np.poly1d(z)
plt.plot(dangerous_scores, p(dangerous_scores), "r--", alpha=0.8)
plt.savefig(f'outputs/dangerous_vs_pretty_scores.png')

# Reshape into 9x10 grid
dangerous_scores_grid = np.array(dangerous_scores).reshape(10, 9).T
pretty_scores_grid = np.array(pretty_scores).reshape(10, 9).T

# Create heatmap for dangerous scores
plt.figure(figsize=(10, 6))
plt.imshow(dangerous_scores_grid, cmap='YlOrRd_r', aspect='equal')
plt.colorbar(label='Dangerous Score')
plt.title('Dangerous Scores by Chunk')
plt.savefig(f'outputs/dangerous_scores_by_chunk.png')

# Create a heatmap of pretty scores
plt.figure(figsize=(10, 6))
plt.imshow(pretty_scores_grid, cmap='YlOrRd_r', aspect='equal')
plt.colorbar(label='Pretty Score')
plt.title('Pretty Scores by Chunk')
plt.savefig(f'outputs/pretty_scores_by_chunk.png')



