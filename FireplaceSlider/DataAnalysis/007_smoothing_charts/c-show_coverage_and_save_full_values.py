import pandas as pd
import matplotlib.pyplot as plt


X_BLOCK_SIZE = 384
Y_BLOCK_SIZE = 240
BLOCK_SIZE = 24
Y_NUM_CHUNKS = 9
X_NUM_CHUNKS = 10

from CONFIG import ACCEPTABLE_WORD, ACCEPTABLE_PARSED

def get_full_x_y(x, y, chunk_number):
    # Calculate chunk coordinates from chunk number
    # chunk_number = x_chunk_num * Y_NUM_CHUNKS + y_chunk_num
    y_chunk_num = chunk_number % Y_NUM_CHUNKS
    x_chunk_num = chunk_number // Y_NUM_CHUNKS
    
    # Calculate starting coordinates
    x_start = x_chunk_num * X_BLOCK_SIZE + x
    y_start = y_chunk_num * Y_BLOCK_SIZE + y
    return x_start, y_start


df = pd.read_csv(f"data/{ACCEPTABLE_PARSED}_averaged_data.csv")

to_save_df = pd.DataFrame(columns=['x', 'y', 'averaged_value'])
new_rows = {}
i = 0
plt.figure(figsize=(12, 8))
for index, row in df.iterrows():
    x, y = get_full_x_y(row['x'], row['y'], row['chunk_number'])
    new_rows[i] = {'x': x, 'y': y, 'averaged_value': row['averaged_value'] * 100}
    i += 1
    rect = plt.Rectangle((x, y), BLOCK_SIZE, BLOCK_SIZE, color='blue', alpha=0.5)
    plt.gca().add_patch(rect)

plt.xlim(0, 3840)
plt.ylim(0, 2160)
plt.title('Full Coverage Map with 24x24 Pixel Circles for ' + ACCEPTABLE_WORD)
plt.xlabel('X Coordinate')
plt.ylabel('Y Coordinate')
plt.grid(True, which='major', alpha=0.3)
plt.xticks(range(0, 3840, 384))
plt.yticks(range(0, 2160, 240))
plt.savefig(f'outputs/{ACCEPTABLE_PARSED}_full_coverage_map.png')
plt.close()
print(new_rows)
to_save_df = pd.DataFrame(new_rows.values())
to_save_df.to_csv(f'data/{ACCEPTABLE_PARSED}_X_Y_averaged_values.csv', index=False)

exit(0)




