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


   
        $(".movieCard").on("mouseenter", function() {
          const card = $(this);
      
          // Bring above others
          card.animate({width: '600px'}, 500);
          
          card.css("z-index", 10);
        });
      
        $(".movieCard").on("mouseleave", function() {
          const card = $(this);

          card.animate({width: '222px'}, 100);
          // Return z-index after animation
          setTimeout(() => {
            card.css("z-index", 1);
          }, 300);
        });
      
//make card extend


    