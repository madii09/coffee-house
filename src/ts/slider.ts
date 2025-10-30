import { Product } from '../types/types';

const API_BASE = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com';

type ImageMapItem = { name: string; image: string };

async function loadImageMap(): Promise<Record<string, string>> {
  const res = await fetch('/data/images.json');
  const data: ImageMapItem[] = await res.json();

  const map: Record<string, string> = {};
  data.forEach(item => {
    map[item.name] = `assets/images/${item.image}`;
  });

  return map;
}

async function initSlider(): Promise<void> {
  const carousel = document.querySelector<HTMLDivElement>('.carousel');

  const showErrorMessage = (message: string) => {
    if (!carousel) return;
    carousel.innerHTML = `
      <div class="carousel-error" style="
        text-align: center;
        color: red;
      ">
        ${message}
      </div>
    `;
  };

  try {
    const [res, imageMap] = await Promise.all([
      fetch(`${API_BASE}/products/favorites`),
      loadImageMap()
    ]);

    if (!res.ok) throw new Error(`Failed to fetch favorites (${res.status})`);
    const json = await res.json();
    const allData: Product[] = json.data;

    if (!Array.isArray(allData) || allData.length === 0) return;

    const sliderItems = allData.filter(item => imageMap[item.name]).slice(0, 3);

    const track = document.querySelector<HTMLDivElement>('.carousel__track');
    const progress = document.querySelector<HTMLDivElement>('.carousel__progress');
    const textName = document.querySelector<HTMLSpanElement>('.text .name');
    const textDesc = document.querySelector<HTMLParagraphElement>('.text .desc');
    const textPrice = document.querySelector<HTMLDivElement>('.text .price');

    if (!track || !progress || !textName || !textDesc || !textPrice || !carousel) {
      showErrorMessage("Something went wrong. Please, refresh the page");
      return;
    }

    track.innerHTML = '';
    progress.innerHTML = '';

    sliderItems.forEach((item, index) => {
      const slide = document.createElement('div');
      slide.classList.add('carousel__slide');
      const imgSrc = imageMap[item.name];
      slide.innerHTML = `<img src="${imgSrc}" alt="${item.name}" loading="lazy" />`;
      track.appendChild(slide);

      const line = document.createElement('div');
      line.classList.add('carousel__progress-line');
      if (index === 0) line.classList.add('active');
      progress.appendChild(line);
    });

    let current = 0;

    function isUserLoggedIn(): boolean {
      return Boolean(localStorage.getItem('access_token'));
    }

    const updateSlide = () => {
      const { name, description, price, discountPrice } = sliderItems[current];
      textName.textContent = name;
      textDesc.textContent = description;

      const loggedIn = isUserLoggedIn();

      if (discountPrice && loggedIn) {
        textPrice.innerHTML = `
          <span class="original-price">$${Number(price).toFixed(2)}</span>
          <span class="discount-price">$${Number(discountPrice).toFixed(2)}</span>
        `;
      } else {
        textPrice.textContent = `$${Number(price).toFixed(2)}`;
      }

      document.querySelectorAll<HTMLDivElement>('.carousel__progress-line')
        .forEach((line, i) => line.classList.toggle('active', i === current));

      track.style.transform = `translateX(-${current * 100}%)`;
    };

    const leftArrow = document.querySelector<HTMLButtonElement>('.carousel__arrow--left');
    const rightArrow = document.querySelector<HTMLButtonElement>('.carousel__arrow--right');

    leftArrow?.addEventListener('click', () => {
      current = (current - 1 + sliderItems.length) % sliderItems.length;
      updateSlide();
    });

    rightArrow?.addEventListener('click', () => {
      current = (current + 1) % sliderItems.length;
      updateSlide();
    });

    let intervalId: number | null = null;
    const startAutoSlide = () => {
      intervalId && clearInterval(intervalId);
      intervalId = window.setInterval(() => {
        current = (current + 1) % sliderItems.length;
        updateSlide();
      }, 5000);
    };

    const stopAutoSlide = () => {
      if (intervalId !== null) clearInterval(intervalId);
    };

    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    updateSlide();
    startAutoSlide();

  } catch (err) {
    console.error('Error loading slider:', err);
    showErrorMessage("Something went wrong. Please, refresh the page");
  }
}

document.addEventListener('DOMContentLoaded', initSlider);
