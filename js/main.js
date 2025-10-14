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

let savedScrollY = 0;

function lockBodyScroll() {
  savedScrollY =
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    0;
  document.body.style.top = `-${savedScrollY}px`;
  document.body.classList.add('body-scroll-lock');
}

function unlockBodyScroll() {
  document.body.classList.remove('body-scroll-lock');
  document.body.style.top = '';

  window.scrollTo(0, savedScrollY);
}

if (burgerBtn && nav) {
  burgerBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burgerBtn.classList.toggle('active');

    if (isOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  });

  document.querySelectorAll('.nav__list a').forEach((link) => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        burgerBtn.classList.remove('active');
        unlockBodyScroll();
      }
    });
  });
}

const menuLink = document.querySelector('[data-menu-link]');
if (menuLink) {
  menuLink.addEventListener('click', () => {
    window.location.href = 'menu.html';
  });
}
