"""
A quick script that checks if all the relevant information is in the output folder. 

Needs to be configured to use the correct output folder

"""


import os

count = 0
for x in range(0, 324):
    for y in range(0, 216):
        filepath = f"output_json/trial_data{x}-{y}.json"
        if not os.path.isfile(filepath):
            print(filepath)
            count += 1
    print(x)
print(count)