document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("js");

  const ensureScrollProgress = () => {
    let progress = document.querySelector(".scroll-progress");
    if (!progress) {
      progress = document.createElement("div");
      progress.className = "scroll-progress";
      progress.innerHTML = '<div class="bar"></div>';
      document.body.appendChild(progress);
    }

    const bar = progress.querySelector(".bar");
    const update = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const percent = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  };

  const setupRevealMotion = () => {
    const revealTargets = Array.from(
      document.querySelectorAll(
        ".hero .text, .hero .carousel, .quick-intent .qi-card, .live .item, .aud, .tile, .story, .about .ph, .about .st, .support .box, .story-strip .item, .impact-cards .item, .contact-intents .item, .story-cards .card, .gallery .ph, .album-card, .album-detail, .prose, .aside .card",
      ),
    );

    if (!revealTargets.length) return;

    revealTargets.forEach((el, idx) => {
      el.classList.add("reveal");
      el.style.setProperty(
        "--reveal-delay",
        `${Math.min(260, (idx % 8) * 36)}ms`,
      );
    });

    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -6% 0px",
      },
    );

    revealTargets.forEach((el) => observer.observe(el));
  };

  const navs = Array.from(document.querySelectorAll(".nav"));

  navs.forEach((nav) => {
    const toggle = nav.querySelector(".nav-toggle");
    const menu = nav.querySelector(".menu");
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute(
        "aria-label",
        open ? "Zavrieť navigáciu" : "Otvoriť navigáciu",
      );
    };

    setOpen(false);

    toggle.addEventListener("click", () => {
      setOpen(!nav.classList.contains("open"));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("open")) return;
      if (!nav.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        setOpen(false);
      }
    });
  });

  ensureScrollProgress();
  setupRevealMotion();
});
