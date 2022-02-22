class VideoTrackCanvas {
  #currentFrame = 0;
  #currentCanvasWidth = 0;

  static previewRatio = 16 / 9;

  constructor(videoFile, maxFrames, previewHeight) {
    this.videoFile = videoFile;
    this.maxFrames = maxFrames;
    this.previewHeight = previewHeight;
    this.previewWidth = VideoTrackCanvas.previewRatio * previewHeight;
    this.canvas = document.createElement("canvas");
  }

  create() {
    this.canvas.height = this.previewHeight;
    this.canvas.width = VideoTrackCanvas.previewRatio * this.previewHeight * this.maxFrames + this.maxFrames;
    this.#create_video_for_get_frame();
    return this.canvas;
  }

  #create_video_for_get_frame() {
    let $this = this,
      video = document.createElement("video"),
      even = 0;

    video.onloadeddata = () => {
      let videoRatio = video.videoWidth / video.videoHeight;

      even = video.duration / ($this.maxFrames + 1);
      setTimeout(() => {
        $this.#copy_video_frame_at(video, videoRatio, even);
      }, 500);
    };
    video.src = window.URL.createObjectURL(this.videoFile);
  }

  #copy_video_frame_at(video, videoRatio, even) {
    let $this = this,
      time = even * this.#currentFrame;

    video.currentTime = time;
    if (this.#currentFrame > this.maxFrames)
      return;

    setTimeout(() => {
      let ctx = $this.canvas.getContext("2d");

      if ($this.previewWidth >= videoRatio * $this.previewHeight) {
        ctx.drawImage(video, $this.#currentCanvasWidth + ($this.previewWidth - videoRatio * $this.previewHeight) / 2, 0, videoRatio * $this.previewHeight, $this.previewHeight);
      } else {
        ctx.drawImage(video, $this.#currentCanvasWidth, ($this.previewHeight - $this.previewWidth / (videoRatio)) / 2, $this.previewWidth, $this.previewWidth / (videoRatio));
      }
      $this.#currentFrame++;
      $this.#currentCanvasWidth += $this.previewWidth + 1;
      ctx.fillStyle = "white";
      ctx.fillRect($this.#currentCanvasWidth - 1, 0, 1, this.canvas.height);
      $this.#copy_video_frame_at(video, videoRatio, even);
    }, 100);
  }
}

export {
  VideoTrackCanvas
};
