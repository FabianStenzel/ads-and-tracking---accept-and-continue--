let requests = [];

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    requests.push(details.url);
  },
  { urls: ["<all_urls>"] },
  []
);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getData") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.cookies.getAll({ url: tab.url }, (cookies) => {
        sendResponse({ cookies, requests });
      });
    });
    return true;
  }

  if (msg.action === "getFavicon") {
    chrome.tabs.get(sender.tab.id, (tab) => {
      const faviconUrl = `chrome-extension://${
        chrome.runtime.id
      }/_favicon/?pageUrl=${encodeURIComponent(tab.url)}&size=32`;
      chrome.tabs.sendMessage(sender.tab.id, { action: "favicon", faviconUrl });
    });
  }
});
