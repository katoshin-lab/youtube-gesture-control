import PageWatcher from './main/pageWatcher';
import TabPageHander from './main/tabPageHandler';

export default class Base {
  // eslint-disable-next-line no-use-before-define
  public static instance: Base;

  public static openCaptureWindow: boolean = false;

  public static init() {
    if (Base.instance) {
      console.log('already started');
    } else {
      Base.instance = new Base();
    }
  }

  public watcher: PageWatcher;

  public tabPageHandler!: TabPageHander;

  // public enableCaptureGesture!: boolean;

  public isOpenCaptureWindow: boolean = false;

  constructor() {
    this.watcher = new PageWatcher();
    this.setClickLogoListener();
    this.readSettings();
    chrome.storage.onChanged.addListener(this.readSettings.bind(this));
  }

  private readSettings() {
    chrome.storage.sync.get(
      ['captureGestureEnable', 'startupOpen'],
      (result: Partial<Storage>) => {
        // this.enableCaptureGesture = !!result.captureGestureEnable;
        // console.log('enable: ', this.enableCaptureGesture);
        if (result.startupOpen && !this.isOpenCaptureWindow) {
          this.openCaptureWindow();
          this.isOpenCaptureWindow = true;
        }
      },
    );
  }

  private setClickLogoListener() {
    chrome.action.onClicked.addListener(async () => {
      const popup = chrome.runtime.getURL('popup.html');
      await chrome.browserAction.setPopup({ popup });
    });
  }

  private openCaptureWindow() {
    const url = chrome.runtime.getURL('settings.html');
    chrome.tabs.create({ url });
    Base.openCaptureWindow = true;
  }
}

Base.init();
