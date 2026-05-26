document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".gallery-page");
  if (!page) return;

  const grid = document.getElementById("album-grid");
  const cards = Array.from(grid.querySelectorAll(".album-card"));
  const search = document.getElementById("album-search");
  const loadMore = document.getElementById("album-load-more");
  const meta = document.getElementById("album-meta");
  const empty = document.getElementById("album-empty");
  const step = 8;
  let visibleLimit = step;

  const apply = () => {
    const query = (search.value || "").trim().toLowerCase();
    const matched = cards.filter((card) => {
      const cardTitle = (card.dataset.title || "").toLowerCase();
      const cardText = card.textContent.toLowerCase();
      return !query || cardTitle.includes(query) || cardText.includes(query);
    });

    cards.forEach((card) => {
      card.style.display = "none";
    });

    const shown = matched.slice(0, visibleLimit);
    shown.forEach((card) => {
      card.style.display = "block";
    });

    meta.textContent = `Zobrazené albumy: ${shown.length} / ${matched.length}`;
    empty.style.display = matched.length ? "none" : "block";

    if (loadMore) {
      loadMore.style.display = shown.length < matched.length ? "inline-flex" : "none";
    }
  };

  search.addEventListener("input", () => {
    visibleLimit = step;
    apply();
  });

  if (loadMore) {
    loadMore.addEventListener("click", () => {
      visibleLimit += step;
      apply();
    });
  }

  apply();
});
