/* ==========================================================================
   Sebastian David Schiller-Stoff — site behaviour
   Vanilla JavaScript. No dependencies, no build step.
   Every module is isolated and guarded so a missing element cannot break the
   rest of the page.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Progressive enhancement flag: interactive controls are hidden by default
     and only revealed once this stylesheet's owner is actually running. */
  root.classList.add("js-ready");

  /* ------------------------------------------------------------------
     1. Footer year
     ------------------------------------------------------------------ */
  function initYear() {
    var target = document.querySelector("[data-year]");
    if (target) target.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------
     2. Header state on scroll (rAF-throttled)
     ------------------------------------------------------------------ */
  function initHeader() {
    var header = document.querySelector("[data-header]");
    if (!header) return;

    var ticking = false;

    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    }

    function request() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", request, { passive: true });
  }

  /* ------------------------------------------------------------------
     3. Mobile navigation drawer
     ------------------------------------------------------------------ */
  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-nav-menu]");
    if (!toggle || !menu) return;

    root.classList.add("nav-ready");

    var desktop = window.matchMedia("(min-width: 901px)");
    var lastFocus = null;

    function isOpen() {
      return root.classList.contains("nav-open");
    }

    function focusable() {
      var items = Array.prototype.slice.call(
        menu.querySelectorAll("a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex='-1'])")
      );
      /* The toggle doubles as the close button, so keep it in the loop. */
      items.unshift(toggle);
      return items.filter(function (el) {
        return el.offsetWidth > 0 || el.offsetHeight > 0;
      });
    }

    function open() {
      if (isOpen()) return;
      lastFocus = document.activeElement;
      root.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      var items = focusable();
      if (items.length > 1) items[1].focus();
      else if (items.length) items[0].focus();
    }

    function close(returnFocus) {
      if (!isOpen()) return;
      root.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus && lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
    }

    toggle.addEventListener("click", function () {
      if (isOpen()) close(true);
      else open();
    });

    document.addEventListener("keydown", function (event) {
      if (!isOpen()) return;

      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }

      if (event.key !== "Tab") return;

      var items = focusable();
      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    /* A click on a link closes the drawer and lets the anchor do its job. */
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) close(true);
    });

    function reset() {
      if (desktop.matches) close(true);
    }

    if (typeof desktop.addEventListener === "function") {
      desktop.addEventListener("change", reset);
    } else if (typeof desktop.addListener === "function") {
      desktop.addListener(reset);
    }
  }

  /* ------------------------------------------------------------------
     4. Scrollspy — keeps aria-current in sync with the visible section
     ------------------------------------------------------------------ */
  function initScrollspy() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.nav__links a[href^="#"]')
    );
    if (!links.length) return;

    var sections = links
      .map(function (link) {
        var id = link.getAttribute("href").slice(1);
        var section = id ? document.getElementById(id) : null;
        return section ? { link: link, section: section } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    function setActive(activeLink) {
      links.forEach(function (link) {
        if (link === activeLink) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        } else {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        }
      });
    }

    if ("IntersectionObserver" in window) {
      var visible = new Set();

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) visible.add(entry.target);
            else visible.delete(entry.target);
          });

          var current = null;
          sections.forEach(function (item) {
            if (visible.has(item.section) && !current) current = item;
          });

          if (current) setActive(current.link);
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
      );

      sections.forEach(function (item) {
        observer.observe(item.section);
      });
      return;
    }

    /* Fallback for browsers without IntersectionObserver. */
    var ticking = false;

    function update() {
      var offset = window.scrollY + window.innerHeight * 0.3;
      var current = null;
      sections.forEach(function (item) {
        if (item.section.offsetTop <= offset) current = item;
      });
      setActive(current ? current.link : null);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );
    update();
  }

  /* ------------------------------------------------------------------
     5. Portfolio filters and "load more"
     ------------------------------------------------------------------ */
  function initPortfolio() {
    var grid = document.querySelector("[data-work-grid]");
    var filters = document.querySelector("[data-filters]");
    var more = document.querySelector("[data-load-more]");
    var moreLabel = document.querySelector("[data-load-label]");
    var count = document.querySelector("[data-filter-count]");
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".work-card"));
    var buttons = filters
      ? Array.prototype.slice.call(filters.querySelectorAll("[data-filter]"))
      : [];
    if (!cards.length) return;

    var pageSize = 9;
    var filter = "all";
    var shown = pageSize;

    function matches(card) {
      if (filter === "all") return true;
      var categories = (card.getAttribute("data-categories") || "").split(/\s+/);
      return categories.indexOf(filter) !== -1;
    }

    function apply() {
      var total = 0;
      var visible = 0;

      cards.forEach(function (card) {
        if (matches(card)) {
          total += 1;
          if (visible < shown) {
            card.hidden = false;
            visible += 1;
          } else {
            card.hidden = true;
          }
        } else {
          card.hidden = true;
        }
      });

      if (count) {
        count.textContent =
          "Showing " + visible + " of " + total + (total === 1 ? " project" : " projects");
      }

      if (more) {
        more.hidden = visible >= total;

        if (moreLabel) {
          var remaining = Math.min(pageSize, total - visible);
          moreLabel.textContent =
            "Load " + remaining + (remaining === 1 ? " more project" : " more projects");
        }
      }
    }

    function setFilter(next) {
      filter = next;
      shown = pageSize;

      buttons.forEach(function (button) {
        button.setAttribute(
          "aria-pressed",
          button.getAttribute("data-filter") === filter ? "true" : "false"
        );
      });

      apply();
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        setFilter(button.getAttribute("data-filter") || "all");
      });
    });

    if (more) {
      more.addEventListener("click", function () {
        shown += pageSize;
        apply();
      });
    }

    setFilter("all");
  }

  /* ------------------------------------------------------------------
     6. Fail-safe reveal
     Default is visible. Content is hidden only after the observer has been
     attached, so a missing or broken site.js can never hide the page.
     ------------------------------------------------------------------ */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;

    function showAll() {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      root.classList.remove("reveal-ready");
    }

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    root.classList.add("reveal-ready");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });

    if (typeof reduceMotion.addEventListener === "function") {
      reduceMotion.addEventListener("change", function (event) {
        if (event.matches) {
          observer.disconnect();
          showAll();
        }
      });
    }
  }

  /* ------------------------------------------------------------------
     7. Contact form — Formspree via fetch, native POST as fallback
     ------------------------------------------------------------------ */
  function initForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var status = form.querySelector("[data-form-status]");
    var submit = form.querySelector("[data-submit]");
    var note = document.getElementById("form-note");

    function setStatus(message, state) {
      if (!status) return;
      status.textContent = message;
      if (state) status.setAttribute("data-state", state);
      else status.removeAttribute("data-state");
    }

    function markInvalid(event) {
      var field = event.target;
      if (field && "setAttribute" in field) field.setAttribute("aria-invalid", "true");
    }

    form.addEventListener("invalid", markInvalid, true);

    form.addEventListener("input", function (event) {
      var field = event.target;
      if (field && field.getAttribute && field.getAttribute("aria-invalid") === "true" && field.checkValidity()) {
        field.setAttribute("aria-invalid", "false");
      }
    });

    if (note && !form.getAttribute("aria-describedby")) {
      form.setAttribute("aria-describedby", "form-note");
    }

    /* No fetch: let the browser perform the normal Formspree POST. */
    if (typeof window.fetch !== "function") return;

    form.addEventListener("submit", function (event) {
      /* Honeypot: pretend success, send nothing. */
      var honey = form.querySelector('[name="_gotcha"]');
      if (honey && honey.value) {
        event.preventDefault();
        setStatus("Thank you — your message has been sent.", "success");
        form.reset();
        return;
      }

      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
        setStatus("Please check the highlighted fields.", "error");
        return;
      }

      event.preventDefault();

      if (submit) submit.disabled = true;
      setStatus("Sending…");

      var data = new FormData(form);
      data.append("_subject", "Website enquiry");

      window
        .fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" }
        })
        .then(function (response) {
          if (!response.ok) throw new Error("Formspree responded " + response.status);
          form.reset();
          setStatus("Thank you — your message has been sent. I will reply within a few working days.", "success");
        })
        .catch(function () {
          setStatus(
            "Sorry, the message could not be sent. Please email sebi.stoff@gmail.com directly.",
            "error"
          );
        })
        .then(function () {
          if (submit) submit.disabled = false;
        });
    });
  }

  function safe(fn) {
    try {
      fn();
    } catch (error) {
      /* A single failed module must never take the page down. */
      if (window.console && typeof window.console.error === "function") {
        window.console.error("[site.js]", error);
      }
    }
  }

  safe(initYear);
  safe(initHeader);
  safe(initNav);
  safe(initScrollspy);
  safe(initPortfolio);
  safe(initReveal);
  safe(initForm);
})();
