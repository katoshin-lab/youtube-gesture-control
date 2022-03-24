import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

export default class HandPauseDetector {
  
  protected videoTrack: MediaStreamVideoTrack;

  protected detector!: handPoseDetection.HandDetector;

  public count = 0;

  constructor(stream: MediaStream) {
    this.setDetector();
    this.videoTrack = stream.getVideoTracks()[0] as MediaStreamVideoTrack;
    const processor = new MediaStreamTrackProcessor({ track: this.videoTrack });
    const writableStream = new WritableStream({
      start() {
        console.log('writable stream is started')
      },
      write: async (videoStream: VideoFrame) => {
        const imageBitmap = await createImageBitmap(videoStream);
        if (this.detector) {
          const hand = await this.detector.estimateHands(imageBitmap);
          this.count++
          console.log('stream count: ', this.count)
          console.log('streaming: ', hand);
          if (this.count % 100 === 0)chrome.runtime.sendMessage('hand');
          imageBitmap.close();
          videoStream.close();
        } else {
          videoStream.close();
        }
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

  async setDetector() {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
      runtime: 'tfjs', // or 'tfjs',
      modelType: 'full'
    } as handPoseDetection.MediaPipeHandsTfjsModelConfig;
    this.detector = await handPoseDetection.createDetector(model, detectorConfig);
  }

}
