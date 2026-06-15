(function () {
  "use strict";

  var PARTNERS = {
    "pin-up": "#",
    "1win": "#",
    "olymp": "#",
    "mostbet": "#",
    "1xbet": "#",
    "parimatch": "#",
    "melbet": "#",
    "betwinner": "#",
    "leon": "#",
    "vavada": "#"
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
    var id = btn.getAttribute("data-partner-id") || "pin-up";
    var url = PARTNERS[id] || PARTNERS["pin-up"];
    openPartnerLink(url);
  }

  document.addEventListener("click", onPartnerClick, true);

  var sticky = document.getElementById("sticky-cta");
  if (sticky) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        sticky.classList.remove("is-hidden");
      } else {
        sticky.classList.add("is-hidden");
      }
    }, { passive: true });
  }

  var stickyBonus = document.getElementById("sticky-bonus");
  var stickyBonusClose = document.getElementById("sticky-bonus-close");
  if (stickyBonus && stickyBonusClose) {
    function syncStickyBonusState() {
      if (stickyBonus.classList.contains("is-dismissed")) {
        document.body.classList.remove("has-sticky-bonus");
        return;
      }
      var visible = stickyBonus.classList.contains("is-visible");
      document.body.classList.toggle("has-sticky-bonus", visible);
    }

    stickyBonusClose.addEventListener("click", function () {
      stickyBonus.classList.add("is-dismissed");
      document.body.classList.remove("has-sticky-bonus");
      try { sessionStorage.setItem("sticky-bonus-dismissed", "1"); } catch (e) {}
    });
    try {
      if (sessionStorage.getItem("sticky-bonus-dismissed") === "1") {
        stickyBonus.classList.add("is-dismissed");
      }
    } catch (e) {}
    window.addEventListener("scroll", function () {
      if (stickyBonus.classList.contains("is-dismissed")) return;
      if (window.scrollY > 320) {
        stickyBonus.classList.add("is-visible");
      } else {
        stickyBonus.classList.remove("is-visible");
      }
      syncStickyBonusState();
    }, { passive: true });
    syncStickyBonusState();
  }
})();
