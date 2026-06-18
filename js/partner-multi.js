(function () {
  "use strict";

  /** Bobaffs referral — единая партнёрская ссылка для всех CTA */
  var BOBAFFS = "https://bobaffs.org/click?o=1603&a=189";

  var PARTNERS = {
    "pin-up": BOBAFFS,
    "1win": BOBAFFS,
    "olymp": BOBAFFS,
    "mostbet": BOBAFFS,
    "1xbet": BOBAFFS,
    "parimatch": BOBAFFS,
    "melbet": BOBAFFS,
    "betwinner": BOBAFFS,
    "leon": BOBAFFS,
    "vavada": BOBAFFS
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
    var url = PARTNERS[id] || BOBAFFS;
    openPartnerLink(url);
  }

  document.addEventListener("click", onPartnerClick, true);
})();
