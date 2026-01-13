import pandas as pd

df = pd.read_csv("data/raw_datatable.csv")

print(df.head())

prolific_counts = df['prolific_id'].value_counts()

valid_counts = prolific_counts[prolific_counts % 90 == 0]
invalid_counts = prolific_counts[prolific_counts % 90 != 0]

print(valid_counts)
print(invalid_counts)

# print("Valid counts: ", valid_counts.unique())
# print("Invalid counts: ", invalid_counts.unique())

df = df[df['prolific_id'].isin(valid_counts.index)]

print(len(df['prolific_id'].unique()))

for col in ['session_id', 'x', 'y', 'word_one', 'word_two']:
    # Group by prolific_id and check if there's more than one unique value per group
    inconsistent = df.groupby('prolific_id')[col].nunique() > 1
    if inconsistent.any():
        print(f"Warning: Found inconsistent {col} values for some prolific_ids")
        print(f"Prolific IDs with inconsistent {col}:")
        print(inconsistent[inconsistent].index.tolist())
    else:
        print(f"All prolific_ids have consistent {col} values")

df.to_csv('data/cleaned_data.csv', index=False)
print("Cleaned data saved to 'data/cleaned_data.csv'")