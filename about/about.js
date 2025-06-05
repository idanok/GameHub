// Hamburger menu
function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

window.addEventListener("load", () => {
    const loadingIndicator = document.getElementById("loading-indicator");
    const mainContent = document.querySelector(".main-content");

    if (loadingIndicator) loadingIndicator.style.display = "none";
    if (mainContent) mainContent.style.display = "block";
});

// Cart functionality
function addToCart(product) {
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    } catch (error) {
        alert("Failed to add item to cart.");
    }
}

function removeFromCart(productId) {
    if (confirm("Are you sure you want to remove this item from the cart?")) {
        try {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        } catch (error) {
            alert("Failed to remove item from cart.");
        }
    }
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    if (!cartItems || !cartTotal || !cartCount) return;

    try {
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
    } catch (error) {
        alert("Failed to render cart.");
    }
}

function toggleCart() {
    document.getElementById("cart-dropdown").classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
    renderCart();

    const checkoutButton = document.getElementById("checkout-button");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            window.location.href = "../checkout/confirmation/index.html";
        });
    }
});

document.addEventListener("click", function (event) {
    const cartDropdown = document.getElementById("cart-dropdown");
    const cartIcon = document.querySelector(".cart-icon");
    if (!cartDropdown.classList.contains("hidden") &&
        !cartDropdown.contains(event.target) &&
        !cartIcon.contains(event.target)) {
        cartDropdown.classList.add("hidden");
    }
});

// Slideshow: Meet Our Team
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");

    if (slides.length === 0 || dots.length === 0) return;

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}