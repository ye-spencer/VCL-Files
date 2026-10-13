# Brainstorm

We should have a few main displays, the first is our main experiment screen component. This will have a few parameters, but will display 6 sticks at varying angles and colors.
- default_color_degree - integer hue degrees # The default color of a stick
- default_orientation_degree - integer degrees # The default tilt of a stick, measured from vertical
- diff_orientation - boolean # Will there be a stick with a different orientation
- diff_orientation_number - integer, optional # position of the stick with a different orientation
- diff_orientation_degree - integer, optional # degrees tilt of the different stick, measured from vertical
- diff_color - boolean # Will there be a stick with a different color
- diff_color_number - integer, optional # position of the stick with a different color
- diff_color_degree - integer, optional # color of the stick with a different color

The second is our main question screen component. This will also have a few parameters, and will display one stick on the left hand side and one stick on the right hand sid.
- trial_type - string # Either orientation or color
- which_correct - string # Either left or right
- correct_color - int # Color of the stick matching the redundant singleton
- diff_color - int # Degrees different from the correct_color, 0 for no difference
- correct_orientation - int # Orientation of the stick matching the redundant singleton
- diff_orientation - int # Degrees difference of the stick matching the redundant singleton

We will need a function that determines what the entire experiment ends up being for a specific participant, it will line up an array with different screens and data for display in each screen. It will build with the following patterns
- miniblocks: 2-5 in a row of either diff color or diff orientation
- redundant trial: different color and different orientation
- main question: 1 of either changed color or changed orientation

There are also these rules
- diff_color_degree is between 90 and 180 degrees off
- diff_orientation_degree is 10 and 45 degrees off
- orientation main question will always have gray colored bars
- color main question will always have vertical bars
- Difference degrees in main question will be start off by 20 degrees, and decrease by 5 on correct answers, and increase by 5 on incorrect answers


We should have a trial number track, so people know how much they have completed and how much they have left to do.

We need a database to store all of our information, including this per trial
- profilic id
- which trial number they are on (1 to ~100)
  - Monotonically increasing for all trials, normal, redundant, main
- trial display information (used to populate the screen)
- correct or incorrect


Concerns
- Description says start at +/- 20, and decrease by 5 degrees, so after 4 more corrects than incorrects, they are the same, perhaps a proportional decrease/increase
- Is hue degree different and orientation degree difference equal? Because we have color difference 90 to 180 and oriention difference 10 to 45, but then we stay at 20 degrees +/- 5 for both main questions
- What is the question are we asking for each trial?
- What are the prompts that we are giving initially?