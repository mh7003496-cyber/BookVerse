let products = [];

function loadProducts() {
  fetch("products.json")
    .then(r => r.json())
    .then(data => {
      let all = [];
      data.categories.forEach(cat => {
        let genreKey = (cat.name || "").toLowerCase();
        cat.books.forEach(b => {
          all.push({
            title: b.title,
            author: b.author,
            genre: genreKey,
            price: b.priceValue,
            priceText: b.price,
            image: b.image
          });
        });
      });
      products = all;
      renderBookList();
      renderHomepageBooks();
    });
}
function escapeHtml(s) {
  return s.replace(/</g, "&lt;");
}
function renderBookList() {
  const root = document.getElementById("bookList");
  if (!root) return;
  const genre = document.getElementById("genreFilter").value;
  root.innerHTML = "";
  products.forEach(p => {
    if (genre === "all" || p.genre.includes(genre)) {
      let div = document.createElement("div");
      div.className = "book-item";

      div.innerHTML = `
        <h3>${escapeHtml(p.title)}</h3>
        <p>${p.author}</p>
        <p>Price: $${p.price}</p>
        <img src="${p.image}" alt="${p.title}">
        <button class="add-to-cart" data-title="${p.title}">Add to Cart</button>
      `;
      root.appendChild(div);
    }
  });
}

function renderHomepageBooks() {
  const container =
      document.querySelector(".book-container")
   || document.querySelector(".books-section");

  if (!container) return;
  container.innerHTML = "";
  const firstTen = products.slice(0, 10);
  firstTen.forEach(p => {
    let card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${p.image}">
      <div class="book-title">${escapeHtml(p.title)}</div>
      <button class="add-to-cart" data-title="${p.title}">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}
document.addEventListener("change", e => {
  if (e.target.id === "genreFilter") renderBookList();
});
function bindSearch() {
  const btn = document.getElementById("searchBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const q = document.getElementById("searchInput").value.toLowerCase();
    const root = document.getElementById("searchResults");
    root.innerHTML = "";
    products.forEach(p => {
      if (p.title.toLowerCase().includes(q)) {
        let div = document.createElement("div");
        div.className = "book-item";
        div.innerHTML = `
          <h3>${escapeHtml(p.title)}</h3>
          <p>${p.author}</p>
          <p>Price: $${p.price}</p>
          <img src="${p.image}">
          <button class="add-to-cart" data-title="${p.title}">Add to Cart</button>
        `;
        root.appendChild(div);
      }
    });
  });
}

let cart = [];
const CART_KEY = "bookverse_cart_v1";
function loadCart() {
  const saved = localStorage.getItem(CART_KEY);
  cart = saved ? JSON.parse(saved) : [];
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function renderCart() {
  const list = document.getElementById("cartList");
  if (!list) return;
  list.innerHTML = "";
  if (cart.length === 0) {
    list.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }
  cart.forEach((item, i) => {
    list.innerHTML += `
      <div>
        ${item.title} — Qty: ${item.qty}
        <button onclick="changeQty(${i},1)">+</button>
        <button onclick="changeQty(${i},-1)">-</button>
      </div>
    `;
  });
}
function changeQty(i, amount) {
  cart[i].qty += amount;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveCart();
  renderCart();
}
function addToCart(title) {
  let found = cart.find(c => c.title === title);
  if (found) found.qty++;
  else cart.push({ title, qty: 1 });
  saveCart();
  renderCart();
}
document.addEventListener("click", e => {
  if (e.target.classList.contains("add-to-cart")) {
    addToCart(e.target.dataset.title);
  }
});
let sliderImages = [
  "img/crazysale.webp",
  "img/palestine.webp"
];
let slideIndex = 0;
function startSlider() {
  const slider = document.getElementById("image-slider");
  if (!slider) return;
  setInterval(() => {
    slideIndex = (slideIndex + 1) % sliderImages.length;
    slider.src = sliderImages[slideIndex];
  }, 3000);
}
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadCart();
  renderCart();
  bindSearch();
  startSlider();
});

