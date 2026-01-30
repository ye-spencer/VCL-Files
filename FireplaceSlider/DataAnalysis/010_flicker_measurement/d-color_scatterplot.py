import requests
import time
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json


NUM_X_POINTS = 324 
NUM_Y_POINTS = 216
NUM_CHUNKS = 90
SECONDS = 30
FPS = 24



def calculate_average_color_per_chunk(SKIP_ITERATION):

    result = [[0, 0, 0] for _ in range(NUM_CHUNKS)]
    counter = 0
    used_chunks = 0

    for x in range(NUM_X_POINTS):
        for y in range(NUM_Y_POINTS):
            counter += 1
            if counter % SKIP_ITERATION != 0:
                continue

            used_chunks += 1
            start_time = time.time()

            bucket = 'halberdalab-fireplaceslider-firevideos'
            key = f'output_json/trial_data{x}-{y}.json'

            url = f'https://{bucket}.s3.amazonaws.com/{key}'
            response = requests.get(url)
            data = response.json()

            length = len(data["data"])
            assert length == NUM_CHUNKS

            for i in range(NUM_CHUNKS):
                n = len(data["data"][i])
                assert n == SECONDS * FPS

                for k in range(0, n):
                    result[i][0] += data["data"][i][k][0]
                    result[i][1] += data["data"][i][k][1]
                    result[i][2] += data["data"][i][k][2]

            print(f"{counter:05d}/{NUM_X_POINTS * NUM_Y_POINTS} | Time taken: ", time.time() - start_time)

    tuple_result = []
    for i in range(NUM_CHUNKS):
        r = result[i][0] / (used_chunks * 256 * SECONDS * FPS)
        g = result[i][1] / (used_chunks * 256 * SECONDS * FPS)
        b = result[i][2] / (used_chunks * 256 * SECONDS * FPS)
        tuple_result.append((r, g, b))
    print(tuple_result)
    return tuple_result


def scatterplot_it_up(flicker_scores, file_prefix, color_list):
    df_pd = pd.read_csv('data/averaged_data.csv')

    df_pd_grouped = df_pd.groupby(['word_one', 'chunk_number'])["averaged_value"].mean()

    dangerous_scores = df_pd_grouped.loc['Less Good for Danger Signal'].sort_index()
    pretty_scores = df_pd_grouped.loc["Less Pretty Stone"].sort_index()

    max_flicker_score = max(flicker_scores)
    flicker_scores = [score / max_flicker_score for score in flicker_scores]


    # Pretty Scores vs Flicker Scores
    plt.figure(figsize=(10, 6))
    plt.scatter(flicker_scores, pretty_scores, alpha=0.5, c=color_list)

    plt.xlabel('Flicker Score')
    plt.ylabel('Jeweler Pretty Score') 
    plt.title('Flicker vs Jeweler Pretty Scores')

    plt.xlim(0, 1)
    plt.ylim(0, 1)

    z = np.polyfit(flicker_scores, pretty_scores, 1)
    p = np.poly1d(z)
    plt.plot(flicker_scores, p(flicker_scores), "b--", alpha=0.8)

    # Calculate correlation coefficient
    correlation = np.corrcoef(flicker_scores, pretty_scores)[0,1]

    # Add stats text to plot
    stats_text = f'Correlation: {correlation:.3f}\nSlope: {z[0]:.3f}\nIntercept: {z[1]:.3f}'
    plt.text(0.05, 0.95, stats_text, transform=plt.gca().transAxes, 
            verticalalignment='top', bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))

    plt.savefig(f'outputs/{file_prefix}_vs_jeweler_pretty_scores.png')



    # Dangerous Scores vs Flicker Scores
    plt.figure(figsize=(10, 6))
    plt.scatter(flicker_scores, dangerous_scores, alpha=0.5, c=color_list)

    plt.xlabel('Flicker Score')
    plt.ylabel('Sign-Dangerous Score') 
    plt.title('Flicker vs Sign-Dangerous Scores')

    plt.xlim(0, 1)
    plt.ylim(0, 1)

    z = np.polyfit(flicker_scores, dangerous_scores, 1)
    p = np.poly1d(z)
    plt.plot(flicker_scores, p(flicker_scores), "b--", alpha=0.8)

    # Calculate correlation coefficient
    correlation = np.corrcoef(flicker_scores, dangerous_scores)[0,1]

    # Add stats text to plot
    stats_text = f'Correlation: {correlation:.3f}\nSlope: {z[0]:.3f}\nIntercept: {z[1]:.3f}'
    plt.text(0.05, 0.95, stats_text, transform=plt.gca().transAxes,             
            verticalalignment='top', bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))

    plt.savefig(f'outputs/{file_prefix}_vs_sign_dangerous_scores.png')

colors = calculate_average_color_per_chunk(24)

with open('data/colors_avg_24.json', 'w') as f:
    json.dump(colors, f)

with open("data/flickerness_sum_24.json", "r") as f:
    result = json.load(f)

scatterplot_it_up(result, "flicker_24", colors)
