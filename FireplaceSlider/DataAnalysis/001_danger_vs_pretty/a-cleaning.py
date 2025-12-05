import pandas as pd

### Read Raw Data File
df = pd.read_csv('data/raw_data.csv')

### Drop occurences of prolific_id that are not 90, where they didn't finish the survey ###
prolific_counts = df['prolific_id'].value_counts()

valid_counts = prolific_counts[prolific_counts == 90]
invalid_counts = prolific_counts[prolific_counts != 90]

df = df[df['prolific_id'].isin(valid_counts.index)]

### Check if all prolific_ids have consistent values for session_id, x, y, word_one, and word_two, as they should all be the same for each prolific_id ###
for col in ['session_id', 'x', 'y', 'word_one', 'word_two']:
    # Group by prolific_id and check if there's more than one unique value per group
    inconsistent = df.groupby('prolific_id')[col].nunique() > 1
    if inconsistent.any():
        print(f"Warning: Found inconsistent {col} values for some prolific_ids")
        print(f"Prolific IDs with inconsistent {col}:")
        print(inconsistent[inconsistent].index.tolist())
    else:
        print(f"All prolific_ids have consistent {col} values")

### Swap word_one and word_two to be in alphabetical order, and invert the value ###
mask = df['word_one'] > df['word_two']
df.loc[mask, ['word_one', 'word_two']] = df.loc[mask, ['word_two', 'word_one']].values
df.loc[mask, ['value']] = df.loc[mask, ['value']].apply(lambda x: 100 - x)

### Save the cleaned dataframe to a new CSV file ###
df.to_csv('data/cleaned_data.csv', index=False)
print("Cleaned data saved to 'cleaned_data.csv'")



