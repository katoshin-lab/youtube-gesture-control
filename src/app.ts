import PageWatcher from './main/pageWatcher';

export default class Base {
  // eslint-disable-next-line no-use-before-define
  public static instance: Base;

  public watcher: PageWatcher;

  public static init() {
    if (Base.instance) {
      console.log('already started');
    } else {
      Base.instance = new Base();
      chrome.action.onClicked.addListener(async () => {
        const popup = chrome.runtime.getURL('popup.html');
        await chrome.browserAction.setPopup({ popup });
      });
    }
  }

  constructor() {
    this.watcher = new PageWatcher(true);
    this.watcher.start();
    console.log('started');
  }
}

Base.init();
