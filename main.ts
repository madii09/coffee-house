import { updateCartCountUI } from './src/ts/cart-utils'
const track = document.querySelector<HTMLElement>('.carousel__track');
const nextButton = document.querySelector<HTMLButtonElement>('.carousel__arrow--right');
const prevButton = document.querySelector<HTMLButtonElement>('.carousel__arrow--left');
const progressLines = document.querySelectorAll<HTMLElement>('.carousel__progress-line');

if (track && nextButton && prevButton) {
  const slides = Array.from(track.children) as HTMLElement[];
  let currentIndex = 0;

  function updateCarousel(): void {
    if (!track) return;
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

const menuLink = document.querySelector<HTMLElement>('[data-menu-link]');
if (menuLink) {
  menuLink.addEventListener('click', (): void => {
    window.location.href = 'menu.html';
  });
}
const logoutBtn = document.getElementById('logout-btn');

const isLoggedIn = !!localStorage.getItem('access_token');

if (logoutBtn) {
  if (isLoggedIn) {
    logoutBtn.style.display = 'block';
  } else {
    logoutBtn.style.display = 'none';
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    alert('Logged out successfully!');
    logoutBtn.style.display = 'none';
    window.location.href = 'signin.html';
  });
}
document.addEventListener('DOMContentLoaded', () => {
  updateCartCountUI();
});
window.addEventListener('storage', (event) => {
  if (event.key === 'coffee_cart_v1') {
    updateCartCountUI();
  }
});