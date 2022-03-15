import TabPageHander from './tabPageHandler';

export default class PageWatcher {
  public static started: boolean = false;

  protected static readonly targetUrl = 'https://www.youtube.com/watch';

  protected static readonly captureTabKey = 'CAPTURE_TAB_KEY';

  public tabPageHandler!: TabPageHander;

  private _enabled: boolean = false;

  constructor(enabled: boolean) {
    this._enabled = enabled;
  }

  public start(): void {
    if (PageWatcher.started) {
      console.log('PageWatcher has already started.');
    } else if (this._enabled) {
      this.addWatchListener();
      this.sampleEvent();
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
    PageWatcher.started = true;
    chrome.history.onVisited.addListener(this.onHistoryChange.bind(this));
  }

  protected removeWatchListener(): void {
    chrome.history.onVisited.removeListener(this.onHistoryChange);
    PageWatcher.started = false;
  }

  protected sampleEvent(): void {
    chrome.commands.onCommand.addListener((command) => {
      if (this.tabPageHandler && command === 'pause_video') {
        this.tabPageHandler.pauseVideo();
      }
    });
  }
}
