(function () {
  "use strict";

  var PARTNER_URL = (function () {
    try {
      return atob("aHR0cHM6Ly9mYWlycGFmZi50b3AvTD90YWc9ZF81MzM5MzU4bV83MjQ2NWNf");
    } catch (err) {
      return "";
    }
  })();

  var lastOpenAt = 0;

  function resolvePartnerButton(target) {
    if (!target || !target.closest) return null;
    return target.closest(".js-go-partner");
  }

  function openPartnerLink() {
    if (!PARTNER_URL) return;
    var now = Date.now();
    if (now - lastOpenAt < 400) return;
    lastOpenAt = now;
    window.open(PARTNER_URL, "_blank", "noopener,noreferrer");
  }

  function onPartnerClick(event) {
    var btn = resolvePartnerButton(event.target);
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }
    openPartnerLink();
  }

  document.addEventListener("click", onPartnerClick, true);
})();
