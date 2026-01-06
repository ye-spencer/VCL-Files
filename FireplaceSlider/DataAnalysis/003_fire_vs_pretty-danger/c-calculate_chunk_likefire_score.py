import pandas as pd


# Read cleaned data
cleaned_data = pd.read_csv('data/averaged_fire_data.csv')

# Group by chunk_id and calculate the mean of the averaged_value column
grouped_data = cleaned_data.groupby('chunk_number')['averaged_value'].mean()

# Print the grouped data
print(grouped_data)

# Save the grouped data to a new CSV file
grouped_data.to_csv('data/chunk_likefire_score.csv', index=True)
