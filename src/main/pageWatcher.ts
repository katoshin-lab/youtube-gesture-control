import TabPageHander from './tabPageHandler';
import Storage from '../types/storage';

export default class PageWatcher {
  public static started: boolean = false;

  protected static readonly targetUrl = 'https://www.youtube.com/watch';

  protected static readonly captureTabKey = 'CAPTURE_TAB_KEY';

  public tabPageHandler!: TabPageHander;

  private _enabled: boolean = false;

  constructor() {
    chrome.storage.sync.get(
      ['pageWatcherEnable'],
      (result: Partial<Storage>) => {
        this.enabled = !!result.pageWatcherEnable;
      },
    );
    chrome.storage.onChanged.addListener(this.onStorageChange.bind(this));
  }

  // handle on/off this pageWatcher through this setter.
  set enabled(enabled: boolean) {
    this._enabled = enabled;
    if (enabled && !PageWatcher.started) {
      this.addWatchListener();
      this.sampleEvent();
      console.log('PageWatcher is enabled.');
    } else if (enabled && PageWatcher.started) {
      console.log('PageWatcher has already enabled.');
    } else if (!enabled && PageWatcher.started) {
      this.removeWatchListener();
      console.log('PageWatcher is disabled.');
    } else {
      console.log('PageWatcher has already disabled.')
    }
  }

  get enabled(): boolean {
    return this._enabled;
  }

  // callbacks

  protected onHistoryChange(
    historyItem: chrome.history.HistoryItem,
  ): void {
    console.log(historyItem)
    if (historyItem.url?.startsWith(PageWatcher.targetUrl)) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        this.captureTabs.bind(this),
      );
    }
  }

  protected onStorageChange(
    obj: {},
    areaName: string,
  ): void {
    console.log('onStorageChange: ', obj, areaName)
    chrome.storage.sync.get(
      ['pageWatcherEnable'],
      (result: Partial<Storage>) => {
        this.enabled = !!result.pageWatcherEnable;
      },
    );
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
    chrome.history.onVisited.removeListener(this.onHistoryChange.bind(this));
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
