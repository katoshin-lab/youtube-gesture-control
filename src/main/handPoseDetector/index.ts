import * as tf from '@tensorflow/tfjs';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import RenderPrediction from './renderPrediction';

export default class HandPauseDetector {

  public count = 0;

  constructor(public stream: MediaStream, public ctx: CanvasRenderingContext2D | null) {}

  public async setDetectStream() {
    await tf.ready();

    const model = handPoseDetection.SupportedModels.MediaPipeHands;

    const detectorConfig = {
      runtime: 'tfjs',
      modelType: 'full'
    } as handPoseDetection.MediaPipeHandsTfjsModelConfig;
    const detector = await handPoseDetection.createDetector(model, detectorConfig);
    const track = this.stream.getVideoTracks()[0] as MediaStreamVideoTrack;
    track.applyConstraints({
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 }
    })
    const processor = new MediaStreamTrackProcessor({ track });

    const writableStream = new WritableStream({
      start() {
        console.log('writable stream is started');
      },
      write: async (videoStream: VideoFrame) => {
        const imageBitmap = await createImageBitmap(videoStream);
        const hand = await detector.estimateHands(imageBitmap, { flipHorizontal: true });
        this.count++
        console.log('stream count: ', this.count)
        console.log('streaming: ', hand);
        if (hand.length === 0)chrome.runtime.sendMessage('no hand');
        if (this.ctx) new RenderPrediction(imageBitmap, this.ctx);
        imageBitmap.close();
        videoStream.close();
      },
      close() {
        console.log('close writable stream');
      },
      abort(err) {
        console.log('writable stream aborted: ', err);
      }
    });

    processor.readable.pipeTo(writableStream);
  }

}
