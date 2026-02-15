const iceCreams = Array.from({ length: 20 }, (_, i) => {
  const names = [
    "Sakura Dream", "Choco Lava", "Gelato Affogato", "Dragon Fruit Chill",
    "Matcha Surprise", "Blue Moon", "Kulfi Magic", "Raspberry Rose",
    "Thai Tea Crunch", "Belgian Waffle Swirl", "Cookie Butterstorm",
    "Mango Tango", "Turkish Delight", "Mint Avalanche",
    "Tiramisu Temptation", "Peanut Butter Jelly", "Bubblegum Pop",
    "Black Sesame Bomb", "Lavender Honey", "Coconut Bliss"
  ];

  const descs = [
    "Cherry blossom & mochi", "Fudge swirl with brownie", "Espresso pour-over",
    "Exotic refreshment", "Matcha & red bean", "Fruity mystery",
    "Saffron-pistachio", "Tangy & floral", "Tea & peanuts", "Waffle & chocolate",
    "Speculoos blast", "Alphonso + chili", "Rose creamy blend", "Mint chip remix",
    "Mascarpone heaven", "Classic combo", "Chewy nostalgia", "Nutty delight",
    "Floral & smooth", "Beachy cream"
  ];

  const prices = [220,180,240,210,230,200,190,220,210,230,200,180,220,190,240,210,180,200,230,190];

  return {
    name: names[i],
    desc: descs[i],
    price: prices[i],
    img: `images/ice${i + 1}.jpg`
  };
});

const menuGrid = document.getElementById("menu-grid");
const cartItems = document.getElementById("cart-items");
const cartSummary = document.getElementById("cart-summary");
const checkoutSummary = document.getElementById("checkout-summary");
const form = document.getElementById("payment-form");

let cart = JSON.parse(localStorage.getItem("sweetScoopsCart") || "[]");

function renderMenu() {
  menuGrid.innerHTML = "";
  iceCreams.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.id = `menu-item-${i}`;
    const existing = cart.find(c => c.name === item.name);

    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <p>${item.name}</p>
      <small>${item.desc}</small>
      <p>₹${item.price}</p>
      <div class="menu-actions">
        ${
          existing
            ? `<button onclick="decreaseQty(${i})">−</button>
               <span>${existing.qty}</span>
               <button onclick="increaseQty(${i})">+</button>
               <button onclick="removeFromMenu(${i})">❌</button>`
            : `<button onclick="addToCart(${i})">Add to Cart</button>`
        }
      </div>
    `;
    menuGrid.appendChild(div);
  });
}


function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyMsg = document.getElementById('empty-cart-msg');
  cartItemsContainer.innerHTML = '';
  cartSummary.innerHTML = '';

  if (cart.length === 0) {
    emptyMsg.style.display = 'block';
  } else {
    emptyMsg.style.display = 'none';

    let total = 0;
    cart.forEach((item, i) => {
      total += item.price * item.qty;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div><strong>${item.name}</strong> (₹${item.price})</div>
        <div>
          <button onclick="decreaseQty(${i})">−</button>
          ${item.qty}
          <button onclick="increaseQty(${i})">+</button>
          <button onclick="removeItem(${i})">❌</button>
        </div>
      `;
      cartItemsContainer.appendChild(div);
    });

    cartSummary.innerHTML = `
      <p><strong>Subtotal:</strong> ₹${total}</p>
      <button id="checkout-btn" onclick="goToCheckout()">Proceed to Checkout</button>
    `;
  }

  renderMenu();
  saveCart();

}



function addToCart(index) {
  const item = iceCreams[index];
  const existing = cart.find(c => c.name === item.name);
  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });
  renderCart();
  showToast(`Added ${item.name} to cart! 🍦`);
}

function increaseQty(i) {
  cart[i].qty++;
  renderCart();
}

function decreaseQty(i) {
  if (cart[i].qty > 1) cart[i].qty--;
  else cart.splice(i, 1);
  renderCart();
}

function removeItem(i) {
  showToast(`Removed ${cart[i].name} ❌`);
  cart.splice(i, 1);
  renderCart();
}

function removeFromMenu(i) {
  const item = iceCreams[i];
  cart = cart.filter(c => c.name !== item.name);
  renderCart();
}

function goToCheckout() {
  let total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  let gst = total * 0.05;
  let delivery = 30;
  let final = total + gst + delivery;
  checkoutSummary.innerHTML = `
    <p>Items: ₹${total.toFixed(2)}</p>
    <p>GST (5%): ₹${gst.toFixed(2)}</p>
    <p>Delivery: ₹${delivery}</p>
    <p><strong>Total: ₹${final.toFixed(2)}</strong></p>
  `;
  document.getElementById("checkout").scrollIntoView({ behavior: "smooth" });
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("🎉 Order placed!");
  cart = [];
  form.reset();
  renderCart();
  //fireConfetti();
});

function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}



function saveCart() {
  localStorage.setItem("sweetScoopsCart", JSON.stringify(cart));
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  renderMenu();
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});


window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav ul li a");

  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 110; // adjust for navbar height
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

function toggleMenu() {
  const menu = document.getElementById('nav-menu');
  menu.classList.toggle('show');
}

document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('nav-menu');
    menu.classList.remove('show');
  });
});
