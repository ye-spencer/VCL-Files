import pandas as pd

df = pd.read_csv('data/cleaned_data.csv')

grouped_by_prolific = df.groupby('prolific_id')['value'].mean()

min_per_prolific = df.groupby('prolific_id')['value'].min()
max_per_prolific = df.groupby('prolific_id')['value'].max()

difference_per_prolific = max_per_prolific - min_per_prolific

print("\nMean values by prolific_id:")
print(grouped_by_prolific.sort_values(ascending=True))

df["averaged_value"] = df.apply(lambda row: (row['value'] - min_per_prolific[row['prolific_id']]) / difference_per_prolific[row['prolific_id']], axis=1)

grouped_by_prolific_averaged = df.groupby('prolific_id')['averaged_value'].mean()

print("\nAveraged values by prolific_id:")
print(grouped_by_prolific_averaged.sort_values(ascending=True))


# Save the averaged data to a new CSV file
df.to_csv('data/averaged_data.csv', index=False)
