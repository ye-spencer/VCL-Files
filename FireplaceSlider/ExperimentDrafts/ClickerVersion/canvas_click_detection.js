function isBox(mouseX, mouseY)
{
   display_ctx.clearRect(0, 0, real_canvas.width, real_canvas.height);
   display_ctx.fillStyle = "rgb(0,0,0)";
   display_ctx.fillText("Trial # " + current_trial_number + "/10", 10, 20);

   for (let i = 0; i < BOXES_PER_TRIAL; i++)
   {
      [box_x, box_y] = current_video_locations[i];
      let x_diff = (mouseX  - real_canvas.offsetTop) - box_x;
      let y_diff = (mouseY - real_canvas.offsetLeft) - box_y;
      if (x_diff >= 0 && x_diff < VIDEO_SIZE_Y && y_diff >= 0 && y_diff < VIDEO_SIZE_Y)
      {
         is_selected_current_round[i] = !is_selected_current_round[i];
         if (is_selected_current_round[i])
         {
            storeEventInformation({
               event : "Box Select",
               entityId : video_indexes[(current_trial_number - 1) * BOXES_PER_TRIAL + i],
               timestamp : (new Date())
            })
         }
         else
         {
            storeEventInformation({
               event : "Box Deselect",
               entityId : video_indexes[(current_trial_number - 1) * BOXES_PER_TRIAL + i],
               timestamp : (new Date())
            })
         }
      }

      if (is_selected_current_round[i])
      {
         display_ctx.strokeRect(current_video_locations[i][0], current_video_locations[i][1], BOX_SIZE, BOX_SIZE);
      }

      let [avgR, avgG, avgB] = averageSquareOfSizeN(current_video_locations[i][0] + BLENDINGSIZE + 1, current_video_locations[i][1] + BLENDINGSIZE + 1, BLENDINGSIZE)

      display_ctx.fillStyle = `rgb(${avgR}, ${avgG}, ${avgB})`
      display_ctx.fillRect(current_video_locations[i][0], current_video_locations[i][1], BOX_SIZE, BOX_SIZE);
      
      
   } 
   return false;
}
/**
 * PROBLEM: Currently No Zoom Allowed
 * 
 * 1) the canvas is not directly placed on the top-left corner of the page, so automatically there is offset there
 * 
 * 2) the pixels change (unpredictably to me, but there is definitely some pattern to it) when we zoom and scroll
 * 
 * 
 */
