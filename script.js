document.addEventListener('DOMContentLoaded', function() {
    // Cart variables
    let cart = [];
    const cartCountElement = document.querySelector('.cart-count');
    const cartItemsElement = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartModal = document.getElementById('cartModal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const closeModal = document.querySelector('.close-modal');
    const cartIcon = document.querySelector('.cart-icon');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    // Product data (you can expand this with your actual products)
    const products = [
        { id: 1, name: 'Product 1', price: 119.99, image: 'images/Goods1.jpg' },
        { id: 2, name: 'Product 2', price: 124.99, image: 'images/Goods2.jpg' },
        { id: 3, name: 'Product 3', price: 127.99, image: 'images/Goods3.jpg' },
        { id: 4, name: 'Product 4', price: 129.99, image: 'images/Goods4.jpg' }
    ];

    // Add to cart functionality
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const productId = index + 1;
            addToCart(productId);
            updateCart();
        });
    });

    // Add product to cart
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
        }
    }

    // Remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    // Update cart UI
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;

        // Update cart modal
        if (cart.length === 0) {
            cartItemsElement.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            cartTotalElement.textContent = 'R0.00';
        } else {
            cartItemsElement.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">R${item.price.toFixed(2)} x ${item.quantity}</div>
                    </div>
                    <button class="remove-item">&times;</button>
                </div>
            `).join('');

            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.closest('.cart-item').getAttribute('data-id'));
                    removeFromCart(productId);
                });
            });

            // Update total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotalElement.textContent = `R${total.toFixed(2)}`;
        }
    }

    // Open cart modal
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'block';
    });

    // Close cart modal
    closeModal.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Checkout via WhatsApp
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Prepare order message
        let message = `Hello Lushop, I would like to order:\n\n`;
        cart.forEach(item => {
            message += `${item.name} - R${item.price.toFixed(2)} x ${item.quantity}\n`;
        });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `\nTotal: R${total.toFixed(2)}\n\nMy delivery details:\n- Name: \n- Address: \n- Phone: `;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp with order
        window.open(`https://wa.me/27605190001?text=${encodedMessage}`, '_blank');
    });

    // Initialize empty cart
    updateCart();
});