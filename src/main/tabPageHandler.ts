// import type { videoElement } from '../types/tabPageHandler';

export default class TabPageHander {
  public tab: chrome.tabs.Tab;

  constructor(tab: chrome.tabs.Tab) {
    this.tab = tab;
  }

  public playVideo(): void {
    this.executeScript(
      () => {
        const video = document.querySelector('div.html5-video-container video.html5-main-video') as HTMLVideoElement;
        console.log(video);
        video?.play();
      },
      (res) => console.log('play', res),
    );
  }

  public pauseVideo(): void {
    this.executeScript(
      () => {
        const video = document.querySelector('div.html5-video-container video.html5-main-video') as HTMLVideoElement;
        console.log(video);
        video?.pause();
      },
      (res) => console.log('pause', res),
    );
  }

  // seconds could be negative.
  public seekVideo(seconds: number): void {
    this.executeScript(
      () => {
        const video = document.querySelector('div.html5-video-container video.html5-main-video') as HTMLVideoElement;
        video.currentTime += seconds;
      },
      (res) => console.log('seek', res),
    );
  }

  public historyBack(): void {
    this.executeScript(
      // eslint-disable-next-line no-restricted-globals
      () => { history.back(); },
      (res) => console.log('history back', res),
    );
  }

  public historyForward(): void {
    this.executeScript(
      // eslint-disable-next-line no-restricted-globals
      () => { history.forward(); },
      (res) => console.log('history back', res),
    );
  }

  private executeScript<T = void>(
    func: () => T,
    callback: (res: chrome.scripting.InjectionResult[]) => void,
  ): void {
    if (typeof this.tab?.id === 'number') {
      chrome.scripting.executeScript(
        {
          target: { tabId: this.tab.id },
          func,
        },
        callback,
      );
    } else {
      this.noTabNotice();
    }
  }

  private noTabNotice() {
    console.log('TabPageHandler: tab is not specified.');
  }
}
