import {
  VideoTrackCanvas
} from '../../modules/timeline/video_track_canvas.js';

document.onreadystatechange = function () {
  document.getElementById('video_input').addEventListener('change', (e) => {
    let video = document.getElementById('video_preview');
    video.src = URL.createObjectURL(e.target.files[0]);
    video.controls = true

    let videoTrackCanvas = new VideoTrackCanvas(e.target.files[0], 20, 35).create();
    document.getElementById('video_track').appendChild(videoTrackCanvas);
  });
};
