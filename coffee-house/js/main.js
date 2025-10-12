const track = document.querySelector('.carousel__track');
const nextButton = document.querySelector('.carousel__arrow--right');
const prevButton = document.querySelector('.carousel__arrow--left');
const progressLines = document.querySelectorAll('.carousel__progress-line');

if (track && nextButton && prevButton) {
  const slides = Array.from(track.children);
  let currentIndex = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    progressLines.forEach((line, index) =>
      line.classList.toggle('active', index === currentIndex)
    );
  }

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });
}

const burgerBtn = document.getElementById('burger-btn');
const nav = document.querySelector('.nav');

if (burgerBtn && nav) {
  burgerBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
    burgerBtn.classList.toggle('active');
  });
}

const menuLink = document.querySelector('[data-menu-link]');
if (menuLink) {
  menuLink.addEventListener('click', () => {
    window.location.href = 'menu.html';
  });
}
