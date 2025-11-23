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
  }).catch(() => {
    products = [];
    renderBookList();
  });
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
      div.innerHTML = `<h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.author)}</p><p>Price: $${p.price}</p>${imgHtml}<div style="margin-top:8px;"><button onclick="addToCart('${escapeJs(p.title)}')">Add to Cart</button></div>`;
      root.appendChild(div);
    }
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

document.addEventListener('change', function(e){
  if (e.target && e.target.id === 'genreFilter') renderBookList();
});

document.addEventListener('DOMContentLoaded', function(){
  loadProducts();
  bindHomepageAddButtons();
  bindSearch();
  updateCart();
  startSlider();
});
let cart = [];

// Add item to cart (shows duplicates separately)
function addToCart(title) {
  cart.push(title);
  updateCart();
}

// Remove one item from the cart (by index)
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Display cart items
function updateCart() {
  const el = document.getElementById('cartList');
  if (!el) return;
  el.innerHTML = '';

  if (cart.length === 0) {
    el.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      ${escapeHtml(item)}
      <button onclick="removeFromCart(${index})" style="margin-left:10px;color:red;">
        Remove
      </button>
    `;
    el.appendChild(div);
  });
}
