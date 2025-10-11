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

  let currentItem = null;
  let basePrice = 0;
  let selectedAdditives = [];

  fetch('./data/products.json')
    .then((res) => res.json())
    .then((data) => {
      renderItems(data, 'coffee');

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          buttons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          renderItems(data, btn.dataset.category);
        });
      });

      menuItemsContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.menu-card');
        if (!card) return;

        const itemName = card.querySelector('h3').textContent;
        const itemData = data.find((i) => i.name === itemName);

        if (itemData) openModal(itemData);
      });

      function renderItems(menuData, category) {
        const filtered = menuData.filter((item) => item.category === category);

        menuItemsContainer.innerHTML = filtered
          .map(
            (item) => `
            <div class="menu-card">
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
      }
    })
    .catch((err) => console.error('Error loading menu:', err));

  function openModal(item) {
    currentItem = item;
    basePrice = parseFloat(item.price);
    selectedAdditives = [];

    modalImg.src = `./assets/images/${item.image}`;
    modalName.textContent = item.name;
    modalDesc.textContent = item.description;
    modal.classList.add('active');

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
        (add) => `
          <button data-additive="${add.name}" data-price="${add['add-price']}">
            ${add.name} (+$${add['add-price']})
          </button>
        `
      )
      .join('');

    updatePrice();
  }

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
});
