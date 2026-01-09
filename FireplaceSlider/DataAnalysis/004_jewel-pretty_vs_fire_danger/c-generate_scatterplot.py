import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df_pd = pd.read_csv('data/averaged_data.csv')



df_pd_grouped = df_pd.groupby(['word_one', 'chunk_number'])["averaged_value"].mean()


dangerous_scores = df_pd_grouped.loc['Less Good for Danger Signal'].sort_index()
# print("\nDangerous scores by chunk number:")
# print(dangerous_scores)

pretty_scores = df_pd_grouped.loc["Less Pretty Stone"].sort_index()
# print("\nPretty scores by chunk number:")
# print(pretty_scores)


plt.figure(figsize=(10, 6))
plt.scatter(dangerous_scores, pretty_scores, alpha=0.5)


plt.xlabel('Sign Dangerous Score')
plt.ylabel('Jeweler Pretty Score') 
plt.title('Sign Dangerous vs Jeweler Pretty Scores')

plt.xlim(0, 1)
plt.ylim(0, 1)

z = np.polyfit(dangerous_scores, pretty_scores, 1)
p = np.poly1d(z)
plt.plot(dangerous_scores, p(dangerous_scores), "r--", alpha=0.8)

# Calculate correlation coefficient
correlation = np.corrcoef(dangerous_scores, pretty_scores)[0,1]

# Add stats text to plot
stats_text = f'Correlation: {correlation:.3f}\nSlope: {z[0]:.3f}\nIntercept: {z[1]:.3f}'
plt.text(0.05, 0.95, stats_text, transform=plt.gca().transAxes, 
         verticalalignment='top', bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))

plt.savefig(f'outputs/sign_dangerous_vs_jeweler_pretty_scores.png')

