(function () {
  "use strict";
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    var btn = document.getElementById("pwaInstallBtn");
    if (btn) btn.hidden = false;
  });

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("pwaInstallBtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () {
        deferredPrompt = null;
        btn.hidden = true;
      });
    });
  });

  window.addEventListener("appinstalled", function () {
    var btn = document.getElementById("pwaInstallBtn");
    if (btn) btn.hidden = true;
  });
})();
