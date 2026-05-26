document.addEventListener("DOMContentLoaded", () => {
  const navs = Array.from(document.querySelectorAll(".nav"));

  navs.forEach((nav) => {
    const toggle = nav.querySelector(".nav-toggle");
    const menu = nav.querySelector(".menu");
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
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

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        setOpen(false);
      }
    });
  });
});
