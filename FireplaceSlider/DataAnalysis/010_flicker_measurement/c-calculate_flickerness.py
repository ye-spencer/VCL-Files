import requests
import time
import json
import math

NUM_X_POINTS = 324 
NUM_Y_POINTS = 216
NUM_CHUNKS = 90
SECONDS = 30
FPS = 24


# Utilizing a5_calculate_flickerness_abs_rgb_change_weighted_log.py

def run_calculation(SKIP_ITERATION):
    flickerness_sum = [0] * NUM_CHUNKS
    counter = 0
    for x in range(NUM_X_POINTS):
        for y in range(NUM_Y_POINTS):
            counter += 1
            if counter % SKIP_ITERATION != 0:
                continue
            start_time = time.time()

            bucket = 'halberdalab-fireplaceslider-firevideos'
            key = f'output_json/trial_data{x}-{y}.json' 

            url = f'https://{bucket}.s3.amazonaws.com/{key}'
            response = requests.get(url)
            data = response.json()

            length = len(data["data"])
            assert length == NUM_CHUNKS

            for i in range(NUM_CHUNKS):
                total = 0
                n = len(data["data"][i])
                assert n == SECONDS * FPS

                for k in range(1, n):
                    total += 0.2126 * abs(data["data"][i][k][0] - data["data"][i][k-1][0])
                    total += 0.7152 * abs(data["data"][i][k][1] - data["data"][i][k-1][1])
                    total += 0.0722 * abs(data["data"][i][k][2] - data["data"][i][k-1][2])
                flickerness_sum[i] += total

            print(f"{counter:05d}/{NUM_X_POINTS * NUM_Y_POINTS} | Time taken: ", time.time() - start_time)

    flickerness_sum = [math.log(x) for x in flickerness_sum]
    return flickerness_sum

result = run_calculation(24)
min_result = min(result)
result = [x - min_result for x in result]
json.dump(result, open("data/flickerness_sum_24.json", "w"))
