document.addEventListener('DOMContentLoaded', () => {
  const menuItemsContainer = document.getElementById('menu-items');
  const buttons = document.querySelectorAll('.menu-btn');

  const modal = document.getElementById('item-modal');
  const modalImg = document.getElementById('modal-img');
  const modalName = document.getElementById('modal-name');
  const modalDesc = document.getElementById('modal-desc');
  const modalPrice = document.getElementById('modal-price');
  const sizeOptions = document.getElementById('size-options');
  const additiveOptions = document.getElementById('additive-options');
  const closeBtn = document.querySelector('.close-btn');

  const loadMoreBtn = document.getElementById('loadMoreBtn');

  const ITEMS_TO_SHOW = 4;
  let currentCategory = 'coffee';
  let displayedCount = ITEMS_TO_SHOW;
  let menuDataGlobal = [];

  let currentItem = null;
  let basePrice = 0;
  let selectedAdditives = [];

  fetch('./data/products.json')
    .then((res) => res.json())
    .then((data) => {
      menuDataGlobal = data;
      renderItems(data, currentCategory);

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          buttons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          renderItems(menuDataGlobal, btn.dataset.category);
        });
      });

      menuItemsContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.menu-card');
        if (!card) return;

        const itemName = card.querySelector('h3').textContent;
        const itemData = menuDataGlobal.find((i) => i.name === itemName);

        if (itemData) openModal(itemData);
      });
    })
    .catch((err) => console.error('Error loading menu:', err));

  function renderItems(menuData, category) {
    currentCategory = category;
    displayedCount = ITEMS_TO_SHOW;

    const filtered = menuData.filter((item) => item.category === category);

    menuItemsContainer.innerHTML = filtered
      .map(
        (item, index) => `
      <div class="menu-card" style="${
        window.innerWidth <= 768 && index >= ITEMS_TO_SHOW
          ? 'display:none;'
          : ''
      }">
        <img src="./assets/images/${item.image}" alt="${item.name}" />
        <div class="menu-info">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <span class="price">$${item.price}</span>
        </div>
      </div>
    `
      )
      .join('');

    if (window.innerWidth <= 768 && filtered.length > ITEMS_TO_SHOW) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
    }
  }

  loadMoreBtn.addEventListener('click', () => {
    const cards = menuItemsContainer.querySelectorAll('.menu-card');
    cards.forEach((card, index) => {
      if (index < displayedCount + ITEMS_TO_SHOW) {
        card.style.display = 'block';
      }
    });

    displayedCount += ITEMS_TO_SHOW;

    if (displayedCount >= cards.length) {
      loadMoreBtn.style.display = 'none';
    }
  });

  function openModal(item) {
    currentItem = item;
    basePrice = parseFloat(item.price);
    selectedAdditives = [];

    modalImg.src = `./assets/images/${item.image}`;
    modalName.textContent = item.name;
    modalDesc.textContent = item.description;
    modal.classList.add('active');

    // ✅ Prevent scrolling and hide burger menu
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    sizeOptions.innerHTML = Object.entries(item.sizes)
      .map(
        ([key, val]) => `
      <button data-size="${key}" data-add="${val['add-price']}" class="${
          key === 's' ? 'active' : ''
        }">${key.toUpperCase()} (${val.size})</button>
    `
      )
      .join('');

    additiveOptions.innerHTML = item.additives
      .map(
        (add, index) => `
      <button 
        data-additive="${add.name}" 
        data-price="${add['add-price']}"
      >
        <span class="number">${index + 1}</span> ${add.name}
      </button>
    `
      )
      .join('');

    updatePrice();
  }

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = ''; // ✅ restore scroll
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = ''; // ✅ restore scroll
    }
  });

  function updatePrice() {
    const sizeButton = sizeOptions.querySelector('.active');
    const sizeAdd = sizeButton ? parseFloat(sizeButton.dataset.add) : 0;

    const additivesTotal = selectedAdditives.reduce(
      (sum, add) => sum + parseFloat(add.dataset.price),
      0
    );

    modalPrice.textContent = (basePrice + sizeAdd + additivesTotal).toFixed(2);
  }

  sizeOptions.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      sizeOptions
        .querySelectorAll('button')
        .forEach((b) => b.classList.remove('active'));
      e.target.classList.add('active');
      updatePrice();
    }
  });

  additiveOptions.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      e.target.classList.toggle('active');
      if (e.target.classList.contains('active')) {
        selectedAdditives.push(e.target);
      } else {
        selectedAdditives = selectedAdditives.filter((btn) => btn !== e.target);
      }
      updatePrice();
    }
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  window.addEventListener('resize', () => {
    renderItems(menuDataGlobal, currentCategory);
  });
});
