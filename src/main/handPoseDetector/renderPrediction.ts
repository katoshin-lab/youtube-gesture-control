import config from '../../config';
import { Keypoint } from '@tensorflow-models/hand-pose-detection';

export default class RenderPrediction {
  public static fpsCounter = 0;

  constructor(
    protected keypoints: Keypoint[],
    protected imageBitmap: ImageBitmap,
    protected ctx: CanvasRenderingContext2D,
  ) {
    RenderPrediction.fpsCounter += 1;
  }

  public drow(): void {
    this.ctx.drawImage(this.imageBitmap, 0, 0, config.capture.width, config.capture.height);
    this.drowStroke();
  }

  protected drowStroke(): void {
    const start = this.keypoints.find(({ name }) => name === 'index_finger_pip');
    const end = this.keypoints.find(({ name }) => name === 'index_finger_tip');
    if (start && end) {
      this.ctx.beginPath();
      this.ctx.moveTo(
        start.x / 8,
        start.y / 8
      );
      this.ctx.lineTo(
        end.x / 8,
        end.y / 8
      );
      this.ctx.strokeStyle = "plum";
      this.ctx.lineWidth = 4;
      this.ctx.stroke();
      console.log(this.ctx)
    }
    

  }
}
