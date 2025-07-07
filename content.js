(async () => {
  // DOM-Element für das Overlay erstellen
  const overlay = document.createElement("div");
  overlay.id = "cookie-overlay";
  overlay.innerHTML = "<div id='cookies'></div><div id='trackers'></div>";
  document.body.appendChild(overlay);

  const button = document.createElement("button");
  button.id = "saveButton";
  button.innerHTML = "Cookies and Tracking";
  document.body.appendChild(button);

  // Anfrage an background.js senden
  chrome.runtime.sendMessage({ action: "getFavicon" });

  let faviconURLGlobal = null;
  // Antwort empfangen
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "favicon") {
      const img = document.createElement("img");
      faviconURLGlobal = message.faviconUrl;
      img.src = message.faviconUrl;
      img.style.position = "fixed";
      img.style.top = "10px";
      img.style.left = "10px";
      img.style.zIndex = "9999";
      img.style.width = "32px";
      img.style.height = "32px";
      document.body.appendChild(img);
    }
  });

  // Cookie-Daten holen
  chrome.runtime.sendMessage({ action: "getData" }, (response) => {
    const c = document.getElementById("cookies");
    const t = document.getElementById("trackers");

    if (!response) return;

    c.innerHTML =
      "<strong>Cookies:</strong><br>" +
      response.cookies
        .map(
          (cookie) =>
            `<div>${cookie.name} – <span style="opacity:0.7">${cookie.domain}</span></div>`
        )
        .join("");

    const suspicious = response.requests.filter((url) =>
      url.match(/(ad|track|doubleclick|analytics|facebook|pixel)/)
    );

    t.innerHTML =
      "<strong>Tracker:</strong><br>" +
      suspicious.map((url) => `<div>${url}</div>`).join("");

    // ----
    // console.log(suspicious);

    // let cookieTrackingAmount = response.cookies.length + suspicious.length;

    // for (let i = 0; i < cookieTrackingAmount; i++) {
    //   let pixelelement = document.createElement("div");
    //   pixelelement.classList.add("deadPixel");
    //   pixelelement.style.top = `${Math.floor(
    //     Math.random() * window.innerHeight
    //   )}px`;
    //   pixelelement.style.left = `${Math.floor(
    //     Math.random() * window.innerWidth
    //   )}px`;
    //   document.body.appendChild(pixelelement);

    //   Pixelarray.push(pixelelement);
    // }
    // console.log(Pixelarray);

    // ----

    // ----
    // console.log(suspicious);
    let cookiesAmount = response.cookies.length;
    let trackingAmount = suspicious.length;
    let Pixelarray = [];

    for (let i = 0; i < cookiesAmount; i++) {
      // let cookiePixelElement = document.createElement("div");
      let cookiePixelElement = document.createElement("img");
      cookiePixelElement.src = faviconURLGlobal;
      cookiePixelElement.classList.add("deadPixel");
      cookiePixelElement.classList.add("cookiePixel");
      cookiePixelElement.style.top = `${Math.floor(
        Math.random() * window.innerHeight
      )}px`;
      cookiePixelElement.style.left = `${Math.floor(
        Math.random() * window.innerWidth
      )}px`;
      // Pixelarray.push(cookiePixelElement);
      document.body.appendChild(cookiePixelElement);
    }
    for (let i = 0; i < trackingAmount; i++) {
      let pixelelement = document.createElement("div");
      pixelelement.classList.add("deadPixel");
      pixelelement.classList.add("trackingPixel");
      pixelelement.style.top = `${Math.floor(
        Math.random() * window.innerHeight
      )}px`;
      pixelelement.style.left = `${Math.floor(
        Math.random() * window.innerWidth
      )}px`;
      // Pixelarray.push(pixelelement);
      document.body.appendChild(pixelelement);
    }

    // console.log(Pixelarray);
    // for (let i = 0; i < Pixelarray.length; i++) {
    //   document.body.appendChild(Pixelarray[i]);
    // }

    button.onclick = function () {
      switch (button.innerHTML) {
        case "Cookies and Tracking":
          button.innerHTML = "Cookies";
          let deadPixelsC = document.getElementsByClassName("trackingPixel");
          for (let i = 0; i < deadPixelsC.length; i++) {
            deadPixelsC[i].style.display = "none";
          }
          break;

        case "Cookies":
          button.innerHTML = "Tracking";
          let deadPixelsCP = document.getElementsByClassName("cookiePixel");
          for (let i = 0; i < deadPixelsCP.length; i++) {
            deadPixelsCP[i].style.display = "none";
          }
          let deadPixelsTP = document.getElementsByClassName("trackingPixel");
          for (let i = 0; i < deadPixelsTP.length; i++) {
            deadPixelsTP[i].style.display = "block";
          }
          break;

        case "Tracking":
          button.innerHTML = "Cookies and Tracking";
          let deadPixels = document.getElementsByClassName("deadPixel");
          for (let i = 0; i < deadPixels.length; i++) {
            deadPixels[i].style.display = "block";
          }
          break;
      }

      // if (buttonState == false) {
      //   const deadPixels = document.getElementsByClassName("deadPixel");
      //   for (let i = 0; i < deadPixels.length; i++) {
      //     deadPixels[i].style.display = "none";
      //   }
      //   buttonState = true;
      // } else {
      //   buttonState = false;
      //   const deadPixels = document.getElementsByClassName("deadPixel");
      //   for (let i = 0; i < deadPixels.length; i++) {
      //     deadPixels[i].style.display = "block";
      //   }
      // }
    };

    // ----
  });
})();
