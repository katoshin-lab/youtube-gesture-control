// import type { videoElement } from '../types/tabPageHandler';

export default class TabPageHander {
  protected static readonly youtubeVideoElementClass = '.video-stream .html5-main-video';

  public tab: chrome.tabs.Tab;

  constructor(tab: chrome.tabs.Tab) {
    this.tab = tab;
  }

  public pauseVideo() {
    this.executeScript(
      () => {
        const video = document.querySelector('.html5-main-video') as HTMLVideoElement
        video?.pause();
      },
      (res) => console.log('pause', res)
    );
  }

  private executeScript<T = void>(func: () => T, callback: (res: chrome.scripting.InjectionResult[]) => void): void {
    if (typeof this.tab?.id === 'number') {
      chrome.scripting.executeScript(
        {
          target: { tabId: this.tab.id },
          func
        },
        callback
      );
    } else {
      this.noTabNotice();
    }
  }

  private noTabNotice() {
    console.log('TabPageHandler: tab is not specified.');
  }

}
