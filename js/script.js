    //ICONS HOVER + CLICK ACTIVE + TOGGLER
    const iconBookmark = document.querySelector(".watchlistIcon");

    let isActive = false;

    // hover
    iconBookmark.addEventListener("mouseenter", () => {
      if (!isActive) {
        iconBookmark.src = iconBookmark.dataset.hover;
      }
    });

    iconBookmark.addEventListener("mouseleave", () => {
      if (!isActive) {
        iconBookmark.src = iconBookmark.dataset.default;
      }
    });

    // toggle - makes the bookmark stay pink
    iconBookmark.addEventListener("click", () => {
      isActive = !isActive;
      iconBookmark.src = isActive ? iconBookmark.dataset.active : iconBookmark.dataset.default;
    });

    