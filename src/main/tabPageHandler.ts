import type { videoElement } from '../types/tabPageHandler';

export default class TabPageHander {
  protected static readonly youtubeVideoElementClass = '.video-stream .html5-main-video';

  public tab: chrome.tabs.Tab;

  public videoElm: videoElement;

  constructor(tab: chrome.tabs.Tab) {
    this.tab = tab;
    this.videoElm = this.getVideoElm();
  }

  protected getVideoElm(): videoElement {
    let videoElement: videoElement = null;
    if (this.tab?.id) {
      const getElm = () => document.querySelector('.html5-main-video');
      this.executeScript<videoElement>(getElm, (res) => { console.log(res) })
    } else {
      this.noTabNotice();
    }
    console.log('videoElement = ', videoElement)
    return videoElement;
  }

  private executeScript<T>(func: () => T, callback: (res: chrome.scripting.InjectionResult[]) => void): void {
    if (typeof this.tab?.id === 'number') {
      chrome.scripting.executeScript(
        {
          target: { tabId: this.tab.id, allFrames: true },
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
