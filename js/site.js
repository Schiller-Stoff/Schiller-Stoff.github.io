/* ==========================================================================
   Sebastian David Schiller-Stoff — site behaviour
   Vanilla JavaScript. No dependencies, no build step.
   Every module is isolated and guarded so a missing element cannot break the
   rest of the page. Content and navigation remain usable without this file.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;

  /* Progressive enhancement flag: interactive controls are hidden by default
     and only revealed once this script is actually running. */
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
     3. Mobile navigation — non-modal disclosure
     The page stays scrollable and available to assistive technology; the
     disclosure only reveals the navigation panel below the header.
     ------------------------------------------------------------------ */
  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-nav-menu]");
    if (!toggle || !menu) return;

    root.classList.add("nav-ready");

    var desktop = window.matchMedia("(min-width: 901px)");

    function isOpen() {
      return root.classList.contains("nav-open");
    }

    function open() {
      if (isOpen()) return;
      root.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    function close(returnFocus) {
      if (!isOpen()) return;
      root.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      if (isOpen()) close(true);
      else open();
    });

    /* Light-dismiss: a click anywhere outside the disclosure closes it. */
    document.addEventListener("click", function (event) {
      if (!isOpen()) return;
      if (menu.contains(event.target) || toggle.contains(event.target)) return;
      close(false);
    });

    document.addEventListener("keydown", function (event) {
      if (!isOpen()) return;

      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    });

    /* A click on a link closes the disclosure and lets the anchor work.
       Focus is moved to the target section so keyboard users do not lose
       their place when the focused link disappears with the menu. */
    menu.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (!link) return;

      var modified =
        event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      var href = link.getAttribute("href") || "";
      var id = href.charAt(0) === "#" ? href.slice(1) : "";

      close(false);
      if (modified || !id) return;

      var target = document.getElementById(id);
      if (!target) return;

      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      try {
        target.focus({ preventScroll: true });
      } catch (error) {
        target.focus();
      }
    });

    function reset() {
      if (desktop.matches) close(false);
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
          link.setAttribute("aria-current", "location");
        } else {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        }
      });
    }

    var ticking = false;

    function update() {
      var marker = window.innerHeight * 0.35;
      var current = null;

      sections.forEach(function (item) {
        if (item.section.getBoundingClientRect().top <= marker) current = item;
      });

      setActive(current ? current.link : null);
      ticking = false;
    }

    function request() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
     5. Project register filters and "load more"
     ------------------------------------------------------------------ */
  function initPortfolio() {
    var grid = document.querySelector("[data-work-grid]");
    var filters = document.querySelector("[data-filters]");
    var more = document.querySelector("[data-load-more]");
    var moreWrap = more ? more.closest(".work-more") : null;
    var moreLabel = document.querySelector("[data-load-label]");
    var count = document.querySelector("[data-filter-count]");
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-project-item]"));
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
      var visibleCards = [];
      /* The button disappears when the last batch is revealed; remember whether
         it held focus so focus can move somewhere sensible instead of being lost. */
      var moreHadFocus = document.activeElement === more;

      cards.forEach(function (card) {
        if (matches(card)) {
          total += 1;
          if (visible < shown) {
            card.hidden = false;
            visible += 1;
            visibleCards.push(card);
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
        var done = visible >= total;
        if (moreWrap) moreWrap.hidden = done;

        if (done && moreHadFocus) {
          var last = visibleCards[visibleCards.length - 1];
          var link = last ? last.querySelector("a") : null;

          if (link) {
            try {
              link.focus({ preventScroll: true });
            } catch (error) {
              link.focus();
            }
          }
        }

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
     6. Contact form — Formspree via fetch, native POST as fallback
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
      if (
        field &&
        field.getAttribute &&
        field.getAttribute("aria-invalid") === "true" &&
        field.checkValidity()
      ) {
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
          setStatus(
            "Thank you — your message has been sent. I will reply within a few working days.",
            "success"
          );
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
  safe(initForm);
})();
