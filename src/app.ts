chrome.runtime.onInstalled.addListener(async () => {
  const url = chrome.runtime.getURL('/public/test.html');
  await chrome.tabs.create({ url });
});
