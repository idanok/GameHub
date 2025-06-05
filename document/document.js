function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

function showLoading() {
    const loader = document.getElementById("loading-indicator");
    if (loader) loader.classList.remove("hidden");
}

function hideLoading() {
    const loader = document.getElementById("loading-indicator");
    if (loader) loader.classList.add("hidden");
}

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

async function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    if (!cartItems || !cartTotal || !cartCount) return;

    showLoading();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

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

    hideLoading();
}

function toggleCart() {
    document.getElementById("cart-dropdown").classList.toggle("hidden");
}

window.addEventListener("DOMContentLoaded", () => {
    renderCart();

    const checkoutBtn = document.getElementById("checkout-button");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            window.location.href = "checkout.html";
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
