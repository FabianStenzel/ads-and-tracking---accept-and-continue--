const rememberedData = {
  cookies: {}, // { domain: { cookieName: faviconUrl } }
  trackers: {}, // { domain: { originUrl: faviconUrl } }
};

// Load from storage on startup
chrome.storage.local.get(["rememberedData"], (res) => {
  if (res.rememberedData) {
    Object.assign(rememberedData.cookies, res.rememberedData.cookies || {});
    Object.assign(rememberedData.trackers, res.rememberedData.trackers || {});
  }
});

// Track requests to detect trackers
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    const tabId = details.tabId;
    chrome.tabs.get(tabId, (tab) => {
      if (!tab || !tab.url) return;
      const pageDomain = new URL(tab.url).hostname;
      const trackerDomain = url.hostname;

      // Skip same-origin requests
      if (pageDomain === trackerDomain) return;

      const favicon = `https://www.google.com/s2/favicons?domain=${trackerDomain}&sz=32`;
      rememberedData.trackers[pageDomain] =
        rememberedData.trackers[pageDomain] || {};
      rememberedData.trackers[pageDomain][trackerDomain] = favicon;

      chrome.storage.local.set({ rememberedData });
    });
  },
  { urls: ["<all_urls>"] },
  []
);

// Handle messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getSiteData") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const domain = new URL(tab.url).hostname;
      const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

      chrome.cookies.getAll({ domain }, (cookies) => {
        const cookieData = {};
        cookies.forEach((cookie) => {
          cookieData[cookie.name] = favicon;
        });

        // Remember cookies
        rememberedData.cookies[domain] = {
          ...rememberedData.cookies[domain],
          ...cookieData,
        };

        chrome.storage.local.set({ rememberedData });

        sendResponse({
          current: {
            cookies: cookieData,
            trackers: rememberedData.trackers[domain] || {},
          },
          remembered: rememberedData,
        });
      });
    });
    return true;
  }
});
