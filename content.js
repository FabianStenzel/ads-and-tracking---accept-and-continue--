(async () => {
  // DOM-Element für das Overlay erstellen
  const overlay = document.createElement("div");
  let Pixelarray = [];
  overlay.id = "cookie-overlay";
  overlay.innerHTML = "<div id='cookies'></div><div id='trackers'></div>";
  document.body.appendChild(overlay);

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

    let cookieTrackingAmount = response.cookies.length + suspicious.length;

    for (let i = 0; i <= cookieTrackingAmount; i++) {
      let pixelelement = document.createElement("div");
      pixelelement.classList.add("deadPixel");
      pixelelement.style.top = `${Math.floor(
        Math.random() * window.innerHeight
      )}px`;
      pixelelement.style.left = `${Math.floor(
        Math.random() * window.innerWidth
      )}px`;
      Pixelarray.push(pixelelement);
    }

    console.log(Pixelarray);
    for (let i = 0; 1 <= Pixelarray.length; i++) {
      document.body.appendChild(Pixelarray[i]);
    }

    // ----
  });
})();
