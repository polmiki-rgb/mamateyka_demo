document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("js");

  const currentPage = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  const ensureFavicons = () => {
    const head = document.head;
    if (!head) return;

    const iconSpecs = [
      {
        rel: "icon",
        type: "image/png",
        href: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREXA8sUAs2oJTc9z0dNAu0B2rMpHQA94pt0A&s",
      },
      {
        rel: "shortcut icon",
        href: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREXA8sUAs2oJTc9z0dNAu0B2rMpHQA94pt0A&s",
      },
    ];

    iconSpecs.forEach(({ rel, type, href }) => {
      if (head.querySelector(`link[rel="${rel}"]`)) return;
      const link = document.createElement("link");
      link.rel = rel;
      if (type) link.type = type;
      link.href = href;
      head.appendChild(link);
    });
  };

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
        ".hero .text, .hero .carousel, .quick-intent .qi-card, .live .item, .aud, .tile, .story, .about .ph, .about .st, .support .box, .story-strip .item, .impact-cards .item, .contact-intents .item, .story-cards .card, .gallery .ph, .album-card, .album-detail, .prose, .aside .card, .community-switcher .shell",
      ),
    );

    if (!revealTargets.length) return;

    const isInitiallyVisible = (el) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    };

    revealTargets.forEach((el, idx) => {
      el.classList.add("reveal");
      el.style.setProperty(
        "--reveal-delay",
        `${Math.min(260, (idx % 8) * 36)}ms`,
      );

      if (isInitiallyVisible(el)) {
        el.classList.add("is-visible");
      }
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

    revealTargets.forEach((el) => {
      if (!el.classList.contains("is-visible")) {
        observer.observe(el);
      }
    });
  };

  const setupNavigation = () => {
    const navItems = [
      { href: "index.html", label: "Domov" },
      { href: "o-nas.html", label: "O nás" },
      {
        label: "Komunita",
        children: [
          { href: "oratko.html", label: "Oratko" },
          { href: "mladi.html", label: "Mladí" },
          { href: "rodiny.html", label: "Rodiny" },
        ],
      },
      { href: "farnost.html", label: "Farnosť" },
      { href: "galeria.html", label: "Galéria" },
      { href: "podujatia.html", label: "Podujatia" },
      { href: "kontakt.html", label: "Kontakt" },
    ];

    const navs = Array.from(document.querySelectorAll(".nav"));

    navs.forEach((nav) => {
      const toggle = nav.querySelector(".nav-toggle");
      const menu = nav.querySelector(".menu");
      const search = nav.querySelector(".search");
      if (!toggle || !menu) return;

      if (search) search.remove();

      const setOpen = (open) => {
        nav.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute(
          "aria-label",
          open ? "Zavrieť navigáciu" : "Otvoriť navigáciu",
        );
      };

      const createLink = (href, label) => {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = label;
        if (currentPage === href) link.classList.add("active");
        return link;
      };

      menu.innerHTML = "";

      navItems.forEach((item) => {
        if (item.children) {
          const group = document.createElement("details");
          group.className = "menu-group";
          const childIsActive = item.children.some(
            (child) => currentPage === child.href,
          );
          if (childIsActive) group.open = true;

          const summary = document.createElement("summary");
          summary.textContent = item.label;
          if (childIsActive) summary.classList.add("active");

          const submenu = document.createElement("div");
          submenu.className = "menu-submenu";
          item.children.forEach((child) => {
            submenu.appendChild(createLink(child.href, child.label));
          });

          group.append(summary, submenu);
          menu.appendChild(group);

          if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            let closeTimer = null;
            const clearCloseTimer = () => {
              if (closeTimer) {
                window.clearTimeout(closeTimer);
                closeTimer = null;
              }
            };
            const closeIfInactive = () => {
              if (childIsActive) return;
              clearCloseTimer();
              closeTimer = window.setTimeout(() => {
                group.open = false;
                closeTimer = null;
              }, 120);
            };

            group.addEventListener("mouseenter", () => {
              clearCloseTimer();
              group.open = true;
            });
            group.addEventListener("mouseleave", closeIfInactive);
            group.addEventListener("focusin", () => {
              clearCloseTimer();
              group.open = true;
            });
            group.addEventListener("focusout", (event) => {
              if (!group.contains(event.relatedTarget) && !childIsActive) {
                closeIfInactive();
              }
            });
            submenu.addEventListener("mouseenter", clearCloseTimer);
            submenu.addEventListener("mouseleave", closeIfInactive);
          }

          return;
        }

        menu.appendChild(createLink(item.href, item.label));
      });

      setOpen(false);

      toggle.addEventListener("click", () => {
        setOpen(!nav.classList.contains("open"));
      });

      menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setOpen(false));
      });

      document.addEventListener("click", (event) => {
        if (!nav.classList.contains("open")) return;
        if (!nav.contains(event.target)) setOpen(false);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && nav.classList.contains("open")) {
          setOpen(false);
          toggle.focus();
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 900) setOpen(false);
      });
    });
  };

  const setupCommunitySwitcher = () => {
    const switcher = document.querySelector("[data-community-switcher]");
    if (!switcher) return;

    const data = {
      oratko: {
        kicker: "Oratko",
        title: "Bezpečný priestor po škole",
        text: "Pre deti, ktoré potrebujú hru, pohyb, kamarátov a ľudí, ktorí ich poznajú po mene. Oratko je prirodzený vstup do celej Mamateyky.",
        image:
          "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=80",
        imageAlt: "Deti pri aktivitách v Oratku",
        pills: ["Stretká", "FK Mamateyka", "Herňa", "Krúžky"],
        href: "oratko.html",
        cta: "Pozrieť Oratko",
      },
      mladi: {
        kicker: "Mladí",
        title: "Spoločenstvo, ktoré ťa posunie ďalej",
        text: "Stretká, duchovné ponuky, dobrovoľníctvo a priestor na otázky, identitu aj priateľstvá. Komunita mladých je živá, otvorená a rastie spolu s tebou.",
        image:
          "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1200&q=80",
        imageAlt: "Mladí ľudia na spoločenstve",
        pills: ["Stretká", "Tím", "Púte", "Dobrovoľníctvo"],
        href: "mladi.html",
        cta: "Pozrieť Mladých",
      },
      rodiny: {
        kicker: "Rodiny",
        title: "Praktické aj duchovné miesto pre rodičov",
        text: "Mamatko, rodinné stretká, rodičovská akadémia a ďalšie aktivity, ktoré podporujú rodiny v bežnom živote aj vo viere.",
        image:
          "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80",
        imageAlt: "Rodina spolu na komunite",
        pills: ["Mamatko", "Akadémia", "Stretká", "Modlitba"],
        href: "rodiny.html",
        cta: "Pozrieť Rodiny",
      },
      farnost: {
        kicker: "Farnosť",
        title: "Duchovný domov v strede komunity",
        text: "Sväté omše, sviatosti, pastorácia a otvorený priestor pre ľudí, ktorí hľadajú pokoj, odpovede alebo konkrétnu pomoc.",
        image:
          "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1200&q=80",
        imageAlt: "Farská komunita v kostole",
        pills: ["Omše", "Sviatosti", "Pastorácia", "Modlitba"],
        href: "farnost.html",
        cta: "Pozrieť Farnosť",
      },
    };

    const tabs = Array.from(switcher.querySelectorAll("[data-community-tab]"));
    const image = switcher.querySelector("[data-community-image]");
    const kicker = switcher.querySelector("[data-community-kicker]");
    const title = switcher.querySelector("[data-community-title]");
    const text = switcher.querySelector("[data-community-text]");
    const pills = switcher.querySelector("[data-community-pills]");
    const cta = switcher.querySelector("[data-community-cta]");

    if (
      !tabs.length ||
      !image ||
      !kicker ||
      !title ||
      !text ||
      !pills ||
      !cta
    ) {
      return;
    }

    const activate = (key) => {
      const item = data[key];
      if (!item) return;

      tabs.forEach((tab) => {
        const active = tab.dataset.communityTab === key;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-pressed", active ? "true" : "false");
      });

      switcher.classList.add("is-switching");
      window.setTimeout(() => {
        image.src = item.image;
        image.alt = item.imageAlt;
        kicker.textContent = item.kicker;
        title.textContent = item.title;
        text.textContent = item.text;
        pills.innerHTML = item.pills
          .map((pill) => `<span>${pill}</span>`)
          .join("");
        cta.href = item.href;
        cta.textContent = item.cta;
        switcher.classList.remove("is-switching");
      }, 120);
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab.dataset.communityTab));
    });

    activate("oratko");
  };

  ensureFavicons();
  ensureScrollProgress();
  setupRevealMotion();
  setupNavigation();
  setupCommunitySwitcher();
});
