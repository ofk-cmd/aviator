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
})();
