export default class PageWatcher {
  public static started: boolean = false;

  protected static readonly targetUrl = 'https://www.youtube.com/watch';

  private _enabled: boolean = false;

  public currentUrl: string | undefined;

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

  protected callback(
    historyItem: chrome.history.HistoryItem,
  ): void {
    if (historyItem.url?.startsWith(PageWatcher.targetUrl)) {
      console.log(historyItem);
      chrome.tabs.query(
        {active: true, currentWindow: true},
        this.captureTabs,
      );
      // chrome.tabs.getCurrent((tabs) => captureTabs(tabs))
    }
  }

  protected captureTabs(tabs: chrome.tabs.Tab[]) {
    console.log(tabs)
    this.currentUrl = tabs[0]?.url;
  }

  protected addWatchListener() {
    chrome.history.onVisited.addListener(this.callback.bind(this));
    PageWatcher.started = true;
  }

  protected removeWatchListener() {
    chrome.history.onVisited.removeListener(this.callback);
    PageWatcher.started = false;
  }
}
