// Clean up any previous injected container
function clearContainer() {
  const old = document.getElementById("cookie-favicon-container");
  if (old) old.remove();
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "refreshDisplay") {
    updateDisplay();
  }
});

function renderFavicons(data, size) {
  clearContainer();
  const container = document.createElement("div");
  container.id = "cookie-favicon-container";
  container.style.position = "fixed";
  container.style.top = "0px";
  container.style.left = "0px";
  container.style.zIndex = 9999;
  container.style.width = "100dvw";
  container.style.height = "100dvh";
  container.style.pointerEvents = "none";
  // container.style.background = "rgba(255,255,255,0.95)";
  // container.style.padding = "5px";
  // container.style.borderRadius = "8px";
  // container.style.display = "flex";
  // container.style.flexWrap = "wrap";
  // container.style.gap = "6px";
  // container.style.maxWidth = "340px";
  // container.style.maxHeight = "160px";
  // container.style.overflowY = "auto";
  // container.style.boxShadow = "0 0 6px rgba(0,0,0,0.3)";

  for (const [name, faviconUrl] of Object.entries(data)) {
    const img = document.createElement("img");
    img.src = faviconUrl;
    img.title = name;
    img.style.position = "fixed";
    img.style.pointerEvents = "auto";
    img.style.width = img.style.height = size + "px";
    img.style.top = `${Math.floor(Math.random() * window.innerHeight)}px`;
    img.style.left = `${Math.floor(Math.random() * window.innerWidth)}px`;
    img.style.objectFit = "contain";
    // img.style.border = "1px solid #ccc";
    // img.style.borderRadius = "4px";
    container.appendChild(img);
  }

  document.body.appendChild(container);
}

function mergeData(obj) {
  const result = {};
  for (const domainData of Object.values(obj)) {
    Object.assign(result, domainData);
  }
  return result;
}

function updateDisplay() {
  const domain = location.hostname;

  chrome.storage.local.get(
    [
      "showAllSites",
      "showCookies",
      "showTrackers",
      "imageSize",
      "rememberedData",
    ],
    (settings) => {
      const {
        showAllSites = false,
        showCookies = true,
        showTrackers = true,
        imageSize = 32,
        rememberedData = {},
      } = settings;

      chrome.runtime.sendMessage({ action: "getSiteData" }, (data) => {
        if (!data) return;

        let cookies = {};
        let trackers = {};

        if (showAllSites) {
          if (showCookies) cookies = mergeData(rememberedData.cookies || {});
          if (showTrackers) trackers = mergeData(rememberedData.trackers || {});
        } else {
          if (showCookies) cookies = data.current.cookies || {};
          if (showTrackers) trackers = data.current.trackers || {};
        }

        const combined = { ...cookies, ...trackers };
        renderFavicons(combined, imageSize);
      });
    }
  );
}

// Initial render
updateDisplay();

// React to SPA-style changes
window.addEventListener("popstate", updateDisplay);
window.addEventListener("hashchange", updateDisplay);

// React to storage or popup toggle changes
chrome.storage.onChanged.addListener(updateDisplay);
