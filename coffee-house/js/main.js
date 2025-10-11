const track = document.querySelector('.carousel__track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel__arrow--right');
const prevButton = document.querySelector('.carousel__arrow--left');
const progressLines = document.querySelectorAll('.carousel__progress-line');

let currentIndex = 0;

function updateCarousel() {
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  progressLines.forEach((line, index) => {
    line.classList.toggle('active', index === currentIndex);
  });
}

nextButton.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
});

prevButton.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
});
