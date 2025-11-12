const hidden_canvas = document.getElementById('hiddenCanvas');
const hidden_ctx = hidden_canvas.getContext('2d', { willReadFrequently: true });
const real_canvas = document.getElementById('myCanvas');
const display_ctx = real_canvas.getContext('2d');

const NUM_X_SPLITS = 10;
const NUM_Y_SPLITS = 9;
const GRID_SIZE_X = 1152;
const GRID_SIZE_Y = 648;
const VIDEO_SIZE_X = 192;
const VIDEO_SIZE_Y = 108;
const TRIALS = 10;
const BOXES_PER_TRIAL = 9;
const SQRT_BOXES_PER_TRIAL = 3;
const BOX_SIZE = 100;
const HOST_LINK = "http://localhost:8000"; // TO CHANGE OUT OF PRODUCTION: change link to wherever they are actually hosted

let all_videos_set = []
let video_indexes = [] // TODO Instead of Removing, Just Shuffle

// Test Variables
const BLENDINGSIZE = 10;


function createVideoElement(videoSrc) {
    // Create video element
    const video = document.createElement('video');
    video.setAttribute('controls', 'true');
    video.setAttribute('autoplay', 'true');
    video.setAttribute('muted', 'true');
    video.setAttribute('crossorigin', 'anonymous'); // Set CORS

    // Create source element
    const source = document.createElement('source');
    source.setAttribute('src', videoSrc);
    source.setAttribute('type', 'video/mp4');

    // Append the source to the video element
    video.appendChild(source);

    return video;
}

// IMPROVEMENT: get rid of this completely, just have areas and one large video
let vid_num = 0
for (let i = 0; i < NUM_X_SPLITS; i++)
{
    for (let j = 0; j < NUM_Y_SPLITS; j++)
    {
        let video = createVideoElement(HOST_LINK + "/output_videos/" + j + "-" + i + ".mp4")
        all_videos_set.push(video)
        video_indexes.push(vid_num++)
    }
}

function shuffleArray(array) 
{
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(video_indexes);

let current_videos = [] // IMPROVEMENT: i would love for these to get passed, so maybe learn how passing by reference works here
let current_video_locations = [] // 2-d array, locations
let is_selected_current_round = []
let current_trial_number = 0;

let video_information = {}


function start_next_round()
{
    count_selected = is_selected_current_round.reduce((acc, num) => acc + num, 0);
    if (current_trial_number != 0 && (count_selected <= 2 || count_selected >= 7)) // TODO: Doesn't Check on Finish
    {
        alert("Please Between 3 and 6 Boxes");
        return;
    }


    if (current_trial_number > TRIALS)
    {
        console.log("Thank You For Participating!");
        console.log(JSON.stringify(video_information))
        return;
    }
    current_trial_number += 1
    // Disable Button
    // document.getElementById("playButton").disabled = true;

    storeEventInformation({
        event : "Round Start",
        entityId : current_trial_number,
        timestamp : (new Date())
     })

    // Clear Round Information
    current_videos = []
    current_video_locations = []
    is_selected_current_round = []
    display_ctx.clearRect(0, 0, real_canvas.width, real_canvas.height);
    display_ctx.fillStyle = "rgb(0,0,0)";
    display_ctx.fillText("Trial # " + current_trial_number + "/10", 10, 20);

    // Choose Random Videos
    for (let i = 0; i < BOXES_PER_TRIAL; i++)
    {
        const random_index = (current_trial_number - 1) * BOXES_PER_TRIAL + i // video_indexes[(current_trial_number - 1) * BOXES_PER_TRIAL + i]
        current_videos.push(all_videos_set[random_index])
        video_information[random_index] = []

        // Generate Random Placement for the Videos
        let random_x = Math.floor(Math.random() * ((GRID_SIZE_X / SQRT_BOXES_PER_TRIAL) - VIDEO_SIZE_X) + ((i % 3) * (GRID_SIZE_X / SQRT_BOXES_PER_TRIAL)));
        let random_y = Math.floor(Math.random() * ((GRID_SIZE_Y / SQRT_BOXES_PER_TRIAL) - VIDEO_SIZE_Y) + (Math.floor(i / 3) * (GRID_SIZE_Y / SQRT_BOXES_PER_TRIAL)));
        current_video_locations.push([random_x, random_y])
        is_selected_current_round.push(false);
    }

    // Play all Videos
    for (let i = 0; i < BOXES_PER_TRIAL; i++)
    {
        current_videos[i].play()
    }
    

    // Start Round Drawing
    draw_current_round();
}

function averageSquareOfSizeN(x_middle, y_middle, size)
{
    // IMPROVEMENT: change to only get the data we need, because this is unnecessary
    const imageData = hidden_ctx.getImageData(0, 0, hidden_canvas.width, hidden_canvas.height);
    const data = imageData.data;

    let r = 0, g = 0, b = 0, count = 0;
    for (let i = -1 * size; i <= size; i++)
    {
        for (let j = -1 * size; j <= size; j++)
        {
            let x = x_middle + i;
            let y = y_middle + j;

            // TO OPTIMIZE: change to just video length, for now we will pick spots that work better
            if (x < 0 || x >= hidden_canvas.width || y < 0 || y >= hidden_canvas.height) continue;

            const index = (y * hidden_canvas.width + x) * 4; // Multiply by 4 for RGBA
            r += data[index];     // Red channel
            g += data[index + 1]; // Green channel
            b += data[index + 2]; // Blue channel
            count++;
        }
    }

    const avgR = Math.round(r / count);
    const avgG = Math.round(g / count);
    const avgB = Math.round(b / count);

    return [avgR, avgG, avgB];


}

function draw_current_round() {

    // Draw each square 
    let ended = false;
    for (let i = 0; i < BOXES_PER_TRIAL; i++)
    {
        if (current_videos[i].ended)
        {
            ended = true;
            break;
        }
        
        hidden_ctx.drawImage(current_videos[i], current_video_locations[i][0], current_video_locations[i][1], VIDEO_SIZE_X, VIDEO_SIZE_Y);
        
        // TODO: just generate random location within the bounds
        // Get the average color of the square
        let [avgR, avgG, avgB] = averageSquareOfSizeN(current_video_locations[i][0] + BLENDINGSIZE + 1, current_video_locations[i][1] + BLENDINGSIZE + 1, BLENDINGSIZE)

        // Fill the square with the proper color
        display_ctx.fillStyle = `rgb(${avgR}, ${avgG}, ${avgB})`
        display_ctx.fillRect(current_video_locations[i][0], current_video_locations[i][1], BOX_SIZE, BOX_SIZE);

        const random_index = (current_trial_number - 1) * BOXES_PER_TRIAL + i
        video_information[random_index].push([avgR, avgG, avgB])

    }

    // Check if the round is ended, redraw if no
    if (!ended)
    {
        requestAnimationFrame(draw_current_round);
    }
    else
    {
        end_current_round();
    }
}

function end_current_round()
{
    console.log("end of round!")
    console.log(video_information)
}


function setUp()
{
    const strokeSize = 6;
    display_ctx.strokeStyle="rgb(5, 73, 5)";
    display_ctx.lineWidth = strokeSize; 

    real_canvas.addEventListener('click', (e) => { isBox(e.clientX, e.clientY); });
    document.getElementById('playButton').addEventListener('click', start_next_round);
}

function storeEventInformation(event)
{
    console.log(JSON.stringify(event))
}


setUp();

/**
 * 
 * When Refactoring:
 * Have a function that just redraws everything we want based on the inputs
 * 
 */

/**
 * 
 * Concerns:
 * Not every pixel is uniformly brought up and averaged, since averaging needs a buffer, so pixels within that buffer are not counted as often
 */


/**
 * 
 * Bugs:
 *  - First frame is all black for some reason
 *  - You can still scroll down too far because of the hidden canvas
 *     - Maybe just get rid of using a hidden canvas, and instead request the data from a server
 *  - Super slow because it is loading each and every video from the source
 */

/**
 * 
 *  Next Steps:
 *  - Generate and Store Information
 *  - Have End Screen After Final Submit
 *  - Show Trial # Out of Total
 *  - Move Canvas to Be Full Page (Have Instruction Section, and Box Section), and base off screen size from 
 *  - Have Start Page with Instructions (& Separate Start, which doesn't check for Box Checks)
 */

/**
 * 
 * Ideas
 *  - Allow to submitting after 15 seconds (or immediately, because it doesn't make sense for people to select after it ends)
 *  - Use A Bridson Fast Poisson Disk Sampling in 2 dimensions
 *  - Have everything in the setUp Function 
 *  - Remove any global variables
 *  - Allow for zooming in and out on Canvas
 *  - Have a loading screen that loads immediately, instead of all this other stuff
 *  - Either loop, or have a timer that auto-submits
 */
/**
 * 
 * Questions
 *  - Where do we want to 
 */