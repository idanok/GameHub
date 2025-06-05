// Hamburger menu
function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const productContainer = document.getElementById("product-detail");
const loadingIndicator = document.createElement("p");
loadingIndicator.id = "loading-indicator";
loadingIndicator.textContent = "Loading product details...";
productContainer.appendChild(loadingIndicator);

// Fetch product and handle logic
async function fetchProductDetails() {
    if (!productId) {
        productContainer.innerHTML = "<p>No product selected.</p>";
        return;
    }

    try {
        const response = await fetch(`https://v2.api.noroff.dev/gamehub/${productId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch product.");
        }

        const result = await response.json();
        displayProduct(result.data);
        renderCart();
    } catch (error) {
        alert("Failed to load product. Please try again later.");
        productContainer.innerHTML = "<p>Sorry, failed to load product details.</p>";
    } finally {
        loadingIndicator.remove();
    }
    loadingIndicator.classList.remove("hidden"); // Show
    loadingIndicator.classList.add("hidden");   // Hide
}

function displayProduct(product) {
    const onSale = product.onSale;
    const priceHTML = onSale
        ? `<s>$${product.price.toFixed(2)}</s> <span style="color:red; font-weight:bold;">$${product.discountedPrice.toFixed(2)}</span>`
        : `$${product.price.toFixed(2)}`;

    const releaseDate = product.released || "Unknown";
    const ageRating = product.ageRating || "Not rated";

    productContainer.innerHTML = `
        <div class="product-detail-card">
            <img src="${product.image.url}" alt="${product.image.alt}" class="product-image" />
            <div class="product-info">
                <h1>${product.title}</h1>
                <p>${product.description}</p>
                <p><strong>Price:</strong> ${priceHTML}</p>
                <p><strong>Release Date:</strong> ${releaseDate}</p>
                <p><strong>Age Rating:</strong> ${ageRating}</p>
                <button class="add-to-cart-btn" id="add-to-cart-btn">Add to Cart</button>
            </div>
        </div>
    `;

    document.getElementById("add-to-cart-btn").addEventListener("click", () => {
        addToCart({ ...product, selectedSize: "N/A" });
    });
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
    alert(`${product.title} added to cart!`);
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

    if (!cartItems || !cartTotal || !cartCount) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        const price = item.onSale ? item.discountedPrice : item.price;
        total += price * item.quantity;
        count += item.quantity;

        const li = document.createElement("li");
        li.innerHTML = `${item.title} x ${item.quantity} - $${(price * item.quantity).toFixed(2)} <button onclick="removeFromCart('${item.id}')">Remove</button>`;
        cartItems.appendChild(li);
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = count;
}

function toggleCart() {
    const cartDropdown = document.getElementById("cart-dropdown");
    if (cartDropdown) cartDropdown.classList.toggle("hidden");
}

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

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    fetchProductDetails();

    const checkoutBtn = document.getElementById("checkout-button");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            window.location.href = "../checkout/confirmation/index.html";
        });
    }
});
