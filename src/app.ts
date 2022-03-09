chrome.action.onClicked.addListener(async () => {
  const url = chrome.runtime.getURL('test.html');
  await chrome.tabs.create({ url });
});
