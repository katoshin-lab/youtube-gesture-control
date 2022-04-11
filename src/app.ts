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

  public captureWindow!: CaptureWindowManager;

  constructor() {
    this.watcher = new PageWatcher();
    this.captureWindow = new CaptureWindowManager();
    this.setClickLogoListener();
  }

  private setClickLogoListener() {
    chrome.action.onClicked.addListener(async () => {
      const popup = chrome.runtime.getURL('popup.html');
      await chrome.browserAction.setPopup({ popup });
    });
  }
}

Base.init();
