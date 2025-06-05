// Hamburger menu
function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

// Cart functionality
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function removeFromCart(productId) {
    if (confirm("Are you sure you want to remove this item from the cart?")) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cartItems || !cartTotal || !cartCount) return;

    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const li = document.createElement("li");
        li.innerHTML = `
            ${item.title} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
            <button onclick="removeFromCart('${item.id}')">Remove</button>
        `;
        cartItems.appendChild(li);
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = count;
}

function toggleCart() {
    document.getElementById("cart-dropdown").classList.toggle("hidden");
}

window.addEventListener("DOMContentLoaded", () => {
    const loadingIndicator = document.createElement("div");
    loadingIndicator.id = "loading-indicator";
    loadingIndicator.textContent = "Loading...";
    loadingIndicator.setAttribute("aria-live", "polite");
    loadingIndicator.style.display = "none";
    document.body.prepend(loadingIndicator);

    renderCart();

    const checkoutBtn = document.getElementById("checkout-button");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            window.location.href = "../checkout/confirmation/index.html";
        });
    }
});

document.addEventListener("click", event => {
    const cartDropdown = document.getElementById("cart-dropdown");
    const cartIcon = document.querySelector(".cart-icon");

    if (!cartDropdown || !cartIcon) return;

    if (!cartDropdown.classList.contains("hidden") &&
        !cartDropdown.contains(event.target) &&
        !cartIcon.contains(event.target)) {
        cartDropdown.classList.add("hidden");
    }
});
