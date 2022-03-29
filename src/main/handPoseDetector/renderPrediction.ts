import config from '../../config';

export default class RenderPrediction {

  public static fpsCounter = 0;

  constructor(
    protected imageBitmap: ImageBitmap,
    protected ctx: CanvasRenderingContext2D,
  ) {
    ctx.drawImage(imageBitmap, 0, 0, config.capture.width, config.capture.height);
    RenderPrediction.fpsCounter++;
  }

}
