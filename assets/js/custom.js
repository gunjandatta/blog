/**
 * Main JS file for Scriptor behaviours
 */

// Responsive video embeds
let videoEmbeds = [
  'iframe[src*="youtube.com"]',
  'iframe[src*="vimeo.com"]'
];
reframe(videoEmbeds.join(','));

// Menu on small screens
let menuToggle = document.querySelectorAll('.menu-toggle');
if (menuToggle) {
  for (let i = 0; i < menuToggle.length; i++) {
    menuToggle[i].addEventListener('click', function (e) {
      document.body.classList.toggle('menu--opened');
      e.preventDefault();
    }, false);
  }
}

// Back arrow button
let backButtons = document.querySelectorAll(".archive-back-link");
if (backButtons) {
  for (let i = 0; i < backButtons.length; i++) {
    backButtons[i].addEventListener("click", function (e) {
      window.history.back();
      e.preventDefault();
    });
  }
}