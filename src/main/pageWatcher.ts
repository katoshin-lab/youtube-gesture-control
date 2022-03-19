import TabPageHander from './tabPageHandler';

export default class PageWatcher {

  protected static readonly targetUrl = 'https://www.youtube.com/watch';

  protected static readonly captureTabKey = 'CAPTURE_TAB_KEY';

  public tabPageHandler!: TabPageHander;

  constructor() {
    this.addWatchListener();
    this.sampleEvent();
    console.log('PageWatcher is enabled.');
  }

  // callbacks

  protected onHistoryChange(
    historyItem: chrome.history.HistoryItem,
  ): void {
    console.log(historyItem);
    if (historyItem.url?.startsWith(PageWatcher.targetUrl)) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        this.captureTabs.bind(this),
      );
    }
  }

  protected captureTabs(tabs: chrome.tabs.Tab[]): void {
    const tab = tabs[0];
    if (tab) {
      this.tabPageHandler = new TabPageHander(tab);
      console.log('captureTab: ', this.tabPageHandler);
    } else {
      console.log('couldn\'t get the tab.');
    }
  }

  // add listener

  protected addWatchListener(): void {
    chrome.history.onVisited.addListener(this.onHistoryChange.bind(this));
  }

  protected sampleEvent(): void {
    chrome.commands.onCommand.addListener((command) => {
      if (this.tabPageHandler && command === 'pause_video') {
        this.tabPageHandler.pauseVideo();
      }
    });
  }
}
