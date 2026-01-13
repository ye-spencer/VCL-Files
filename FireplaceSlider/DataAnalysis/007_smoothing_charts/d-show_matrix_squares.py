import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from CONFIG import ACCEPTABLE_WORD, ACCEPTABLE_PARSED
BLOCK_SIZE = 24

X_TOTAL = 3840
Y_TOTAL = 2160


df = pd.read_csv(f"data/{ACCEPTABLE_PARSED}_X_Y_averaged_values.csv")


print(df.head())

matrix_values = np.zeros((Y_TOTAL, X_TOTAL))
matrix_count = np.zeros((Y_TOTAL, X_TOTAL))

for index, row in df.iterrows():
    x = int(row['x'])
    y = int(row['y'])
    for x_add in range(BLOCK_SIZE): 
        for y_add in range(BLOCK_SIZE):
            # Could become out of bounds, can switch to vectorized operations
            matrix_values[y + y_add][x + x_add] += row['averaged_value']
            matrix_count[y + y_add][x + x_add] += 1

for x in range(X_TOTAL):
    for y in range(Y_TOTAL):
        if matrix_count[y][x] > 0:
            matrix_values[y][x] = matrix_values[y][x] / matrix_count[y][x]
        else:
            matrix_values[y][x] = 0


numpy_filename = f"data/{ACCEPTABLE_PARSED}_averaged_values_matrix.npy"
np.save(numpy_filename, matrix_values)
print(f"Matrix values saved as numpy array to {numpy_filename}")


plt.imshow(matrix_values, cmap='gray')  # Use 'gray' for grayscale
plt.colorbar()  # Optional, adds a color scale bar
plt.title("2D Matrix Visualization for " + ACCEPTABLE_WORD)

plt.savefig(f"outputs/{ACCEPTABLE_PARSED}_averaged_values_matrix.png")