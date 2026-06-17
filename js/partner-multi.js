(function () {
  "use strict";

  var REF_URL = "https://bobaffs.org/click?o=1603&a=189";

  var PARTNERS = {
    "pin-up": REF_URL,
    "1win": REF_URL,
    "olymp": REF_URL,
    "mostbet": REF_URL,
    "1xbet": REF_URL,
    "parimatch": REF_URL,
    "melbet": REF_URL,
    "betwinner": REF_URL,
    "leon": REF_URL,
    "vavada": REF_URL
  };

  var lastOpenAt = 0;

  function resolvePartnerButton(target) {
    if (!target || !target.closest) return null;
    return target.closest(".js-go-partner");
  }

  function openPartnerLink(url) {
    if (!url || url === "#") return;
    var now = Date.now();
    if (now - lastOpenAt < 400) return;
    lastOpenAt = now;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function onPartnerClick(event) {
    var btn = resolvePartnerButton(event.target);
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    var id = btn.getAttribute("data-partner-id") || "1win";
    var url = PARTNERS[id] || PARTNERS["1win"];
    openPartnerLink(url);
  }

  document.addEventListener("click", onPartnerClick, true);
})();
