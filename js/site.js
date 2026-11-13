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

  var reduceMotionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  function prefersReducedMotion() {
    return reduceMotionQuery ? reduceMotionQuery.matches : false;
  }

  function onMotionPreferenceChange(handler) {
    if (!reduceMotionQuery) return;
    if (typeof reduceMotionQuery.addEventListener === "function") {
      reduceMotionQuery.addEventListener("change", handler);
    } else if (typeof reduceMotionQuery.addListener === "function") {
      reduceMotionQuery.addListener(handler);
    }
  }

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

      if (!prefersReducedMotion() && typeof document.startViewTransition === "function") {
        try {
          document.startViewTransition(apply);
          return;
        } catch (error) {
          /* Fall through to the synchronous update. */
        }
      }

      apply();
    }

    /* The explicit "load more" action is feedback, not a reveal: newly
       revealed records settle once and then stop. */
    function settleNewCards(from) {
      if (prefersReducedMotion()) return;

      cards.filter(matches).slice(from, shown).forEach(function (card) {
        card.classList.add("is-settling");
        window.setTimeout(function () {
          card.classList.remove("is-settling");
        }, 320);
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        setFilter(button.getAttribute("data-filter") || "all");
      });
    });

    if (more) {
      more.addEventListener("click", function () {
        var from = shown;
        shown += pageSize;
        apply();
        settleNewCards(from);
      });
    }

    /* Initial render: no view transition on first paint. */
    apply();
  }

  /* ------------------------------------------------------------------
     6. Contact form — Formspree via fetch, native POST as fallback
     ------------------------------------------------------------------ */
  function initForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var status = form.querySelector("[data-form-status]");
    var statusText = form.querySelector("[data-form-status-text]");
    var submit = form.querySelector("[data-submit]");
    var note = document.getElementById("form-note");

    function setStatus(message, state) {
      if (!status) return;
      if (statusText) statusText.textContent = message;
      else status.textContent = message;
      if (state) status.setAttribute("data-state", state);
      else status.removeAttribute("data-state");
    }

    function setSending(sending) {
      form.classList.toggle("is-sending", !!sending);
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
      setSending(true);
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
          setSending(false);
          if (submit) submit.disabled = false;
        });
    });
  }

  /* ------------------------------------------------------------------
     7. Hero typed focus line — rotating, pausable, height-reserved
     The visible line is a presentation copy and stays aria-hidden; one
     static sentence in the markup is what assistive technology reads.
     ------------------------------------------------------------------ */
  function initTypedFocus() {
    var focus = document.querySelector("[data-typed]");
    if (!focus) return;

    var line = focus.querySelector(".hero__focus-line");
    var text = focus.querySelector("[data-typed-text]");
    var toggle = focus.querySelector("[data-typed-toggle]");
    var toggleLabel = focus.querySelector("[data-typed-toggle-label]");
    var toggleIcon = focus.querySelector("[data-typed-toggle-icon]");
    if (!text) return;

    /* the phrases */
    var phrases = [];
    var source = document.querySelector("[data-typed-phrases]");
    if (source) {
      try {
        phrases = JSON.parse(source.textContent);
      } catch (error) {
        phrases = [];
      }
    }
    if (!Array.isArray(phrases)) phrases = [];
    phrases = phrases.filter(function (phrase) {
      return typeof phrase === "string" && phrase.replace(/\s+/g, " ").trim();
    });
    phrases = phrases.map(function (phrase) {
      return phrase.replace(/\s+/g, " ").trim();
    });

    /* No rotation without at least two usable phrases: the static line stands. */
    if (phrases.length < 2) return;

    var TYPE_MS = 26;
    var ERASE_MS = 12;
    var HOLD_MS = 6000;
    var GAP_MS = 400;
    var LEAD_MS = 240;
    var PUNCT_MS = 140;
    var PUNCTUATION = /[.,;:—–·]/;

    var index = 0;
    var charIndex = 0;
    var phase = "idle";
    var paused = false;
    var settled = false;
    var started = false;
    var inRange = true;
    var timer = null;
    var heroObserver = null;

    function current() {
      return phrases[index];
    }

    function render(count) {
      text.textContent = current().slice(0, count);
    }

    function stopTimer() {
      if (!timer) return;
      window.clearTimeout(timer);
      timer = null;
    }

    function schedule(delay) {
      stopTimer();
      timer = window.setTimeout(step, delay);
    }

    function motionAllowed() {
      return !prefersReducedMotion();
    }

    function canRun() {
      return (
        started &&
        !settled &&
        !paused &&
        !document.hidden &&
        inRange &&
        motionAllowed()
      );
    }

    function kick() {
      if (timer || !canRun()) return;
      schedule(0);
    }

    function setPhase(next) {
      phase = next;
      focus.classList.toggle("is-typing", next === "typing");
    }

    function step() {
      timer = null;
      if (!canRun()) return;

      if (phase === "typing") {
        if (charIndex < current().length) {
          charIndex += 1;
          render(charIndex);
          var typed = current().charAt(charIndex - 1);
          schedule(PUNCTUATION.test(typed) ? PUNCT_MS : TYPE_MS);
        } else {
          setPhase("holding");
          schedule(HOLD_MS);
        }
        return;
      }

      if (phase === "holding") {
        setPhase("erasing");
        schedule(ERASE_MS);
        return;
      }

      if (phase === "erasing") {
        if (charIndex > 0) {
          charIndex -= 1;
          render(charIndex);
          schedule(ERASE_MS);
        } else {
          index = (index + 1) % phrases.length;
          setPhase("typing");
          schedule(GAP_MS);
        }
      }
    }

    function updateToggle() {
      if (!toggle) return;
      focus.classList.toggle("is-paused", paused);
      if (toggleLabel) {
        toggleLabel.textContent = paused
          ? "Resume rotating text"
          : "Pause rotating text";
      }
      if (toggleIcon) {
        toggleIcon.setAttribute("href", paused ? "#i-play" : "#i-pause");
      }
      toggle.setAttribute("title", paused ? "Resume" : "Pause");
    }

    /* Pause completes the current phrase, so a half-written word is never
       frozen on screen. Resume waits one hold, then moves on. */
    function pause() {
      if (paused || settled || !started) return;
      paused = true;
      stopTimer();
      if (phase === "typing" || phase === "erasing") {
        charIndex = current().length;
        render(charIndex);
      }
      setPhase("holding");
      updateToggle();
    }

    function resume() {
      if (!paused || settled) return;
      paused = false;
      updateToggle();
      if (phase === "holding") schedule(HOLD_MS);
      else kick();
    }

    /* Permanent stop: reduced motion, or a failure. The static line stands. */
    function settle() {
      if (settled) return;
      settled = true;
      paused = false;
      stopTimer();
      if (heroObserver) {
        heroObserver.disconnect();
        heroObserver = null;
      }
      index = 0;
      charIndex = phrases[0].length;
      render(charIndex);
      setPhase("idle");
      focus.classList.remove("is-paused");
      root.classList.remove("typed-ready");
      if (toggle) toggle.hidden = true;
      if (line) line.style.minHeight = "";
    }

    /* Measure every phrase once at the current width; the row never grows. */
    function reserve() {
      if (!line) return;
      var previous = text.textContent;
      var tallest = 0;
      phrases.forEach(function (phrase) {
        text.textContent = phrase;
        tallest = Math.max(tallest, line.offsetHeight);
      });
      text.textContent = previous;
      if (tallest) line.style.minHeight = tallest + "px";
    }

    function start() {
      if (started || settled || !motionAllowed()) return;
      started = true;

      reserve();

      index = 0;
      charIndex = 0;
      render(0);
      setPhase("typing");
      root.classList.add("typed-ready");
      if (toggle) toggle.hidden = false;
      updateToggle();
      schedule(LEAD_MS);
    }

    function startWhenReady() {
      if (prefersReducedMotion()) return;

      if (
        document.fonts &&
        document.fonts.ready &&
        typeof document.fonts.ready.then === "function"
      ) {
        document.fonts.ready.then(start);
        /* Fonts may never settle in a broken environment; start regardless. */
        window.setTimeout(start, 1200);
      } else {
        start();
      }
    }

    /* Rotation runs only while the hero is on screen. One observer, no
       scroll listener and no per-frame work. */
    if (typeof window.IntersectionObserver === "function") {
      var hero = document.getElementById("top") || focus;
      heroObserver = new window.IntersectionObserver(
        function (entries) {
          var entry = entries[0];
          if (!entry) return;
          inRange = entry.isIntersecting;
          if (inRange) kick();
          else stopTimer();
        },
        { threshold: 0 }
      );
      heroObserver.observe(hero);
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        if (paused) resume();
        else pause();
      });
    }

    onMotionPreferenceChange(function (event) {
      if (event.matches) settle();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") stopTimer();
      else kick();
    });

    startWhenReady();
  }

  /* ------------------------------------------------------------------
     8. Arrival acknowledgement — the destination answers a jump
     Decorative only: a self-removing class, no focus change, no reload.
     ------------------------------------------------------------------ */
  function initArrival() {
    if (prefersReducedMotion()) return;

    var active = null;
    var activeTimer = null;
    var pendingTimer = null;
    var pendingHandler = null;

    function cancelPending() {
      if (pendingTimer) {
        window.clearTimeout(pendingTimer);
        pendingTimer = null;
      }
      if (pendingHandler) {
        window.removeEventListener("scrollend", pendingHandler);
        pendingHandler = null;
      }
    }

    function clear() {
      cancelPending();
      if (activeTimer) {
        window.clearTimeout(activeTimer);
        activeTimer = null;
      }
      if (active) {
        active.classList.remove("is-arrived");
        active = null;
      }
    }

    function fire(section) {
      cancelPending();
      if (!document.contains(section)) return;

      /* Force a style flush so a repeated click restarts the draw. */
      void section.offsetWidth;
      section.classList.add("is-arrived");
      active = section;
      if (activeTimer) window.clearTimeout(activeTimer);
      activeTimer = window.setTimeout(clear, 900);
    }

    function inView(section) {
      var box = section.getBoundingClientRect();
      return box.top < window.innerHeight && box.bottom > 0;
    }

    function scopeOf(link) {
      return (
        link.closest(".nav") ||
        link.closest(".footer-nav") ||
        link.closest(".hero__actions")
      );
    }

    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
      if (!link || !scopeOf(link)) return;

      var href = link.getAttribute("href") || "";
      var id = href.slice(1);
      if (!id) return;

      var target = document.getElementById(id);
      if (!target) return;

      var section = target.classList.contains("section")
        ? target
        : target.closest(".section");
      if (!section || !section.querySelector(".section-head h2")) return;

      clear();

      /* Smooth scrolling would otherwise spend the draw off screen. */
      if (inView(section)) {
        fire(section);
      } else if ("onscrollend" in window) {
        pendingHandler = function () {
          fire(section);
        };
        window.addEventListener("scrollend", pendingHandler, { once: true });
        pendingTimer = window.setTimeout(pendingHandler, 900);
      } else {
        fire(section);
      }
    });

    onMotionPreferenceChange(function (event) {
      if (event.matches) clear();
    });
  }

  /* ------------------------------------------------------------------
     9. Copy e-mail — the mailto link stays the no-JS path
     ------------------------------------------------------------------ */
  function initCopyEmail() {
    var buttons = document.querySelectorAll("[data-copy-email]");
    if (!buttons.length) return;

    Array.prototype.forEach.call(buttons, function (button) {
      var value = (button.getAttribute("data-copy-email") || "").trim();
      if (!value) return;

      var label = button.querySelector("[data-copy-label]");
      var icon = button.querySelector("[data-copy-icon]");
      var timer = null;

      function state(copied) {
        button.classList.toggle("is-copied", copied);
        if (label) label.textContent = copied ? "Copied" : "Copy";
        if (icon) icon.setAttribute("href", copied ? "#i-check" : "#i-copy");
      }

      function confirmCopy() {
        if (timer) window.clearTimeout(timer);
        state(true);
        timer = window.setTimeout(function () {
          state(false);
          timer = null;
        }, 2000);
      }

      function legacyCopy() {
        var area = document.createElement("textarea");
        area.value = value;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.top = "-1000px";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();

        var ok = false;
        try {
          ok = document.execCommand("copy");
        } catch (error) {
          ok = false;
        }

        document.body.removeChild(area);
        if (ok) confirmCopy();
      }

      button.hidden = false;

      button.addEventListener("click", function () {
        if (
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === "function"
        ) {
          navigator.clipboard.writeText(value).then(confirmCopy, legacyCopy);
        } else {
          legacyCopy();
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     10. Decorative rules — one observer, one pass, no content gated
     ------------------------------------------------------------------ */
  function initDrawnRules() {
    var targets = Array.prototype.slice.call(
      document.querySelectorAll(
        ".section-head, .evidence-band, .delivery-path, .footer__graph"
      )
    );
    if (!targets.length) return;

    function showAll() {
      root.classList.remove("motion-ready");
      targets.forEach(function (target) {
        target.classList.add("is-drawn");
      });
    }

    if (prefersReducedMotion() || typeof window.IntersectionObserver !== "function") {
      showAll();
      return;
    }

    /* Only hide decorative rules once this module is actually running and an
       observer exists; content and controls never depend on this class. */
    root.classList.add("motion-ready");

    var observer = new window.IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-drawn");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach(function (target) {
      observer.observe(target);
    });

    onMotionPreferenceChange(function (event) {
      if (!event.matches) return;
      showAll();
      observer.disconnect();
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
  safe(initTypedFocus);
  safe(initArrival);
  safe(initCopyEmail);
  safe(initDrawnRules);
  safe(initPortfolio);
  safe(initForm);
})();
