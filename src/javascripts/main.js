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
    let videoFile = e.target.files[0];

    if (videoFile.type != 'video/mp4') {
      const { createFFmpeg } = FFmpeg;
      const ffmpeg = createFFmpeg({
        corePath: '../../static/js/ffmpeg-core.js',
        log: true,
      });

      const file = new Uint8Array(await readFromBlobOrFile(videoFile));
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }
      ffmpeg.FS('writeFile', videoFile.name, file);
      await ffmpeg.run('-i', videoFile.name, '-c:v', 'libx264', 'output.mp4');
      const data = ffmpeg.FS('readFile', 'output.mp4');
      videoFile = new Blob([data.buffer], { type: 'video/mp4' });
    }

    let video = document.getElementById('video_preview');
    video.src = URL.createObjectURL(videoFile);
    video.controls = true

    let videoTrackCanvas = new VideoTrackCanvas(e.target.files[0], 20, 35).create();
    document.getElementById('video_track').appendChild(videoTrackCanvas);

    let fabricVideo = await new VideoRender(fabricCanvas, video).render();
  });
};

const readFromBlobOrFile = (blob) => (
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = ({ target: { error: { code } } }) => {
      reject(Error(`File could not be read! Code=${code}`));
    };
    fileReader.readAsArrayBuffer(blob);
  })
);
