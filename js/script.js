/* ==========================================================
   QuickBite - script.js
   One JavaScript file shared by every page.
   Each page only runs the code it needs: we first check
   whether the page has the HTML element we want to work on.

   Sections:
     1. Product data
     2. Small helper functions
     3. Cart functions (localStorage)
     4. Home & Menu page
     5. Cart & Checkout page
     6. Contact form
     7. Navigation menu, image fallback and page start-up
   ========================================================== */

'use strict';

/* ----------------------------------------------------------
   1. PRODUCT DATA
   Every food item is one object inside this array.
   To add a new dish, copy one object and change its values.
   ---------------------------------------------------------- */

// Builds a food photo link from a photo ID (photos come from unsplash.com)
function photo(id) {
  return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=600&q=80';
}

// Shown when a photo cannot be loaded (for example, no internet)
const FALLBACK_IMAGE = 'images/placeholder.svg';

const CATEGORY_LABELS = {
  pizza: 'Pizza',
  burgers: 'Burgers',
  indian: 'Indian',
  chinese: 'Chinese',
  drinks: 'Drinks'
};

const PRODUCTS = [
  // ----- Pizza -----
  { id: 1, name: 'Margherita Pizza', category: 'pizza', price: 249, veg: true, popular: true,
    desc: 'Classic tomato sauce, mozzarella and fresh basil on a hand-tossed base.',
    img: photo('1574071318508-1cdbab80d002') },
  { id: 2, name: 'Farmhouse Veg Pizza', category: 'pizza', price: 329, veg: true, popular: true,
    desc: 'Capsicum, onion, sweet corn, mushroom and olives with extra cheese.',
    img: photo('1513104890138-7c749659a591') },
  { id: 3, name: 'Paneer Tikka Pizza', category: 'pizza', price: 349, veg: true, popular: false,
    desc: 'Tandoori paneer cubes, onion and green chilli on a spicy tikka sauce.',
    img: photo('1565299624946-b28f40a0ae38') },
  { id: 4, name: 'Chicken Pepperoni Pizza', category: 'pizza', price: 399, veg: false, popular: false,
    desc: 'Chicken pepperoni slices layered over mozzarella and baked until crisp.',
    img: photo('1628840042765-356cda07504e') },

  // ----- Burgers -----
  { id: 5, name: 'Classic Veg Burger', category: 'burgers', price: 129, veg: true, popular: false,
    desc: 'Crispy aloo-veg patty with lettuce, tomato and our house mayo.',
    img: photo('1520072959219-c595dc870360') },
  { id: 6, name: 'Crispy Chicken Burger', category: 'burgers', price: 179, veg: false, popular: true,
    desc: 'Crunchy fried chicken fillet with lettuce and creamy peri-peri sauce.',
    img: photo('1568901346375-23c9450c58cd') },
  { id: 7, name: 'Double Cheese Chicken Burger', category: 'burgers', price: 219, veg: false, popular: false,
    desc: 'Two grilled chicken patties, melted cheddar and caramelised onions.',
    img: photo('1550547660-d9450f859349') },

  // ----- Indian -----
  { id: 8, name: 'Butter Chicken', category: 'indian', price: 299, veg: false, popular: true,
    desc: 'Tender chicken in a rich tomato-butter gravy. Served with two butter rotis.',
    img: photo('1603894584373-5ac82b2ae398') },
  { id: 9, name: 'Paneer Butter Masala', category: 'indian', price: 259, veg: true, popular: false,
    desc: 'Soft paneer cubes in a creamy, mildly spiced gravy. Served with two rotis.',
    img: photo('1631452180519-c014fe946bc7') },
  { id: 10, name: 'Chicken Biryani', category: 'indian', price: 279, veg: false, popular: false,
    desc: 'Long-grain basmati rice slow-cooked with spiced chicken. Comes with raita.',
    img: photo('1563379091339-03b21ab4a4f8') },
  { id: 11, name: 'Dal Makhani', category: 'indian', price: 199, veg: true, popular: false,
    desc: 'Black lentils simmered overnight with butter and cream. Served with jeera rice.',
    img: photo('1546833999-b9f581a1996d') },

  // ----- Chinese -----
  { id: 12, name: 'Veg Hakka Noodles', category: 'chinese', price: 169, veg: true, popular: false,
    desc: 'Wok-tossed noodles with cabbage, carrot, capsicum and soy sauce.',
    img: photo('1585032226651-759b368d7246') },
  { id: 13, name: 'Veg Manchurian', category: 'chinese', price: 189, veg: true, popular: false,
    desc: 'Crispy vegetable balls in a tangy garlic-soy gravy.',
    img: photo('1555126634-323283e090fa') },
  { id: 14, name: 'Chicken Momos (8 pcs)', category: 'chinese', price: 149, veg: false, popular: true,
    desc: 'Steamed dumplings stuffed with minced chicken, served with red chilli chutney.',
    img: photo('1534422298391-e4f8c172dddb') },
  { id: 15, name: 'Schezwan Fried Rice', category: 'chinese', price: 179, veg: true, popular: false,
    desc: 'Spicy fried rice tossed with vegetables and homemade schezwan sauce.',
    img: photo('1512058564366-18510be2db19') },

  // ----- Drinks -----
  { id: 16, name: 'Sweet Mango Lassi', category: 'drinks', price: 89, veg: true, popular: false,
    desc: 'Thick chilled yoghurt drink blended with ripe mango pulp.',
    img: photo('1553530666-ba11a7da3888') },
  { id: 17, name: 'Cold Coffee', category: 'drinks', price: 119, veg: true, popular: false,
    desc: 'Creamy iced coffee blended with milk and a scoop of vanilla ice cream.',
    img: photo('1461023058943-07fcbe16d735') },
  { id: 18, name: 'Fresh Lime Soda', category: 'drinks', price: 69, veg: true, popular: false,
    desc: 'Freshly squeezed lime with soda. Choose sweet or salted at delivery.',
    img: photo('1497534446932-c925b458314e') },
  { id: 19, name: 'Masala Chaas', category: 'drinks', price: 59, veg: true, popular: false,
    desc: 'Spiced buttermilk with roasted cumin, mint and coriander.',
    img: photo('1544145945-f90425340c7e') }
];

// Cart settings
const CART_KEY = 'quickbiteCart';   // name under which the cart is saved in the browser
const DELIVERY_FEE = 40;            // Rs. charged for small orders
const FREE_DELIVERY_ABOVE = 499;    // delivery is free at or above this subtotal
const MAX_QTY = 20;                 // highest quantity allowed per item


/* ----------------------------------------------------------
   2. SMALL HELPER FUNCTIONS
   ---------------------------------------------------------- */

// 1499 -> "₹1,499"
function formatPrice(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

// Find one product by its id
function getProduct(id) {
  return PRODUCTS.find(function (product) { return product.id === id; });
}

// Small message at the bottom of the screen (e.g. "Item added to cart")
let toastTimer;
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
}

// Checks one form field. Shows or clears its error message.
// Returns true when the value is valid, false when it is not.
function check(input, isValid, message) {
  const errorBox = document.getElementById(input.id + 'Error');
  if (isValid) {
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    if (errorBox) errorBox.textContent = '';
  } else {
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
    if (errorBox) errorBox.textContent = message;
  }
  return isValid;
}


/* ----------------------------------------------------------
   3. CART FUNCTIONS
   The cart is a list like [{ id: 1, qty: 2 }, { id: 8, qty: 1 }].
   We save it in localStorage so it survives a page refresh.
   ---------------------------------------------------------- */

function getCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    if (!Array.isArray(saved)) return [];
    // Keep only items that still exist in our product list
    return saved.filter(function (item) { return getProduct(item.id) && item.qty > 0; });
  } catch (error) {
    return [];   // storage blocked or data damaged: start with an empty cart
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    // If storage is blocked we simply cannot remember the cart
  }
  updateCartCount();
}

// Updates the number badge next to "Cart" in the navbar
function updateCartCount() {
  const total = getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
  document.querySelectorAll('.cart-count').forEach(function (badge) {
    badge.textContent = total;
  });
}

function addToCart(id) {
  const cart = getCart();
  const existing = cart.find(function (item) { return item.id === id; });

  if (existing) {
    if (existing.qty >= MAX_QTY) {
      showToast('You can order up to ' + MAX_QTY + ' of one item');
      return;
    }
    existing.qty += 1;
  } else {
    cart.push({ id: id, qty: 1 });
  }

  saveCart(cart);
  showToast(getProduct(id).name + ' added to cart');
}

// Works out subtotal, delivery fee and total
function calculateTotals() {
  const subtotal = getCart().reduce(function (sum, item) {
    return sum + getProduct(item.id).price * item.qty;
  }, 0);
  let delivery = DELIVERY_FEE;
  if (subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE) delivery = 0;
  return { subtotal: subtotal, delivery: delivery, total: subtotal + delivery };
}


/* ----------------------------------------------------------
   4. HOME & MENU PAGE
   ---------------------------------------------------------- */

// Builds the HTML for one food card
function createFoodCard(product) {
  const vegText = product.veg ? 'Vegetarian' : 'Non-vegetarian';
  return '' +
    '<article class="food-card">' +
      '<img src="' + product.img + '" alt="' + product.name + '" loading="lazy">' +
      '<div class="food-body">' +
        '<div class="food-meta">' +
          '<span class="veg-mark ' + (product.veg ? 'veg' : 'nonveg') + '" title="' + vegText + '"></span>' +
          '<span class="sr-only">' + vegText + '</span>' +
          '<span>' + CATEGORY_LABELS[product.category] + '</span>' +
        '</div>' +
        '<h3>' + product.name + '</h3>' +
        '<p>' + product.desc + '</p>' +
        '<div class="food-footer">' +
          '<span class="price">' + formatPrice(product.price) + '</span>' +
          '<button type="button" class="btn btn-small add-btn" data-id="' + product.id + '">Add to cart</button>' +
        '</div>' +
      '</div>' +
    '</article>';
}

// Home page: show the dishes marked popular: true (first four)
function initHomePage() {
  const grid = document.getElementById('popularGrid');
  if (!grid) return;
  const popular = PRODUCTS.filter(function (p) { return p.popular; }).slice(0, 4);
  grid.innerHTML = popular.map(createFoodCard).join('');
}

// Menu page: category buttons + search box
let activeCategory = 'all';
let searchText = '';

function renderMenu() {
  const grid = document.getElementById('menuGrid');
  const count = document.getElementById('resultCount');

  // Keep a product when it matches BOTH the category and the search text
  const visible = PRODUCTS.filter(function (product) {
    const categoryMatch = activeCategory === 'all' || product.category === activeCategory;
    const nameMatch = product.name.toLowerCase().includes(searchText);
    return categoryMatch && nameMatch;
  });

  if (visible.length === 0) {
    grid.innerHTML = '<p class="no-results">No dishes match your search. Try another name or choose "All".</p>';
    count.textContent = '0 dishes found';
    return;
  }

  grid.innerHTML = visible.map(createFoodCard).join('');
  count.textContent = visible.length + (visible.length === 1 ? ' dish' : ' dishes');
}

function initMenuPage() {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  const buttons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('searchInput');

  // Home page links like menu.html?category=pizza open the menu already filtered
  const urlCategory = new URLSearchParams(window.location.search).get('category');
  if (urlCategory && CATEGORY_LABELS[urlCategory]) activeCategory = urlCategory;

  function highlightButton() {
    buttons.forEach(function (btn) {
      const isActive = btn.dataset.category === activeCategory;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeCategory = btn.dataset.category;
      highlightButton();
      renderMenu();
    });
  });

  searchInput.addEventListener('input', function () {
    searchText = searchInput.value.trim().toLowerCase();
    renderMenu();
  });

  highlightButton();
  renderMenu();
}


/* ----------------------------------------------------------
   5. CART & CHECKOUT PAGE
   ---------------------------------------------------------- */

function renderCart() {
  const list = document.getElementById('cartItems');
  if (!list) return;

  const cart = getCart();
  const content = document.getElementById('cartContent');
  const emptyMessage = document.getElementById('cartEmpty');

  // Empty cart: show the friendly message and stop
  if (cart.length === 0) {
    content.hidden = true;
    emptyMessage.hidden = false;
    return;
  }
  content.hidden = false;
  emptyMessage.hidden = true;

  // One row per item in the cart
  list.innerHTML = cart.map(function (item) {
    const product = getProduct(item.id);
    return '' +
      '<li class="cart-item">' +
        '<img src="' + product.img + '" alt="' + product.name + '">' +
        '<div>' +
          '<h3>' + product.name + '</h3>' +
          '<p class="unit-price">' + formatPrice(product.price) + ' each</p>' +
        '</div>' +
        '<div class="qty-control">' +
          '<button type="button" data-action="decrease" data-id="' + item.id + '" aria-label="Decrease quantity of ' + product.name + '"' + (item.qty <= 1 ? ' disabled' : '') + '>-</button>' +
          '<span aria-live="polite">' + item.qty + '</span>' +
          '<button type="button" data-action="increase" data-id="' + item.id + '" aria-label="Increase quantity of ' + product.name + '"' + (item.qty >= MAX_QTY ? ' disabled' : '') + '>+</button>' +
        '</div>' +
        '<span class="line-total">' + formatPrice(product.price * item.qty) + '</span>' +
        '<button type="button" class="remove-btn" data-action="remove" data-id="' + item.id + '">Remove</button>' +
      '</li>';
  }).join('');

  // Bill summary
  const totals = calculateTotals();
  document.getElementById('subtotal').textContent = formatPrice(totals.subtotal);
  document.getElementById('delivery').textContent = totals.delivery === 0 ? 'Free' : formatPrice(totals.delivery);
  document.getElementById('total').textContent = formatPrice(totals.total);

  const note = document.getElementById('freeNote');
  if (totals.delivery === 0) {
    note.textContent = 'You get free delivery on this order.';
  } else {
    note.textContent = 'Add ' + formatPrice(FREE_DELIVERY_ABOVE - totals.subtotal) + ' more for free delivery.';
  }
}

// Handles the +, - and Remove buttons
function changeCart(action, id) {
  let cart = getCart();
  const item = cart.find(function (entry) { return entry.id === id; });
  if (!item) return;

  if (action === 'increase' && item.qty < MAX_QTY) item.qty += 1;
  if (action === 'decrease' && item.qty > 1) item.qty -= 1;
  if (action === 'remove') {
    cart = cart.filter(function (entry) { return entry.id !== id; });
  }

  saveCart(cart);
  renderCart();
}

// Validates the checkout form. Returns true only if every field is correct.
function validateCheckout(form) {
  const name = form.elements.customerName;
  const phone = form.elements.customerPhone;
  const address = form.elements.customerAddress;

  // Run every check (no early exit) so all errors show at once
  const results = [
    check(name, /^[A-Za-z][A-Za-z .'-]{2,}$/.test(name.value.trim()),
      'Enter your full name (letters only, at least 3 characters).'),
    check(phone, /^[6-9]\d{9}$/.test(phone.value.replace(/\s+/g, '')),
      'Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.'),
    check(address, address.value.trim().length >= 10,
      'Enter your full delivery address (at least 10 characters).')
  ];
  return results.every(Boolean);
}

function placeOrder(form) {
  // Random order ID such as QB482913
  const orderId = 'QB' + Math.floor(100000 + Math.random() * 900000);
  const totals = calculateTotals();
  const payment = form.elements.payment.value;

  // textContent (not innerHTML) keeps whatever the customer typed safe
  document.getElementById('confName').textContent = form.elements.customerName.value.trim();
  document.getElementById('confId').textContent = orderId;
  document.getElementById('confTotal').textContent = formatPrice(totals.total);
  document.getElementById('confPayment').textContent = payment;
  document.getElementById('confAddress').textContent = form.elements.customerAddress.value.trim();

  // Clear the cart, hide the cart screen and show the confirmation
  saveCart([]);
  document.getElementById('cartContent').hidden = true;
  document.getElementById('cartEmpty').hidden = true;
  document.getElementById('orderConfirmation').hidden = false;
  document.getElementById('cartHeading').textContent = 'Order placed';
  window.scrollTo({ top: 0 });
}

function initCartPage() {
  const list = document.getElementById('cartItems');
  if (!list) return;

  renderCart();

  // One listener on the list handles every +, - and Remove button (event delegation)
  list.addEventListener('click', function (event) {
    const button = event.target.closest('button[data-action]');
    if (button) changeCart(button.dataset.action, Number(button.dataset.id));
  });

  // "Proceed to checkout" reveals the details form
  const checkoutSection = document.getElementById('checkoutSection');
  document.getElementById('checkoutBtn').addEventListener('click', function () {
    checkoutSection.hidden = false;
    checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('customerName').focus({ preventScroll: true });
  });

  const form = document.getElementById('checkoutForm');
  form.addEventListener('submit', function (event) {
    event.preventDefault();               // stop the page from reloading
    if (getCart().length === 0) return;   // nothing to order
    if (validateCheckout(form)) placeOrder(form);
  });

  // Remove the red error as soon as the customer starts typing again
  form.querySelectorAll('input[type="text"], input[type="tel"], textarea').forEach(function (field) {
    field.addEventListener('input', function () { check(field, true, ''); });
  });
}


/* ----------------------------------------------------------
   6. CONTACT FORM (demo only - nothing is actually sent)
   ---------------------------------------------------------- */

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successBox = document.getElementById('formSuccess');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    successBox.hidden = true;

    const name = form.elements.name;
    const email = form.elements.email;
    const subject = form.elements.subject;
    const message = form.elements.message;

    const results = [
      check(name, name.value.trim().length >= 3, 'Please enter your name (at least 3 characters).'),
      check(email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()), 'Please enter a valid email address, like name@example.com.'),
      check(subject, subject.value.trim().length >= 3, 'Please enter a subject (at least 3 characters).'),
      check(message, message.value.trim().length >= 10, 'Your message should be at least 10 characters.')
    ];

    if (results.every(Boolean)) {
      successBox.textContent = 'Thank you, ' + name.value.trim() + '. Your message has been received. We will reply within one working day.';
      successBox.hidden = false;
      form.reset();
    }
  });

  form.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('input', function () { check(field, true, ''); });
  });
}


/* ----------------------------------------------------------
   7. NAVIGATION MENU, IMAGE FALLBACK AND PAGE START-UP
   ---------------------------------------------------------- */

// Hamburger button on small screens
function initNavigation() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
}

// If any food photo fails to load, show the local placeholder instead
function useFallbackImage(img) {
  if (img.dataset.fallbackUsed) return;   // avoid an endless loop
  img.dataset.fallbackUsed = 'true';
  img.src = FALLBACK_IMAGE;
}

// Catches photos that fail while the page is loading
document.addEventListener('error', function (event) {
  if (event.target.tagName === 'IMG') useFallbackImage(event.target);
}, true);

// Add-to-cart buttons appear on the home page and menu page.
// Cards are created by JavaScript, so we listen on the whole document.
document.addEventListener('click', function (event) {
  const button = event.target.closest('.add-btn');
  if (button) addToCart(Number(button.dataset.id));
});

// Everything starts here once the HTML has loaded
document.addEventListener('DOMContentLoaded', function () {
  initNavigation();
  initHomePage();
  initMenuPage();
  initCartPage();
  initContactForm();
  updateCartCount();

  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Photos that already failed before this script ran
  document.querySelectorAll('img').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) useFallbackImage(img);
  });
});
