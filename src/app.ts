import PageWatcher from './main/pageWatcher';
import TabPageHander from './main/tabPageHandler';
import CaptureWindowManager from './main/captureWindowManager';

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

  // public enableCaptureGesture!: boolean;

  public captureWindow!: CaptureWindowManager;

  constructor() {
    this.watcher = new PageWatcher();
    this.captureWindow = new CaptureWindowManager();
    this.setClickLogoListener();
    // this.readSettings();
    // chrome.storage.onChanged.addListener(this.readSettings.bind(this));
  }

  // private readSettings() {
  //   chrome.storage.sync.get(
  //     ['captureGestureEnable', 'startupOpen'],
  //     (_: Partial<Storage>) => {
  //       this.enableCaptureGesture = !!result.captureGestureEnable;
  //       console.log('enable: ', this.enableCaptureGesture);
  //       if (result.startupOpen && !this.captureWindow) {
  //       }
  //     },
  //   );
  // }

  private setClickLogoListener() {
    chrome.action.onClicked.addListener(async () => {
      const popup = chrome.runtime.getURL('popup.html');
      await chrome.browserAction.setPopup({ popup });
    });
  }
}

Base.init();
