export default class PageWatcher {
  public static started: boolean = false;

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

  protected callback(historyItem: chrome.history.HistoryItem): void {
    console.log(historyItem);
  }

  protected addWatchListener() {
    chrome.history.onVisited.addListener(this.callback);
    PageWatcher.started = true;
  }

  protected removeWatchListener() {
    chrome.history.onVisited.removeListener(this.callback);
    PageWatcher.started = false;
  }
}
