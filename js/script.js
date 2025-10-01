// Basic interactivity: smooth scroll, mobile nav, URL parser, reveal on scroll
document.addEventListener("DOMContentLoaded", function () {
  // year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", (!expanded).toString());
      nav.classList.toggle("show");
    });
  }

  // smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href");
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // close nav on mobile
        if (nav && nav.classList.contains("show")) {
          nav.classList.remove("show");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  // URL parser
  var parseBtn = document.getElementById("parse-btn");
  var urlInput = document.getElementById("url-input");
  var urlOut = document.getElementById("url-output");
  if (parseBtn && urlInput && urlOut) {
    parseBtn.addEventListener("click", function () {
      var val = urlInput.value.trim();
      if (!val) {
        urlOut.textContent = "Veuillez entrer une URL.";
        return;
      }
      try {
        var u = new URL(val);
        var parts = {
          href: u.href,
          protocol: u.protocol,
          host: u.host,
          hostname: u.hostname,
          port: u.port,
          path: u.pathname,
          query: u.search,
          hash: u.hash,
        };
        urlOut.textContent = JSON.stringify(parts, null, 2);
      } catch (e) {
        urlOut.textContent =
          "URL invalide. Assurez-vous d'inclure le scheme (https://)";
      }
    });
  }

  // reveal on scroll
  var revealEls = document.querySelectorAll(".tl-item, .card, .hero-card");
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) en.target.classList.add("reveal");
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      obs.observe(el);
    });
  } else {
    // fallback: add class immediately
    revealEls.forEach(function (el) {
      el.classList.add("reveal");
    });
  }
  // contact form demo
  var sendBtn = document.getElementById("send-btn");
  if (sendBtn) {
    sendBtn.addEventListener("click", function (e) {
      e.preventDefault();
      var name = document.getElementById("name").value || "Anonyme";
      alert(
        "Merci " + name + " — ce formulaire est une démo (pas d'envoi réel)."
      );
    });
  }
});
