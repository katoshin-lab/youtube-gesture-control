export default class CaptureWindowManager {
  public static instance: CaptureWindowManager;

  public static readonly actionKey = 'open';

  public open: boolean = false;

  constructor() {
    this.openWindowBySettings();
    this.setRuntimeCallbackAction();
  }

  private openWindowBySettings() {
    chrome.storage.sync.get(
      ['startupOpen'],
      (result: Partial<Storage>) => {
        if (result.startupOpen) {
          this.openCaptureWindow();
          chrome.storage.sync.set({ openCaptureWindow: true });
        } else {
          chrome.storage.sync.set({ openCaptureWindow: false });
        }
      },
    );
  }

  private openCaptureWindow() {
    if (!this.open) {
      const url = chrome.runtime.getURL('settings.html');
      chrome.tabs.create({ url });
      this.open = true;
    }
  }

  private setRuntimeCallbackAction() {
    chrome.runtime.onMessage.addListener((message: runtimeMessages) => {
      if (message === CaptureWindowManager.actionKey) {
        console.log(CaptureWindowManager.actionKey)
        this.openCaptureWindow();
      }
    });
  }
}

type runtimeMessages = typeof CaptureWindowManager.actionKey;
