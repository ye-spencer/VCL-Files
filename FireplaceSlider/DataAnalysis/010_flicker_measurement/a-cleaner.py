import pandas as pd

df = pd.read_csv("data/raw_datatable.csv")

prolific_counts = df['prolific_id'].value_counts()

valid_counts = prolific_counts[prolific_counts == 90]
invalid_counts = prolific_counts[prolific_counts != 90]

print(valid_counts)
print(invalid_counts)

df = df[df['prolific_id'].isin(valid_counts.index)]

print(df)

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
