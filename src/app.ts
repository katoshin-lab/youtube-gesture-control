import PageWatcher from './main/pageWatcher';
import TabPageHander from './main/tabPageHandler';

export default class Base {
  // eslint-disable-next-line no-use-before-define
  public static instance: Base;

  public static init() {
    if (Base.instance) {
      console.log('already started');
    } else {
      Base.instance = new Base();
    }
  }

  public watcher: PageWatcher;

  public tabPageHandler!: TabPageHander;

  public enableCaptureGesture!: boolean;

  constructor() {
    this.watcher = new PageWatcher();
    this.setClickLogoListener();
    this.readSettings();
    chrome.storage.onChanged.addListener(this.readSettings.bind(this));
  }

  private readSettings() {
    chrome.storage.sync.get(
      ['captureGestureEnable'],
      (result: Partial<Storage>) => {
        this.enableCaptureGesture = !!result.captureGestureEnable;
        console.log('enable: ', this.enableCaptureGesture);
      },
    );
  }

  private setClickLogoListener() {
    chrome.action.onClicked.addListener(async () => {
      const popup = chrome.runtime.getURL('popup.html');
      await chrome.browserAction.setPopup({ popup });
    });
  }
}

Base.init();
