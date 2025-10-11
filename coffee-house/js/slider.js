async function initSlider() {
  try {
    const res = await fetch('./data/products.json');
    const allData = await res.json();

    const sliderItems = allData.slice(-3);

    const track = document.querySelector('.carousel__track');
    const progress = document.querySelector('.carousel__progress');
    const textName = document.querySelector('.text span');
    const textDesc = document.querySelector('.text p');
    const textPrice = document.querySelector('.text .price');

    sliderItems.forEach((item, index) => {
      const slide = document.createElement('div');
      slide.classList.add('carousel__slide');
      slide.innerHTML = `<img src="assets/images/coffee-slider-${
        index + 1
      }.png" alt="${item.name}" />`;
      track.appendChild(slide);

      const line = document.createElement('div');
      line.classList.add('carousel__progress-line');
      if (index === 0) line.classList.add('active');
      progress.appendChild(line);
    });

    let current = 0;

    const updateSlide = () => {
      const { name, description, price } = sliderItems[current];
      textName.textContent = name;
      textDesc.textContent = description;
      textPrice.textContent = `$${price}`;
      document
        .querySelectorAll('.carousel__progress-line')
        .forEach((line, i) => {
          line.classList.toggle('active', i === current);
        });
      track.style.transform = `translateX(-${current * 100}%)`;
    };

    document
      .querySelector('.carousel__arrow--left')
      .addEventListener('click', () => {
        current = (current - 1 + sliderItems.length) % sliderItems.length;
        updateSlide();
      });

    document
      .querySelector('.carousel__arrow--right')
      .addEventListener('click', () => {
        current = (current + 1) % sliderItems.length;
        updateSlide();
      });

    updateSlide();
  } catch (err) {
    console.error('Error loading slider:', err);
  }
}

initSlider();
