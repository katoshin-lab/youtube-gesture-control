chrome.action.onClicked.addListener(async () => {
  const url = chrome.runtime.getURL('index.html');
  await chrome.tabs.create({ url });
});
