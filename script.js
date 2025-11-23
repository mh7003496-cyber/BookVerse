let products = [];

function loadProducts() {
  fetch('products.json').then(r => {
    if (!r.ok) throw new Error('no json');
    return r.json();
  }).then(data => {
    const all = [];
    if (Array.isArray(data.categories)) {
      data.categories.forEach(cat => {
        const genreKey = (cat.name || '').toLowerCase();
        if (Array.isArray(cat.books)) {
          cat.books.forEach(b => {
            const book = {
              title: b.title || '',
              author: b.author || '',
              genre: genreKey,
              price: (b.priceValue || 0),
              priceText: b.price || '',
              image: b.image || ''
            };
            all.push(book);
          });
        }
      });
    }
    products = all;
    renderBookList();
    renderHomepageBooks();
  }).catch(() => {
    products = [];
    renderBookList();
    renderHomepageBooks();
  });
}

function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function escapeJs(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/'/g, "\\'");
}

function renderBookList() {
  const root = document.getElementById('bookList');
  if (!root) return;
  const select = document.getElementById('genreFilter');
  const g = select ? select.value : 'all';
  root.innerHTML = '';
  products.forEach(p => {
    const genreKey = (p.genre || '').toLowerCase();
    if (g === 'all' || genreKey.includes(g)) {
      const div = document.createElement('div');
      div.className = 'book-item';
      const imgHtml = p.image ? `<img src="${p.image}" alt="${escapeHtml(p.title)}">` : '';
      const titleEsc = escapeHtml(p.title);
      div.innerHTML = `<h3>${titleEsc}</h3><p>${escapeHtml(p.author)}</p><p>Price: $${p.price}</p>${imgHtml}<div style="margin-top:8px;"><button class="add-to-cart" data-title="${escapeJs(p.title)}">Add to Cart</button></div>`;
      root.appendChild(div);
    }
  });
}

function renderHomepageBooks() {
  const container = document.querySelector('.book-container, .books-section');
  if (!container) return;
  container.innerHTML = '';
  const slice = products.slice(0, 10);
  slice.forEach(p => {
    const card = document.createElement('div');
    card.className = 'book-card';
    const imgHtml = p.image ? `<img src="${p.image}" alt="${escapeHtml(p.title)}" class="book-image">` : '';
    card.innerHTML = `${imgHtml}<div class="book-title">${escapeHtml(p.title)}</div><div class="book-author">${escapeHtml(p.author)}</div><div class="book-price">$${p.price}</div><button class="add-to-cart" data-title="${escapeJs(p.title)}">Add to Cart</button>`;
    container.appendChild(card);
  });
}

document.addEventListener('change', function(e){
  if (e.target && e.target.id === 'genreFilter') renderBookList();
});

document.addEventListener('DOMContentLoaded', function(){
  loadProducts();
  initCart();
  bindSearch();
  startSlider();
  renderHomepageStatic(); 
});

function renderHomepageStatic() {
  const existingManual = document.querySelectorAll('.book-card img');
  if (existingManual.length > 0) {
    existingManual.forEach(imgEl => {
      imgEl.addEventListener('error', () => {
        imgEl.src = 'img/placeholder.png';
      });
    });
  }
}

function bindSearch(){
  const btn = document.getElementById('searchBtn');
  if (!btn) return;
  btn.addEventListener('click', function(){
    const qEl = document.getElementById('searchInput');
    const q = qEl ? qEl.value.toLowerCase().trim() : '';
    const root = document.getElementById('searchResults');
    if (!root) return;
    root.innerHTML = '';
    products.forEach(p => {
      if (p.title.toLowerCase().includes(q)) {
        const div = document.createElement('div');
        const img = p.image ? `<img src="${p.image}" alt="${escapeHtml(p.title)}" style="max-width:80px;height:100px;object-fit:cover;margin-right:10px;">` : '';
        div.className = 'book-item';
        div.innerHTML = `<h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.author)}</p><p>Price: $${p.price}</p>${img}<div style="margin-top:8px;"><button class="add-to-cart" data-title="${escapeJs(p.title)}">Add to Cart</button></div>`;
        root.appendChild(div);
      }
    });
  });
}

document.addEventListener('click', function(e){
  const t = e.target;
  if (t && t.matches('.add-to-cart')) {
    const title = t.dataset.title || (t.closest('.book-card') && t.closest('.book-card').querySelector('.book-title') ? t.closest('.book-card').querySelector('.book-title').textContent.trim() : '');
    if (title) addToCart(title);
  }
});

const CART_KEY = 'bookverse_cart_v1';
let cart = [];

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    cart = raw ? JSON.parse(raw) : [];
  } catch (e) {
    cart = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
  }
}

function findCartIndex(title) {
  return cart.findIndex(item => item.title === title);
}

function addToCart(title) {
  const idx = findCartIndex(title);
  if (idx >= 0) {
    cart[idx].qty += 1;
  } else {
    cart.push({ title: title, qty: 1 });
  }
  saveCart();
  renderCart();
  updateCartCount();
}

function changeQuantity(index, delta) {
  if (index < 0 || index >= cart.length) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
  updateCartCount();
}

function removeFromCart(index) {
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCart();
  renderCart();
  updateCartCount();
}

function updateCartCount() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  const total = cart.reduce((s, it) => s + it.qty, 0);
  badge.textContent = total;
}

function renderCart() {
  const el = document.getElementById('cartList');
  if (!el) return;
  el.innerHTML = '';
  if (cart.length === 0) {
    el.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  cart.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'cart-row';
    const title = escapeHtml(item.title);
    row.innerHTML = `<span style="font-weight:600">${title}</span><span style="margin-left:10px">Qty: <button class="cart-decr" data-i="${index}" aria-label="decrease">-</button><span class="cart-qty" data-i="${index}">${item.qty}</span><button class="cart-incr" data-i="${index}" aria-label="increase">+</button></span><button class="cart-remove" data-i="${index}" style="margin-left:12px;color:red;">Remove</button>`;
    el.appendChild(row);
  });
  el.querySelectorAll('.cart-decr').forEach(btn => {
    btn.addEventListener('click', function () {
      const i = Number(this.dataset.i);
      changeQuantity(i, -1);
    });
  });
  el.querySelectorAll('.cart-incr').forEach(btn => {
    btn.addEventListener('click', function () {
      const i = Number(this.dataset.i);
      changeQuantity(i, +1);
    });
  });
  el.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', function () {
      const i = Number(this.dataset.i);
      removeFromCart(i);
    });
  });
}

function initCart() {
  loadCart();
  renderCart();
  updateCartCount();
}

let sliderImages = ["img/crazysale.webp","img/palestine.webp"];
let currentindex = 0;
let sliderTimer = null;

function startSlider() {
  const slider = document.getElementById('image-slider');
  if (!slider) return;
  slider.src = sliderImages[currentindex];
  if (sliderTimer) clearInterval(sliderTimer);
  sliderTimer = setInterval(function(){
    currentindex = (currentindex + 1) % sliderImages.length;
    slider.src = sliderImages[currentindex];
  },3000);
}

