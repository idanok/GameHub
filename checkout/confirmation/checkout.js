// Hamburger menu
function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

// Show loading indicator
document.addEventListener("DOMContentLoaded", () => {
    const orderItemsContainer = document.getElementById("order-items-container");
    const subtotalElem = document.getElementById("subtotal-amount");
    const totalElem = document.getElementById("order-total-amount");
    const loadingIndicator = document.getElementById("loading-indicator");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCart() {
        orderItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            orderItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
            subtotalElem.textContent = "$0.00";
            totalElem.textContent = "$0.00";
            if (loadingIndicator) loadingIndicator.style.display = "none";
            return;
        }

        let subtotal = 0;

        cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;

            const itemDiv = document.createElement("div");
            itemDiv.className = "rain-jacket";

            itemDiv.innerHTML = `
    <div class="gamehub-content">
        <img src="${item.image?.url}" alt="${item.image?.alt || item.title}" class="gamehub-image" />
        <div class="gamehub-details">
            <h4>${item.title}</h4>
            <p>Price: $${item.price.toFixed(2)}</p>
            <label>
                Quantity:
                <input type="number" min="1" class="qty-input" value="${item.quantity}" data-index="${index}" aria-label="Quantity for ${item.title}" />
            </label>
            <button class="remove-item" data-index="${index}" aria-label="Remove ${item.title} from cart">Remove</button>
        </div>
    </div>
`;


            orderItemsContainer.appendChild(itemDiv);
        });

        subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
        totalElem.textContent = `$${subtotal.toFixed(2)}`;
        if (loadingIndicator) loadingIndicator.style.display = "none";
    }

    orderItemsContainer.addEventListener("input", (e) => {
        if (e.target.classList.contains("qty-input")) {
            const index = e.target.getAttribute("data-index");
            let newQty = parseInt(e.target.value);

            if (isNaN(newQty) || newQty < 1) {
                newQty = 1;
                e.target.value = 1;
            }

            cart[index].quantity = newQty;
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        }
    });

    orderItemsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            const index = e.target.getAttribute("data-index");
            const itemTitle = cart[index].title;

            if (confirm(`Are you sure you want to remove "${itemTitle}" from your cart?`)) {
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            }
        }
    });

    if (loadingIndicator) loadingIndicator.style.display = "block";
    renderCart();
});

