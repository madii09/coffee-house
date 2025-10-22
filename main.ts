const track = document.querySelector<HTMLElement>('.carousel__track');
const nextButton = document.querySelector<HTMLButtonElement>('.carousel__arrow--right');
const prevButton = document.querySelector<HTMLButtonElement>('.carousel__arrow--left');
const progressLines = document.querySelectorAll<HTMLElement>('.carousel__progress-line');

if (track && nextButton && prevButton) {
  const slides = Array.from(track.children) as HTMLElement[];
  let currentIndex = 0;

  function updateCarousel(): void {
    if (!track) return; // Extra safety (TypeScript happy)
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    progressLines.forEach((line, index) => {
      line.classList.toggle('active', index === currentIndex);
    });
  }

  nextButton.addEventListener('click', (): void => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  prevButton.addEventListener('click', (): void => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });
}


// Burger Menu
const burgerBtn = document.getElementById('burger-btn') as HTMLButtonElement | null;
const nav = document.querySelector<HTMLElement>('.nav');

let savedScrollY = 0;

function lockBodyScroll(): void {
  savedScrollY =
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    0;

  document.body.style.top = `-${savedScrollY}px`;
  document.body.classList.add('body-scroll-lock');
}

function unlockBodyScroll(): void {
  document.body.classList.remove('body-scroll-lock');
  document.body.style.top = '';
  window.scrollTo(0, savedScrollY);
}

if (burgerBtn && nav) {
  burgerBtn.addEventListener('click', (): void => {
    const isOpen = nav.classList.toggle('open');
    burgerBtn.classList.toggle('active');

    if (isOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  });

  document.querySelectorAll<HTMLAnchorElement>('.nav__list a').forEach((link) => {
    link.addEventListener('click', (): void => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        burgerBtn.classList.remove('active');
        unlockBodyScroll();
      }
    });
  });
}

// Menu link redirect
const menuLink = document.querySelector<HTMLElement>('[data-menu-link]');
if (menuLink) {
  menuLink.addEventListener('click', (): void => {
    window.location.href = 'menu.html';
  });
}
