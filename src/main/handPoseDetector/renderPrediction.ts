import config from '../../config';
import { Keypoint } from '@tensorflow-models/hand-pose-detection';

// const fingerLookupIndices = {
//   thumb: [0, 1, 2, 3, 4],
//   indexFinger: [0, 5, 6, 7, 8],
//   middleFinger: [0, 9, 10, 11, 12],
//   ringFinger: [0, 13, 14, 15, 16],
//   pinky: [0, 17, 18, 19, 20],
// };

const connections = [
  [0, 1], [1, 2], [2, 3], [3,4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13,14], [14, 15], [15, 16],
  [0, 17], [17, 18],[18, 19], [19,20]
];

export default class RenderPrediction {
  public static fpsCounter = 0;

  protected prerender: HTMLCanvasElement;

  protected preCtx: CanvasRenderingContext2D | null;

  constructor(
    protected ctx: CanvasRenderingContext2D,
  ) {
    this.prerender = document.createElement('canvas');
    this.prerender.width = config.capture.width * 2;
    this.prerender.height = config.capture.height * 2;
    this.preCtx = this.prerender.getContext('2d', { alpha: false });
  }

  public draw(keypoints: Keypoint[] | undefined, imageBitmap: ImageBitmap): void {
    if (this.preCtx) {
      // clear the pre-render canvas object
      this.preCtx.clearRect(0, 0, this.prerender.width, this.prerender.height);

      // draw the camera capture on the pre-render canvas
      this.preCtx.drawImage(imageBitmap, 0, 0, this.prerender.width, this.prerender.height);

      if (keypoints) {
        this.prerenderPath(keypoints);
      }

      this.render();
    }
    RenderPrediction.fpsCounter += 1;
  }

  // draw path on the pre-render canvas onto the hands
  protected prerenderPath(keypoints: Keypoint[]): void {
    if (this.preCtx) {
      this.preCtx.beginPath();
      for (let i = 0; i < connections.length; i++) {
        const [startIndex, endIndex] = connections[i];
        const start = keypoints[startIndex];
        const end = keypoints[endIndex];
        this.preCtx.moveTo(
          Math.round((config.capture.width * 5 - start.x) / 2.5),
          Math.round(start.y / 2.5)
        );
        this.preCtx.lineTo(
          Math.round((config.capture.width * 5 - end.x) / 2.5),
          Math.round(end.y / 2.5)
        );
        // console.log('from: ', Math.round((config.capture.width * 5 - start.x) / 2.5), Math.round(start.y / 2.5), 'to: ', Math.round((config.capture.width * 5 - end.x) / 2.5), Math.round(end.y / 2.5))
        this.preCtx.strokeStyle = "green";
        this.preCtx.lineWidth = 3;
      }
      this.preCtx.stroke();
    }
  }

  // draw the pre-rendered image data on the visible canvas.
  protected render(): void {
    if (this.preCtx) {
      const imageData = this.preCtx.getImageData(0, 0, this.prerender.width, this.prerender.height);
      this.ctx.putImageData(imageData, 0, 0);
    }
  }

}
