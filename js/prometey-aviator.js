(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("nav-mobile");

  function closeMobileNav() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-open", !open);
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMobileNav();
    });

    document.addEventListener("click", function (event) {
      if (!mobileNav.classList.contains("is-open")) return;
      if (mobileNav.contains(event.target) || toggle.contains(event.target)) return;
      closeMobileNav();
    });
  }

  var sticky = document.getElementById("aviator-sticky");
  if (sticky) {
    var storageKey = "aviator_sticky_dismissed";
    var dismissed = false;

    try {
      dismissed = sessionStorage.getItem(storageKey) === "1";
    } catch (e) {}

    function setStickyVisible(show) {
      sticky.hidden = !show;
      sticky.classList.toggle("is-visible", show);
      document.body.classList.toggle("has-aviator-sticky", show);
    }

    if (dismissed) {
      setStickyVisible(false);
    } else {
      function syncSticky() {
        setStickyVisible(window.scrollY > 360);
      }

      syncSticky();
      window.addEventListener("scroll", syncSticky, { passive: true });

      var dismissBtn = sticky.querySelector(".aviator-sticky__dismiss");
      if (dismissBtn) {
        dismissBtn.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          dismissed = true;
          setStickyVisible(false);
          try {
            sessionStorage.setItem(storageKey, "1");
          } catch (err) {}
        });
      }
    }
  }
})();
