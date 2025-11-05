document.addEventListener("DOMContentLoaded", () => {

const track = document.getElementById("movieTrack");
const btnLeft = document.getElementById("leftArrow");
const btnRight = document.getElementById("rightArrow");

const scrollAmount = 250; // adjust per card width + gap

// Clone first and last few cards for the infinite loop illusion
const cards = Array.from(track.children);
cards.slice(0, 3).forEach(card => {
  const clone = card.cloneNode(true);
  track.appendChild(clone);
});
cards.slice(-3).forEach(card => {
  const clone = card.cloneNode(true);
  track.insertBefore(clone, track.firstChild);
});

// Set initial scroll position to the “real” start
track.scrollLeft = track.scrollWidth / 3;

// Button controls
btnRight.addEventListener("click", () => {
  track.scrollBy({ left: scrollAmount, behavior: "smooth" });
  setTimeout(checkLoop, 500);
});

btnLeft.addEventListener("click", () => {
  track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  setTimeout(checkLoop, 500);
});

function checkLoop() {
  const maxScroll = track.scrollWidth - track.clientWidth;
  const oneSection = track.scrollWidth / 3;

  if (track.scrollLeft >= maxScroll - oneSection) {
    // reached end — jump back to start
    track.scrollLeft = oneSection;
  } else if (track.scrollLeft <= 0) {
    // reached start — jump to end
    track.scrollLeft = maxScroll - (2 * oneSection);
  }
}
});