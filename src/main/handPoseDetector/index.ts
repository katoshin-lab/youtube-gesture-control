import * as tf from '@tensorflow/tfjs';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import RenderPrediction from './renderPrediction';

export const renderCanvasFlagKey = {
  enable: 'enableRenderCanvas',
  disable: 'disableRenderCanvas'
} as const;

export default class HandPauseDetector {
  public static initialized = false;

  public count = 0;

  // リソース節約のため表示してない時はcanvasを更新しない
  protected renderCanvas = true;

  protected renderer!: RenderPrediction;

  constructor(public stream: MediaStream, public ctx: CanvasRenderingContext2D | null) {
    HandPauseDetector.initialized = true;
    this.setTabActivateEventListener();
  }

  public async setDetectStream() {
    await tf.ready();

    const model = handPoseDetection.SupportedModels.MediaPipeHands;

    const detectorConfig = {
      runtime: 'tfjs',
      modelType: 'full',
      maxHands: 1
    } as handPoseDetection.MediaPipeHandsTfjsModelConfig;
    const detector = await handPoseDetection.createDetector(model, detectorConfig);
    const track = this.stream.getVideoTracks()[0] as MediaStreamVideoTrack;
    track.applyConstraints({
      width: { ideal: 720 },
      height: { ideal: 480 },
      frameRate: { ideal: 60 },
    });
    const processor = new MediaStreamTrackProcessor({ track });

    const writableStream = new WritableStream({
      start() {
        console.log('writable stream is started');
      },
      write: async (videoFrame: VideoFrame) => {
        const imageBitmap = await createImageBitmap(videoFrame);
        const hand = await detector.estimateHands(imageBitmap, { flipHorizontal: true });
        this.count += 1;
        console.log('stream count: ', this.count);
        console.log('streaming: ', hand);
        if (this.ctx && !this.renderer) {
          this.renderer = new RenderPrediction(this.ctx);
        }
        if (this.renderCanvas && this.renderer) {
          this.renderer.draw(hand[0]?.keypoints, imageBitmap);
        }
        imageBitmap.close();
        videoFrame.close();
      },
      close() {
        console.log('close writable stream');
      },
      abort(err) {
        console.log('writable stream aborted: ', err);
      },
    });

    processor.readable.pipeTo(writableStream);
  }

  protected setTabActivateEventListener() {
    chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
      if (message === renderCanvasFlagKey.enable) {
        this.renderCanvas = true;
      } else if (message === renderCanvasFlagKey.disable) {
        this.renderCanvas = false;
      }
      sendResponse();
    })
  }
}
