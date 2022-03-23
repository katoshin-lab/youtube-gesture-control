export default class CaptureWindowManager {
  // eslint-disable-next-line no-use-before-define
  public static instance: CaptureWindowManager;

  public static readonly openCaptureWindowKey = 'openCaptureWindow';

  public static readonly closeCaptureWindowKey = 'closeCaptureWinodw';

  public tab: chrome.tabs.Tab | null = null;

  constructor() {
    this.openWindowBySettings();
    this.setRuntimeCallbackAction();
    this.setRemoveCaptureWindowEvent();
  }

  private openCaptureWindow(): void {
    this.setOpenStorageStatus(true);
    if (!this.tab) {
      const url = chrome.runtime.getURL('settings.html');
      chrome.tabs.create(
        { url },
        (tab: chrome.tabs.Tab) => { this.tab = tab; },
      );
    }
  }

  private openWindowBySettings(): void {
    chrome.storage.sync.get(
      ['startupOpen'],
      (result: Partial<Storage>) => {
        if (result.startupOpen) {
          this.openCaptureWindow();
        } else {
          this.setOpenStorageStatus(false);
        }
      },
    );
  }

  private closeCaptureWindow(): void {
    this.setOpenStorageStatus(false);
    if (this.tab && this.tab.id) {
      chrome.tabs.remove(this.tab.id);
      this.tab = null;
    }
  }

  private setRuntimeCallbackAction(): void {
    // eslint-disable-next-line no-use-before-define
    chrome.runtime.onMessage.addListener((message: runtimeMessages, _, sendResponse) => {
      if (message === CaptureWindowManager.openCaptureWindowKey) {
        this.openCaptureWindow();
      } else if (message === CaptureWindowManager.closeCaptureWindowKey) {
        this.closeCaptureWindow();
      }
      sendResponse();
    });
  }

  private setRemoveCaptureWindowEvent(): void {
    chrome.tabs.onRemoved.addListener((tabId: number) => {
      if (tabId === this.tab?.id) {
        this.setOpenStorageStatus(false);
        this.tab = null;
      }
    });
  }

  private setOpenStorageStatus(bool: boolean): void {
    chrome.storage.sync.set({ openCaptureWindow: bool });
  }
}

type runtimeMessages = typeof CaptureWindowManager.openCaptureWindowKey
                       | typeof CaptureWindowManager.closeCaptureWindowKey;
