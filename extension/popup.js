document.addEventListener("DOMContentLoaded", () => {
  const showAllSites = document.getElementById("showAllSites");
  const showCookies = document.getElementById("showCookies");
  const showTrackers = document.getElementById("showTrackers");
  const imageSize = document.getElementById("imageSize");

  // Load saved settings
  chrome.storage.local.get(
    {
      showAllSites: false,
      showCookies: true,
      showTrackers: true,
      imageSize: 32,
    },
    (data) => {
      showAllSites.checked = data.showAllSites;
      showCookies.checked = data.showCookies;
      showTrackers.checked = data.showTrackers;
      imageSize.value = data.imageSize;

      var x = imageSize.value;
      var color = `linear-gradient(90deg, lightgray ${x}%, white ${x}%)`;
      imageSize.style.background = color;
    }
  );

  imageSize.addEventListener("mousemove", function () {
    var x = imageSize.value;
    var color = `linear-gradient(90deg, lightgray ${x}%, white ${x}%)`;
    imageSize.style.background = color;
  });
  imageSize.addEventListener("click", function () {
    var x = imageSize.value;
    var color = `linear-gradient(90deg, lightgray ${x}%, white ${x}%)`;
    imageSize.style.background = color;
  });

  // Save settings when saveBtn is clicked
  showAllSites.addEventListener("change", () => {
    const settings = {
      showAllSites: showAllSites.checked,
      showCookies: showCookies.checked,
      showTrackers: showTrackers.checked,
      imageSize: parseInt(imageSize.value, 10),
    };

    chrome.storage.local.set(settings, () => {
      // Refresh content display
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "refreshDisplay" });
        }
      });
    });
  });
  showCookies.addEventListener("change", () => {
    const settings = {
      showAllSites: showAllSites.checked,
      showCookies: showCookies.checked,
      showTrackers: showTrackers.checked,
      imageSize: parseInt(imageSize.value, 10),
    };

    chrome.storage.local.set(settings, () => {
      // Refresh content display
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "refreshDisplay" });
        }
      });
    });
  });
  showTrackers.addEventListener("change", () => {
    const settings = {
      showAllSites: showAllSites.checked,
      showCookies: showCookies.checked,
      showTrackers: showTrackers.checked,
      imageSize: parseInt(imageSize.value, 10),
    };

    chrome.storage.local.set(settings, () => {
      // Refresh content display
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "refreshDisplay" });
        }
      });
    });
  });
  imageSize.addEventListener("change", () => {
    const settings = {
      showAllSites: showAllSites.checked,
      showCookies: showCookies.checked,
      showTrackers: showTrackers.checked,
      imageSize: parseInt(imageSize.value, 10),
    };

    chrome.storage.local.set(settings, () => {
      // Refresh content display
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "refreshDisplay" });
        }
      });
    });
  });
});
