
import { MenuItem, CartItem, CartSize, CartExtra } from "../types/types";
import { addToCart } from "./cart";
import "../scss/_menu.scss";

const API_BASE = "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com";
const FALLBACK_JSON = "/data/images.json";

const CARDS_CONTAINER_ID = "menu-items";
const LOAD_MORE_BTN_ID = "loadMoreBtn";
const CATEGORY_BTN_SELECTOR = ".menu-btn";
const MODAL_ID = "item-modal";
const CART_COUNT_SELECTOR = ".cart-count";

const CART_KEY = "coffee_cart_v1";
const ITEMS_TO_SHOW = 4;

let currentCategory: string = "coffee";
let displayedCount: number = ITEMS_TO_SHOW;
let menuDataGlobal: MenuItem[] = [];
const token = localStorage.getItem("access_token");
const userIsLoggedIn: boolean = !!token;

const menuItemsContainer = document.getElementById(CARDS_CONTAINER_ID);
const loadMoreBtn = document.getElementById(LOAD_MORE_BTN_ID) as HTMLButtonElement | null;
const categoryButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(CATEGORY_BTN_SELECTOR));
const modal = document.getElementById(MODAL_ID);
const cartCountNode = document.querySelector<HTMLSpanElement>(CART_COUNT_SELECTOR);


function formatPrice(val: number): string {
  return val.toFixed(2);
}

function escapeHtml(str: string | undefined): string {
  if (!str) return "";
  return str.replace(/[&<>"'`=/]/g, (s) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[s] ?? s)
  );
}

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCountUI();
}

function updateCartCountUI(): void {
  const cart = readCart();
  const totalItems = cart.reduce((s, it) => s + it.quantity, 0);
  if (cartCountNode) cartCountNode.textContent = String(totalItems);
}

function createLoader(): HTMLElement {
  const div = document.createElement("div");
  div.className = "cards-loader";
  div.textContent = "Loading...";
  return div;
}

function createErrorNode(msg: string): HTMLElement {
  const p = document.createElement("p");
  p.className = "cards-error";
  p.textContent = msg;
  return p;
}

function showTopNotification(message: string, duration = 4000): void {
  const existing = document.querySelector(".top-notification");
  if (existing) existing.remove();
  const div = document.createElement("div");
  div.className = "top-notification";
  div.textContent = message;
  document.body.prepend(div);
  setTimeout(() => div.remove(), duration);
}

async function fetchProductsFromBackend(retries = 3): Promise<MenuItem[]> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${API_BASE}/products`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Backend error ${res.status}`);
      const json = await res.json();
      return Array.isArray(json) ? json : json.data ?? [];
    } catch (err) {
      showTopNotification("Something went wrong");
    }

  }

  try {
    const fallbackRes = await fetch(FALLBACK_JSON, { cache: "no-store" });
    const fallbackJson = await fallbackRes.json();
    return fallbackJson as MenuItem[];
  } catch {
    return [];
  }
}

async function fetchProductById(id: string): Promise<MenuItem> {
  try {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return (json.data ?? json) as MenuItem;
    }
  } catch (_err) {
    showTopNotification("Something went wrong");
  }
  const found = menuDataGlobal.find((m) => String(m.id) === String(id) || m.name === id);
  if (!found) throw new Error("Product not found");
  return found;
}

function renderCards(menuData: MenuItem[], category: string): void {
  currentCategory = category;
  displayedCount = ITEMS_TO_SHOW;

  const filtered = menuData.filter((it) => it.category === category);
  if (!menuItemsContainer) return;

  menuItemsContainer.innerHTML = filtered
    .map((item, idx) => {
      const hideStyle = window.innerWidth <= 768 && idx >= ITEMS_TO_SHOW ? "display:none;" : "";
      const imgSrc = item.image ? `/assets/images/${item.image}` : "/assets/images/placeholder.png";

      let finalPrice = Number(item.price);
      let discountPrice: number | undefined;

      if (userIsLoggedIn) {
        const firstSize = item.sizes ? Object.values(item.sizes)[0] : undefined;
        if (firstSize && "discountPrice" in firstSize && firstSize.discountPrice) {
          discountPrice = Number(firstSize.discountPrice);
        }
        if (!discountPrice && item.discountPrice) discountPrice = Number(item.discountPrice);
      }

      const priceHtml = discountPrice && discountPrice < finalPrice
        ? `<span class="original-price" style="text-decoration: line-through;">$${formatPrice(finalPrice)}</span>
           <span class="discount-price">$${formatPrice(discountPrice)}</span>`
        : `<span class="price">$${formatPrice(finalPrice)}</span>`;

      return `
      <div class="menu-card" data-id="${item.id ?? ""}" style="${hideStyle}">
        <img src="${imgSrc}" alt="${escapeHtml(item.name)}" />
        <div class="menu-info">
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <div class="prices">${priceHtml}</div>
        </div>
      </div>`;
    })
    .join("");

  if (loadMoreBtn) {
    loadMoreBtn.style.display =
      filtered.length > ITEMS_TO_SHOW && window.innerWidth <= 768 ? "block" : "none";
  }
}

function attachCardClickListeners(): void {
  menuItemsContainer?.addEventListener("click", (e) => {
    const card = (e.target as HTMLElement).closest(".menu-card") as HTMLElement | null;
    if (!card) return;
    const id = card.dataset.id ?? card.querySelector("h3")?.textContent ?? "";
    openModalForProduct(id);
  });
}

async function openModalForProduct(id: string): Promise<void> {
  if (!modal) return;
  modal.classList.add("active");
  modal.innerHTML = "<div class=\"modal-overlay\"><div class=\"modal-loader\">Loading...</div></div>";

  let item: MenuItem | null = null;
  try {
    item = await fetchProductById(id);
  } catch (err) {
    modal.innerHTML = "";
    showTopNotification("Something went wrong. Please, try again");
    return;
  }

  const basePrice = Number(item.price) || 0;
  const sizesMap = item.sizes ?? { s: { size: "200 ml", price: basePrice } };
  const additives = item.additives ?? [];

  const sizesHtml = Object.entries(sizesMap)
    .map(([key, s], idx) => {
      const tooltip = userIsLoggedIn && (s).discountPrice
        ? `Was $${formatPrice(Number(s.price))}, now $${formatPrice(Number((s).discountPrice))}`
        : `$${formatPrice(Number(s.price))}`;
      return `
        <button class="size-btn ${idx === 0 ? "active" : ""}" 
          data-key="${escapeHtml(key)}" 
          data-price="${Number(s.price)}" title="${tooltip}">
          ${escapeHtml(key.toUpperCase())} (${escapeHtml(s.size)})</button>`;
    })
    .join("");

  const additivesHtml = additives.length
    ? additives
      .map(
        (a, idx) => {
          const tooltip = userIsLoggedIn && a.discountPrice
            ? `Was $${formatPrice(Number(a.price))}, now $${formatPrice(Number(a.discountPrice))}`
            : `$${formatPrice(Number(a.price))}`;
          return `
          <button class="add-btn" data-name="${escapeHtml(a.name)}" data-price="${Number(a.price)}" title="${tooltip}">
            <span class="number">${idx + 1}</span> ${escapeHtml(a.name)}
          </button>`;
        }
      )
      .join("")
    : "<span class=\"no-additives\">No additives available</span>";

  let imgSrc = "/assets/images/placeholder.png";
  if (item.image) imgSrc = `/assets/images/${item.image}`;
  else {
    try {
      const fallbackData = await fetch(FALLBACK_JSON).then((r) => r.json());
      const match = fallbackData.find(
        (img: { name: string }) => img.name.toLowerCase() === item.name.toLowerCase()
      );
      if (match?.image) imgSrc = `/assets/images/${match.image}`;
    } catch (_err) {
      showTopNotification("Something went wrong");
    }
  }

  modal.innerHTML = `
  <div class="modal-content">
    <div class="modal-header">
      <button class="modal-close-btn" aria-label="Close">&times;</button>
    </div>
    <div class="modal-body">
      <img id="modal-img" src="${imgSrc}" alt="${escapeHtml(item.name)}" />
      <div class="modal-info">
        <h2>${escapeHtml(item.name)}</h2>
        <p>${escapeHtml(item.description)}</p>
        <div class="modal-info">
            <h2 id="modal-name"></h2>
            <p id="modal-desc" class="description"></p>

            <div class="modal-section">
  <h4>Size</h4>
  <div id="size-options" class="options">${sizesHtml}</div>
</div>

<div class="modal-section">
  <h4>Additives</h4>
  <div id="additive-options" class="options">${additivesHtml}</div>
</div>


            <div class="price-section">
  <span>Total: </span>
  <span>$<span id="modal-price">${formatPrice(basePrice)}</span></span>
</div>

            </div>

        <div class="modal-actions">
          <button class="modal-add-to-cart">Add to cart</button>
        </div>
      </div>
    </div>
  </div>`;

  setupModalInteractivity(item, basePrice);
}

function setupModalInteractivity(item: MenuItem, basePrice: number): void {
  if (!modal) return;
  const modalPriceNode = modal.querySelector("#modal-price") as HTMLElement;
  const sizeOptionsEl = modal.querySelector("#size-options")!;
  const additiveOptionsEl = modal.querySelector("#additive-options")!;
  const addToCartBtn = modal.querySelector(".modal-add-to-cart") as HTMLButtonElement;
  const closeBtn = modal.querySelector(".modal-close-btn") as HTMLButtonElement;

  const sizesMap = item.sizes ?? {};
  const additives = item.additives ?? [];

  let selectedSizeKey: string | null = Object.keys(sizesMap)[0] ?? null;
  const selectedExtras = new Set<string>();

  const computePrice = (): number => {
    let currentPrice = 0;

    if (selectedSizeKey && sizesMap[selectedSizeKey]) {
      const size = sizesMap[selectedSizeKey];
      currentPrice = userIsLoggedIn && (size).discountPrice
        ? Number((size).discountPrice)
        : Number(size.price) || basePrice;
    } else {
      currentPrice = userIsLoggedIn && (item).discountPrice
        ? Number((item).discountPrice)
        : basePrice;
    }

    const extrasPrice = Array.from(selectedExtras).reduce((sum, name) => {
      const found = additives.find((a) => a.name === name);
      if (!found) return sum;
      const extraPrice = userIsLoggedIn && found.discountPrice
        ? Number(found.discountPrice)
        : Number(found.price);
      return sum + extraPrice;
    }, 0);

    return currentPrice + extrasPrice;
  };

  const updatePrice = (): void => {
    if (!modalPriceNode) return;

    let base: number;
    let discount: number | undefined;

    if (selectedSizeKey && sizesMap[selectedSizeKey]) {
      const size = sizesMap[selectedSizeKey];
      base = Number(size.price) || basePrice;
      if (userIsLoggedIn && (size).discountPrice) discount = Number((size).discountPrice);
    } else {
      base = basePrice;
      if (userIsLoggedIn && item.discountPrice) discount = Number(item.discountPrice);
    }

    const extrasPrice = Array.from(selectedExtras).reduce((sum, name) => {
      const found = additives.find((a) => a.name === name);
      if (!found) return sum;
      const extraPrice = Number(found.price);
      const extraDiscount = userIsLoggedIn && found.discountPrice ? Number(found.discountPrice) : undefined;
      return sum + (extraDiscount ?? extraPrice);
    }, 0);

    const finalPrice = (discount ?? base) + extrasPrice;

    if (discount && discount < base) {
      modalPriceNode.innerHTML = `
      <span class="original-price" style="text-decoration: line-through;">$${formatPrice(base + extrasPrice)}</span>
      <span class="discount-price">$${formatPrice(finalPrice)}</span>
    `;
    } else {
      modalPriceNode.textContent = formatPrice(finalPrice);
    }
  };


  // Initialize correct starting price
  updatePrice();

  sizeOptionsEl.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest(".size-btn") as HTMLButtonElement | null;
    if (!btn) return;
    sizeOptionsEl.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedSizeKey = btn.dataset.key ?? null;
    updatePrice();
  });

  additiveOptionsEl.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest(".add-btn") as HTMLButtonElement | null;
    if (!btn) return;
    const name = btn.dataset.name ?? "";
    btn.classList.toggle("active");
    if (btn.classList.contains("active")) selectedExtras.add(name);
    else selectedExtras.delete(name);
    updatePrice();
  });

  addToCartBtn.addEventListener("click", async () => {
    if (!item.image) {
      const match = menuDataGlobal.find(m => m.name === item.name || m.id === item.id);
      if (match?.image) item.image = match.image;
    }

    const selectedSize: CartSize = {
      key: selectedSizeKey ?? "s",
      label: selectedSizeKey?.toUpperCase() ?? "S",
      addPrice: selectedSizeKey ? Number(sizesMap[selectedSizeKey]?.price) || 0 : 0,
    };

    const extrasArr: CartExtra[] = Array.from(selectedExtras).map((nm) => {
      const found = additives.find((a) => a.name === nm)!;
      return { name: found.name, price: Number(found.price) || 0 };
    });

    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      image: item.image || "placeholder.png",
      basePrice,
      discountPrice: userIsLoggedIn
        ? selectedSizeKey && sizesMap[selectedSizeKey]?.discountPrice
          ? Number(sizesMap[selectedSizeKey]?.discountPrice)
          : item.discountPrice
            ? Number(item.discountPrice)
            : undefined
        : undefined,
      size: selectedSize,
      extras: extrasArr.map(e => ({
        ...e,
        price: Number(e.price),
        discountPrice: userIsLoggedIn
          ? additives.find(a => a.name === e.name)?.discountPrice
            ? Number(additives.find(a => a.name === e.name)?.discountPrice)
            : undefined
          : undefined
      })),
      quantity: 1,
      totalPrice: computePrice(),
    };


    addToCart(cartItem);
    closeModal();
  });

  closeBtn.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  modal.addEventListener("click", (e) => {
    const content = modal.querySelector(".modal-content");
    if (content && !content.contains(e.target as Node)) closeModal();
  });
}

function closeModal(): void {
  if (!modal) return;
  modal.classList.remove("active");
  modal.innerHTML = "";
}

function attachCategoryButtons(): void {
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderCards(menuDataGlobal, btn.dataset.category ?? "coffee");
    });
  });
}

export async function initMenuPage(): Promise<void> {
  if (!menuItemsContainer) return;
  const loader = createLoader();
  menuItemsContainer.replaceChildren(loader);

  try {
    const backendProducts = await fetchProductsFromBackend();
    const imgRes = await fetch(FALLBACK_JSON, { cache: "no-store" });
    const imagesData = await imgRes.json();

    menuDataGlobal = backendProducts.map((product) => {
      const matchedImage = imagesData.find(
        (img: { name: string }) => img.name.toLowerCase() === product.name.toLowerCase()
      );
      return { ...product, image: matchedImage ? matchedImage.image : "placeholder.png" };
    });

    renderCards(menuDataGlobal, "coffee");
    attachCardClickListeners();
    attachCategoryButtons();
    updateCartCountUI();

    loader.remove();

    loadMoreBtn?.addEventListener("click", () => {
      const cards = menuItemsContainer.querySelectorAll<HTMLElement>(".menu-card");
      cards.forEach((card, idx) => {
        if (idx < displayedCount + ITEMS_TO_SHOW) card.style.display = "block";
      });
      displayedCount += ITEMS_TO_SHOW;
      if (displayedCount >= cards.length) loadMoreBtn!.style.display = "none";
    });
  } catch {
    menuItemsContainer.replaceChildren(createErrorNode("Something went wrong. Please, refresh the page"));
  }
}

initMenuPage().catch((err) => console.error("initMenuPage error", err));
