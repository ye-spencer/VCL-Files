"""
Author: Spencer Ye

Notes:
 This project is not very portable. It requires 5 total videos in a specific file (because I just wanted to get it to work on my computer).
 Slight modification is likely needed to make it run on a different machine.


"""

import cv2
import json
import concurrent.futures
import time
import os

X_NUM_CHUNKS = 10
Y_NUM_CHUNKS = 9
x_chunk_size = 348 # ERROR: This was supposed to be 384, led to stripes of area without data
AVERAGE_BLOCK_SIZE = 24
y_chunk_size = 240

def collectDataOffsetRow(video_path, y_offset=0, start_x_offset=0, num_x_offsets=(x_chunk_size - AVERAGE_BLOCK_SIZE)):

    # Open the video & error handling
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Could not open video {video_path}")
        return
    
    # Initialize the data structures for all x_offsets
    # Create an array for each chunk (linearizing the 9 x 10), and give each offset key one of them
    all_block_data = {}
    for x_offset in range(start_x_offset, start_x_offset + num_x_offsets):
        all_block_data[x_offset] = [[] for _ in range(X_NUM_CHUNKS * Y_NUM_CHUNKS)]
    
    frame_count = 0
    
    while True:
        ret, frame = cap.read()
        
        if not ret:
            break
            
        frame_count += 1
        
        # Process all y chunks for each x chunk
        for x_chunk_num in range(X_NUM_CHUNKS):
            for y_chunk_num in range(Y_NUM_CHUNKS):
                block_num = x_chunk_num * Y_NUM_CHUNKS + y_chunk_num
                
                # Calculate the base position for this block
                base_x = int(x_chunk_num * x_chunk_size)
                top_left_corner_y = int(y_chunk_num * y_chunk_size) + y_offset
                
                # Extract a wider slice to accommodate all x_offsets
                # Add 1 to ensure we get enough columns for all offsets
                wide_slice = frame[
                    top_left_corner_y:top_left_corner_y + AVERAGE_BLOCK_SIZE,
                    base_x + start_x_offset:base_x + start_x_offset + AVERAGE_BLOCK_SIZE + num_x_offsets - 1
                ]
                
                # Skip if the slice is out of bounds
                if wide_slice.size == 0:
                    continue
                
                # Process each x_offset by sliding through the wide slice
                for i, x_offset in enumerate(range(start_x_offset, start_x_offset + num_x_offsets)):
                    # Extract the block for this specific x_offset
                    curr_block = wide_slice[:, i:i + AVERAGE_BLOCK_SIZE]
                    
                    # Skip if we don't have a complete block
                    if curr_block.shape[1] != AVERAGE_BLOCK_SIZE:
                        continue
                    
                    # Average the colors in the 24x24 slice we just added, append the value
                    mean_color = cv2.mean(curr_block)[:3]
                    all_block_data[x_offset][block_num].append([mean_color[2], mean_color[1], mean_color[0]])
    
    cap.release()
    
    # Save all the data to separate JSON files
    for x_offset in range(start_x_offset, start_x_offset + num_x_offsets):
        FILE_NAME = f"output_json/trial_data{x_offset}-{y_offset}.json"
        with open(FILE_NAME, 'w') as f:
            # Rounding for compression
            # Data is the rgb of the superpixel for each frame
            json.dump(
                {
                    "data": [[[round(c, 1) for c in color] for color in block] for block in all_block_data[x_offset]]
                }, 
                f, separators=(',', ':')
            )
        print(f"Finished: {x_offset}-{y_offset}, processed {frame_count} frames")


def process_multiple_y_offsets(y_offsets, start_x_offset, num_x_offsets, max_workers=None):
    
    start_time = time.time()
    
    # Get the number of CPU cores available
    available_cpus = os.cpu_count()
    
    # If max_workers is not specified or is greater than available CPUs, use available CPUs
    if max_workers is None or max_workers > available_cpus:
        workers = available_cpus
    else:
        workers = max_workers
    
    print(f"Starting parallel processing with {workers} worker processes")
    
    # Use ProcessPoolExecutor with specified number of workers
    with concurrent.futures.ProcessPoolExecutor() as executor:
        # Submit tasks for each y-offset
        futures = [
            executor.submit(collectDataOffsetRow, f"firevids/fire{y_offset % 5}.mp4", y_offset, start_x_offset, num_x_offsets)
            for y_offset in y_offsets
        ]
        
        # Wait for all tasks to complete
        concurrent.futures.wait(futures)
    
    end_time = time.time()
    print(f"Processed {len(y_offsets)} y-offsets in {end_time - start_time:.2f} seconds using {workers} CPU cores")



# Example usage
if __name__ == "__main__":
    for y in range(0, 216, 5):
        y_offsets = list(range(y, y + 4))  # y-offsets 
        for x in range(0, x_chunk_size - AVERAGE_BLOCK_SIZE, 18): # 18 is arbitrarily selected level of parallelism, seemed to work best
            process_multiple_y_offsets(y_offsets, start_x_offset=x, num_x_offsets=18)