// import * as handdetection from '@tensorflow-models/hand-pose-detection';

export default class HandPauseDetector {

  constructor(stream: MediaStream) {
    const videoTrack = stream.getVideoTracks()[0] as MediaStreamVideoTrack;
    const processor = new MediaStreamTrackProcessor({ track: videoTrack });
    const writableStream = new WritableStream({
      start() {
        console.log('writable stream is started')
      },
      write(videoStream) {
        console.log('streaming: ', videoStream);
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
