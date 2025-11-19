
let books = [
  { title: "Harry Potter", genre: "fantasy", price: 15 },             
  { title: "Atomic Habits", genre: "history", price: 20 },
  { title: "The Hobbit", genre: "fantasy", price: 18 },

  // Homepage books
  { title: "To Kill a Mockingbird", genre: "fiction", price: 14 },
  { title: "1984", genre: "fiction", price: 13 },
  { title: "Pride and Prejudice", genre: "romance", price: 12 },
  { title: "The Catcher in the Rye", genre: "fiction", price: 10 }
];

// ========== DISPLAY BOOKS (BOOKSTORE PAGE) ==========
function showBooks() {
  if (!$("#bookList").length) return;

  let f = $("#genreFilter").val();
  $("#bookList").html("");

  books.forEach(b => {
    if (f === "all" || f === b.genre) {
      $("#bookList").append(`
        <div class="book-item">
          <h3>${b.title}</h3>
          <p>Genre: ${b.genre}</p>
          <p>Price: $${b.price}</p>
          <button onclick="addToCart('${b.title}')">Add to Cart</button>
        </div>
      `);
    }
  });
}

$(document).on("change", "#genreFilter", showBooks);
$(document).ready(showBooks);

// ========== CART SYSTEM ==========
let cart = {};

function addToCart(title) {
  cart[title] = (cart[title] || 0) + 1;
  updateCart();
}

function updateCart() {
  if (!$("#cartList").length) return;

  $("#cartList").html("");
  for (let item in cart) {
    $("#cartList").append(`
      <div>${item} — Quantity: ${cart[item]}</div>
    `);
  }
}

// ========== HOMEPAGE ADD-TO-CART BUTTONS ==========
$(document).ready(function () {
  $(".book-card .add-to-cart").click(function () {
      let title = $(this).siblings(".book-title").text();
      addToCart(title);
  });
});

// ========== SEARCH PAGE ==========
$("#searchBtn").click(function () {
  if (!$("#searchResults").length) return;

  let q = $("#searchInput").val().toLowerCase();
  $("#searchResults").html("");

  books.forEach(b => {
    if (b.title.toLowerCase().includes(q)) {
      $("#searchResults").append(`
        <div class="book-item">
            <h3>${b.title}</h3>
            <p>Genre: ${b.genre}</p>
            <p>Price: $${b.price}</p>
            <button onclick="addToCart('${b.title}')">Add to Cart</button>
        </div>
      `);
    }
  });
});

// ========== SLIDER (HOMEPAGE) ==========
let image = ["img/crazysale.webp", "img/palestine.webp"];
let currentindex = 0;

function updateimage() {
  const slider = document.getElementById("image-slider");
  currentindex = (currentindex + 1) % image.length;
  slider.src = image[currentindex];
}

setInterval(updateimage, 3000);