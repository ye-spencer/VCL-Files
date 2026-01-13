import pandas as pd
import os

from CONFIG import ACCEPTABLE_WORD, ACCEPTABLE_PARSED

df = pd.read_csv('data/cleaned_data.csv')

df = df[df['word_one'] == ACCEPTABLE_WORD]

grouped_by_prolific = df.groupby('prolific_id')['value'].mean()

print(grouped_by_prolific)

min_per_prolific = df.groupby('prolific_id')['value'].min()
max_per_prolific = df.groupby('prolific_id')['value'].max()
difference_per_prolific = max_per_prolific - min_per_prolific

df["averaged_value"] = df.apply(lambda row: (row['value'] - min_per_prolific[row['prolific_id']]) / difference_per_prolific[row['prolific_id']], axis=1)

grouped_by_chunk = df.groupby("prolific_id")["averaged_value"].mean()

print(grouped_by_chunk)

df.to_csv(f'data/{ACCEPTABLE_PARSED}_averaged_data.csv', index=False)
