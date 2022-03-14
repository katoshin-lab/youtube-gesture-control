export default class PageWatcher {
  public static started: boolean = false;

  // protected static readonly targetUrl = 'https://www.youtube.com/watch';
  protected static readonly targetUrl = 'https://shunsugu.jp/live';

  protected static readonly captureTabKey = 'CAPTURE_TAB_KEY';

  private _enabled: boolean = false;

  public captureTab: chrome.tabs.Tab | undefined;

  constructor(enabled: boolean) {
    this._enabled = enabled;
  }

  public start(): void {
    if (PageWatcher.started) {
      console.log('PageWatcher has already started.');
    } else if (this._enabled) {
      this.addWatchListener();
    }
  }

  set enabled(enabled: boolean) {
    this._enabled = enabled;
    if (enabled && !PageWatcher.started) {
      this.addWatchListener();
    } else if (!enabled) {
      this.removeWatchListener();
    }
  }

  get enabled(): boolean {
    return this._enabled;
  }

  // callbacks

  protected onHistoryChange(
    historyItem: chrome.history.HistoryItem,
  ): void {
    if (historyItem.url?.startsWith(PageWatcher.targetUrl)) {
      chrome.tabs.query(
        {active: true, currentWindow: true},
        this.captureTabs.bind(this),
      );
    }
  }

  protected captureTabs(tabs: chrome.tabs.Tab[]): void {
    const tab = tabs[0];
    if (tab) {
      this.captureTab = tab;
      this.handleTab();
    } else {
      console.log('couldn\'t get the tab.');
    }
  }

  protected handleTab(): void {
    console.log(this.captureTab);
    const video = window.document.querySelector('video-stream html5-main-video');
    console.log(video);
  }

  // add listener

  protected addWatchListener(): void {
    PageWatcher.started = true;
    chrome.history.onVisited.addListener(this.onHistoryChange.bind(this));
  }

  protected removeWatchListener(): void {
    chrome.history.onVisited.removeListener(this.onHistoryChange);
    PageWatcher.started = false;
  }
}
