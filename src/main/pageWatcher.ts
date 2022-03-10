export default class PageWatcher {
  public static started: boolean = false;
  protected static readonly targetUrl = 'https://shunsugu.jp/live';

  private _enabled: boolean = false;

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

  protected callback(historyItem: chrome.history.HistoryItem, captureTabs?: (tabs: chrome.tabs.Tab[]) => void): void {
    if (captureTabs && historyItem.url?.startsWith(PageWatcher.targetUrl)) {
      console.log(historyItem);
      chrome.tabs.query(
        { url: PageWatcher.targetUrl },
        (tabs) => captureTabs(tabs)
      )
    }
  }

  protected captureTabs(tabs: chrome.tabs.Tab[]) {
    console.log(tabs);
  }

  protected addWatchListener() {
    chrome.history.onVisited.addListener((historyItem) => this.callback(historyItem, this.captureTabs));
    PageWatcher.started = true;
  }

  protected removeWatchListener() {
    chrome.history.onVisited.removeListener(this.callback);
    PageWatcher.started = false;
  }
}
