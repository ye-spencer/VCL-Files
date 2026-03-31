# Rotate Rectangle Ratios

## Overview

This is an psychology experiment. There will be multiple trials.

We will start with an welcome page, then a few instruction pages, a few practice trials, a page indicating the real experiment is starting, then the actual trials, and a final exit screen.

## Design Choices

All constants should be well labeled and defined inside lib/constants.ts. It should have a relatively long name, as well as reasons why it exists and what it controls.

There should only be one page, no routes, as to prevent people from jumping around.

The size of rectangles should be different based on the size of the screen.

There should a trial component that takes parameters of the trial, specifically only the parameters that will change trial to trial. There should be no logic. All logic should be accomplished outside of the trial component. The trial component knows nothing of the procedure, it just draws and exports data. All randomization, selection, distribution work should be done outside of it. Parameters include the widths of both rectangles, lengths of both rectangles, the colors of each rectangle, and the location, along with a function to call with the data.

There should be a instruction component that also just takes parameters and displays.

There should be a state that manages what page we are on. We do not want any query parameters or routes that would easily allow skipping through the experiment. This can be just a simple integer. 

## The Trials

In each trial, the screen will start blank. There will be two rectangles, one on each side of the screen. The rectangles will appear for a brief second, then disappear. Then the participant will click either q or p to indicate which rectangle they thought was longer. The rectangles should have a certain ratio of length, which reach ration repeated a constant number of times.

The practice trials will have a negative trial number, starting from the lowest number and climbing to -1.

The rectangles should be random color chosen from a bank of colors.

The rectangles should be each on the left or right half of the screen. They should be in the middle 80% of the screen vertically and horizontally, but not the middle 10% of the screen horizontally such that the rectangles are not touching.