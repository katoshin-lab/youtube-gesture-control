import config from '../../config';
import { Keypoint } from '@tensorflow-models/hand-pose-detection';

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
    this.preCtx = this.prerender.getContext('2d');
  }

  public draw(keypoints: Keypoint[] | undefined, imageBitmap: ImageBitmap): void {
    if (this.preCtx) {
      this.preCtx.clearRect(0, 0, this.prerender.width, this.prerender.height);
      this.preCtx.drawImage(imageBitmap, 0, 0, this.prerender.width, this.prerender.height);
      if (keypoints) {
        this.prerenderStroke(keypoints);
      }
      this.render();
    }
    RenderPrediction.fpsCounter += 1;
  }

  protected prerenderStroke(keypoints: Keypoint[]): void {
    const start = keypoints.find(({ name }) => name === 'index_finger_mcp');
    const end = keypoints.find(({ name }) => name === 'index_finger_tip');
    if (start && end && this.preCtx) {
      this.preCtx.beginPath();
      this.preCtx.moveTo(
        Math.round((config.capture.width * 5 - start.x) / 2.5),
        Math.round(start.y / 2.5)
      );
      this.preCtx.lineTo(
        Math.round((config.capture.width * 5 - end.x) / 2.5),
        Math.round(end.y / 2.5)
      );
      console.log('from: ', Math.round((config.capture.width * 5 - start.x) / 2.5), Math.round(start.y / 2.5), 'to: ', Math.round((config.capture.width * 5 - end.x) / 2.5), Math.round(end.y / 2.5))
      this.preCtx.strokeStyle = "green";
      this.preCtx.lineWidth = 3;
      this.preCtx.stroke();
    }
  }

  protected render(): void {
    if (this.preCtx) {
      const imageData = this.preCtx.getImageData(0, 0, this.prerender.width, this.prerender.height);
      this.ctx.putImageData(imageData, 0, 0);
    }
  }

}
