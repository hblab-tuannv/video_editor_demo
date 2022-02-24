import {
  VideoTrackCanvas
} from '../../modules/timeline/video_track_canvas.js';

import {
  VideoRender
} from '../../modules/video/video_render.js';

document.onreadystatechange = function () {

  let fabricCanvas = new fabric.Canvas('canvas_preview', {
    backgroundColor: 'black',
  });

  document.getElementById('video_input').addEventListener('change', async (e) => {
    let video = document.getElementById('video_preview');
    video.src = URL.createObjectURL(e.target.files[0]);
    video.controls = true

    let videoTrackCanvas = new VideoTrackCanvas(e.target.files[0], 20, 35).create();
    document.getElementById('video_track').appendChild(videoTrackCanvas);

    let fabricVideo = await new VideoRender(fabricCanvas, video).render();
  });
};
