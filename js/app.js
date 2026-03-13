import { products } from "./products.js";

const productsGrid = document.querySelector("#productsGrid");
const cartCountEl = document.querySelector(".cart-count");
const cartItemsContainer = document.querySelector(".cart-items");
const totalElement = document.querySelector(".total strong");
const cartIcon = document.querySelector(".cart-icon");
const cartSidebar = document.querySelector(".cart-sidebar");

// 1) Load cart from localStorage (or empty)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderProducts(list) {
  productsGrid.innerHTML = list
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p class="price">$${product.price.toFixed(2)}</p>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </article>
      `
    )
    .join("");
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = totalItems;
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart">Your cart is empty.</p>';
    totalElement.textContent = "$0.00";
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" class="cart-item-img" alt="${item.name}" />
          <div class="cart-item-info">
            <p>${item.name}</p>
            <p>$${item.price.toFixed(2)}</p>
            <div class="qty-controls">
              <button class="decrease" data-id="${item.id}">-</button>
              <span>${item.qty}</span>
              <button class="increase" data-id="${item.id}">+</button>
              <button class="remove" data-id="${item.id}">x</button>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalElement.textContent = `$${total.toFixed(2)}`;
}

function addToCart(productId) {
  const id = Number(productId);
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) existingItem.qty += 1;
  else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
    });
  }

  updateCartCount();
  saveCart();
  renderCart();
}

function increaseQty(id) {
  const item = cart.find((i) => i.id === Number(id));
  if (!item) return;

  item.qty += 1;

  updateCartCount();
  saveCart();
  renderCart();
}

function decreaseQty(id) {
  const item = cart.find((i) => i.id === Number(id));
  if (!item) return;

  item.qty -= 1;

  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== Number(id));
  }

  updateCartCount();
  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== Number(id));

  updateCartCount();
  saveCart();
  renderCart();
}

// Add to cart (delegation)
productsGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart");
  if (!btn) return;
  addToCart(btn.dataset.id);
});

// Cart buttons (+ / - / x) delegation
cartItemsContainer.addEventListener("click", (e) => {
  const inc = e.target.closest(".increase");
  const dec = e.target.closest(".decrease");
  const rem = e.target.closest(".remove");

  if (inc) return increaseQty(inc.dataset.id);
  if (dec) return decreaseQty(dec.dataset.id);
  if (rem) return removeItem(rem.dataset.id);
});

// Open/close sidebar
cartIcon.addEventListener("click", () => {
  cartSidebar.classList.toggle("active");
});

// Init
renderProducts(products);
updateCartCount();
renderCart();

// Debug rápido (puedes borrar luego)
console.log("Loaded cart from localStorage:", cart);