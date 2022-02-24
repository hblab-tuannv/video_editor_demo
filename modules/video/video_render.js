class VideoRender {
  constructor(fabricCanvas, videoElement) {
    this.fabricCanvas = fabricCanvas;
    this.videoElement = videoElement;
  }

  async render() {
    let $this = this,
    [videoWidth, videoHeight] = await this.#get_video_dimension(),
    canvasWidth = this.fabricCanvas.getWidth(),
    canvasHeight = this.fabricCanvas.getHeight(),
    videoRatio = videoWidth / videoHeight,
    canvasRatio = canvasWidth / canvasHeight;

    // Set the width and height of the video let the canvas size is
    // equal to the video size
    this.videoElement.height = videoHeight;
    this.videoElement.width = videoWidth;
    let fabricVideo = new fabric.Image(this.videoElement, {
      angle: 0,
      objectCaching: false,
    });

    // Scale video to fit canvas size
    if (videoRatio <= canvasRatio) {
      if (videoHeight > canvasHeight) fabricVideo.scaleToHeight(canvasHeight);
    } else {
      if (videoWidth > canvasWidth) fabricVideo.scaleToWidth(canvasWidth);
    }

    this.#set_cornor_fabric_video(fabricVideo);
    this.fabricCanvas.add(fabricVideo);
    this.fabricCanvas.centerObject(fabricVideo);

    fabric.util.requestAnimFrame(function render() {
      $this.fabricCanvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });

    return fabricVideo;
  }

  #get_video_dimension() {
    return new Promise(resolve => {
      this.videoElement.onloadeddata = () => {
        resolve([this.videoElement.videoWidth, this.videoElement.videoHeight]);
      }
    });
  }

  #set_cornor_fabric_video(fabricVideo) {
    fabricVideo.set({
      cornerColor: "#5969e2",
      cornerStrokeColor: "#5969e2",
      borderColor: "#5969e2",
      cornerSize: 12,
      cornerStyle: "circle",
      borderDashArray: [3, 3],
      transparentCorners: false,
    });
  }
}

export {
  VideoRender
};
