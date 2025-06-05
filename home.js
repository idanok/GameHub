// Hamburger menu
function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

const apiURL = 'https://v2.api.noroff.dev/gamehub';
const productContainer = document.getElementById('product-container');
const filterForm = document.querySelector('.filter');
const loadingIndicator = document.createElement('p');
loadingIndicator.textContent = "Loading products...";
loadingIndicator.id = "loading-indicator";
loadingIndicator.style.display = "none";
productContainer.before(loadingIndicator);

// Fetch and display all products on load
async function fetchAllProducts() {
    try {
        loadingIndicator.style.display = "block";
        const response = await fetch(apiURL);
        const result = await response.json();
        displayProducts(result.data);
    } catch (error) {
        alert("Could not load products. Please try again later.");
    } finally {
        loadingIndicator.style.display = "none";
    }
}

// Handle filtering products by genre
filterForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const selectedGenre = document.getElementById('genre').value.toLowerCase();

    try {
        loadingIndicator.style.display = "block";
        const response = await fetch(apiURL);
        const result = await response.json();
        let filteredProducts;

        if (selectedGenre === "all") {
            filteredProducts = result.data;
        } else {
            filteredProducts = result.data.filter(product =>
                product.genre && product.genre.toLowerCase() === selectedGenre
            );
        }

        displayProducts(filteredProducts);
    } catch (error) {
        alert("Could not filter products. Please try again later.");
    } finally {
        loadingIndicator.style.display = "none";
    }
    loadingIndicator.classList.remove("hidden"); // Show
    loadingIndicator.classList.add("hidden");   // Hide

});

function displayProducts(products) {
    productContainer.innerHTML = '';

    if (!products || products.length === 0) {
        productContainer.innerHTML = '<p>No products match your filter.</p>';
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';

        productElement.innerHTML = `
            <img src="${product.image.url}" alt="${product.image.alt}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.discountedPrice}</p>
            <button class="view-detail" aria-label="View details for ${product.title}">View Detail</button>
            <button class="add-to-cart" aria-label="Add ${product.title} to cart">Add to Cart</button>
        `;

        productContainer.appendChild(productElement);

        productElement.querySelector('.view-detail').addEventListener('click', () => {
            window.location.href = `../product/?id=${product.id}`;
        });

        productElement.querySelector('.add-to-cart').addEventListener('click', () => {
            addToCart(product);
        });
    });
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
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cartItems || !cartTotal || !cartCount) return;

    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.discountedPrice * item.quantity;
        count += item.quantity;

        const li = document.createElement("li");
        li.innerHTML = `
            ${item.title} x ${item.quantity} - $${(item.discountedPrice * item.quantity).toFixed(2)}
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

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    fetchAllProducts();
});

document.getElementById('checkout-button').addEventListener('click', () => {
    window.location.href = 'checkout/confirmation/index.html';
});

document.addEventListener('click', function (event) {
    const cartDropdown = document.getElementById("cart-dropdown");
    const cartIcon = document.querySelector(".cart-icon");
    if (!cartDropdown.classList.contains("hidden") &&
        !cartDropdown.contains(event.target) &&
        !cartIcon.contains(event.target)) {
        cartDropdown.classList.add("hidden");
    }
});
