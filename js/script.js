    //BOOKMARK, WISHLIST, ICON HOVER + CLICK ACTIVE + TOGGLER
    const iconBookmarks = document.querySelectorAll(".watchlistIcon");

    
    iconBookmarks.forEach((iconBookmark) => {
      let isActive = false;
    
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
    });

    // this is for the watch button toggled to watchedButton
    const watchButton = document.querySelectorAll(".watchButton");

    watchButton.forEach((watchButton) => {
        let isActive = false;

        watchButton.addEventListener("click", () => {
            isActive = !isActive;
            watchButton.src = isActive ? watchButton.dataset.active : watchButton.dataset.default;
        });
    });

    const movieCard = document.querySelectorAll(".movieCard")

    