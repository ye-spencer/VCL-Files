# Fireplace Slider Final Experiment Generating Superpixels

## Overview

These files are the files used to go from our fire video (included) into uploading superpixel information to AWS S3 to be used in the final experiment.

I chose to utilize object-storage because it was too slow to calculate what a superpixel would look like at runtime.

## Files

check_file.py checks that all of the proper files were created in the output folder. I had difficulty with creation a few times, so this was the check script.

test_block_parallel.py creates the actual superpixels and saves the information locally.

upload_json.py uploads the local json files to AWS S3

## Known Very Big Error

Every place that we manually hard-coded the number 348, it should actually have been 384. I typed the number wrong once, and it permeated everywhere.

This led to having stripes of no data where there should have been data. MISTAKE!
