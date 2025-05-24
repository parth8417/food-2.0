document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function loadCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        let subtotal = 0;
        cartItems.innerHTML = cart.map(item => {
            subtotal += item.price * item.quantity;
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" width="100">
                    <div>
                        <h3>${item.name}</h3>
                        <p>$${item.price}</p>
                        <div class="quantity">
                            <button onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button onclick="removeItem(${item.id})" class="remove-btn">×</button>
                </div>
            `;
        }).join('');

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        totalEl.textContent = `$${(subtotal + 5).toFixed(2)}`;
    }

    loadCart();
});
