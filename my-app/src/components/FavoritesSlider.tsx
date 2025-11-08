import React, { useEffect, useState, useRef } from 'react';
import type { CoffeeItem } from '../types/products';
import { fetchFavorites, type FavoritesResponse } from '../services/api';
import imagesData from '../data/images.json';

type CoffeeItemWithImage = CoffeeItem & { image: string };

// Build image map from local JSON
const imageMap: Record<string, string> = {};
imagesData.forEach((item: { name: string; image: string }) => {
  imageMap[item.name] = `/assets/images/${item.image}`;
});

const FavoritesSlider: React.FC = () => {
  const [slides, setSlides] = useState<CoffeeItemWithImage[]>([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const isUserLoggedIn = () => Boolean(localStorage.getItem('access_token'));

  // Fetch favorites and attach image
  useEffect(() => {
    async function loadFavorites() {
      try {
        const response: FavoritesResponse = await fetchFavorites();
        const favorites: CoffeeItem[] = response.data;

        const mappedSlides: CoffeeItemWithImage[] = favorites
          .filter((item) => imageMap[item.name])
          .map((item) => ({ ...item, image: imageMap[item.name] }))
          .slice(0, 3);

        setSlides(mappedSlides);
      } catch (error) {
        console.error(error);
      }
    }

    loadFavorites();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (slides.length === 0) return;

    intervalRef.current = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [slides]);

  const handlePrev = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const handleNext = () => setCurrent((prev) => (prev + 1) % slides.length);

  if (slides.length === 0) return <div>Loading...</div>;

  const { name, description, price, discountPrice } = slides[current];
  const loggedIn = isUserLoggedIn();

  return (
    <>
      <div
        className='carousel container'
        onMouseEnter={() =>
          intervalRef.current && clearInterval(intervalRef.current)
        }
        onMouseLeave={() => {
          intervalRef.current = window.setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
          }, 5000);
        }}
      >
        <button
          className='carousel__arrow carousel__arrow--left'
          onClick={handlePrev}
        >
          &lt;
        </button>

        <div
          className='carousel__track'
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => (
            <div className='carousel__slide' key={slide.name}>
              <img src={slide.image} alt={slide.name} loading='lazy' />
            </div>
          ))}
        </div>

        <button
          className='carousel__arrow carousel__arrow--right'
          onClick={handleNext}
        >
          &gt;
        </button>
      </div>
      <div className='text'>
        <span className='name'>{name}</span>
        <p className='desc'>{description}</p>
        <div className='price'>
          {discountPrice && loggedIn ? (
            <>
              <span className='original-price'>
                ${Number(price).toFixed(2)}
              </span>
              <span className='discount-price'>
                ${Number(discountPrice).toFixed(2)}
              </span>
            </>
          ) : (
            `$${Number(price).toFixed(2)}`
          )}
        </div>
      </div>

      <div className='carousel__progress'>
        {slides.map((_, index) => (
          <div
            key={index}
            className={`carousel__progress-line ${
              index === current ? 'active' : ''
            }`}
          />
        ))}
      </div>
    </>
  );
};

export default FavoritesSlider;
