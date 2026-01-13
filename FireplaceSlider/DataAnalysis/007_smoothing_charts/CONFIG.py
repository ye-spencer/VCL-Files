import matplotlib.colors as mcolors
ACCEPTABLE_WORD_LIST = ["Less Good for Background", "Less Pretty Stone", "Less Good for Danger Signal", "Less Good for Safe Signal"]
ACCEPTABLE_PARSED_LIST = ["less-good-for-background", "less-pretty-stone", "less-good-for-danger-signal", "less-good-for-safe-signal"]

COLOR_MAP_LIST = [
    mcolors.LinearSegmentedColormap.from_list("transparent", [(0, 0, 1, 0), (0, 0, 1, 1)]), # blue
    mcolors.LinearSegmentedColormap.from_list("transparent", [(1, 1, 0, 0), (1, 1, 0, 1)]), # yellow
    mcolors.LinearSegmentedColormap.from_list("transparent", [(1, 0, 0, 0), (1, 0, 0, 1)]), # red
    mcolors.LinearSegmentedColormap.from_list("transparent", [(1, 1, 1, 0), (1, 1, 1, 1)]), # gray
]

CURR_ITER = 3 # Change this to switch between different words, either 0, 1, 2, or 3
# Must run through all iterations to get all charts for each word

ACCEPTABLE_WORD = ACCEPTABLE_WORD_LIST[CURR_ITER]
ACCEPTABLE_PARSED = ACCEPTABLE_PARSED_LIST[CURR_ITER]

COLOR_MAP = COLOR_MAP_LIST[CURR_ITER]