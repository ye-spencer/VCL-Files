import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df_pd = pd.read_csv('data/averaged_data.csv')


df_pd_grouped = df_pd.groupby(['word_one', 'chunk_number'])["averaged_value"].mean()


dangerous_scores = df_pd_grouped.loc["Less Good for Danger Signal"].sort_index()
pretty_scores = df_pd_grouped.loc["Less Pretty Stone"].sort_index()

dangerous_scores_grid = np.array(dangerous_scores).reshape(10, 9).T
pretty_scores_grid = np.array(pretty_scores).reshape(10, 9).T


# Create heatmap for dangerous scores
plt.figure(figsize=(10, 6))
plt.imshow(dangerous_scores_grid, cmap='YlOrRd', aspect='equal')
plt.colorbar(label='Sign Dangerous Score')
plt.title('Sign Dangerous Scores by Chunk')
plt.savefig(f'outputs/sign_dangerous_scores_by_chunk.png')

# Create a heatmap of pretty scores
plt.figure(figsize=(10, 6))
plt.imshow(pretty_scores_grid, cmap='YlOrRd', aspect='equal')
plt.colorbar(label='Jeweler Pretty Score')
plt.title('Jeweler Pretty Scores by Chunk')
plt.savefig(f'outputs/jeweler_pretty_scores_by_chunk.png')





