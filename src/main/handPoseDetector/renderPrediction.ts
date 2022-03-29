import config from '../../config';

export default class RenderPrediction {
  public static fpsCounter = 0;

  constructor(
    protected imageBitmap: ImageBitmap,
    protected ctx: CanvasRenderingContext2D,
  ) {
    RenderPrediction.fpsCounter += 1;
  }

  public drow() {
    this.ctx.drawImage(this.imageBitmap, 0, 0, config.capture.width, config.capture.height);
  }
}
