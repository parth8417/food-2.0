document.addEventListener('DOMContentLoaded', () => {
    const menuItems = [
        {
            id: 1,
            name: "Classic Burger",
            price: 249,
            category: "main",
            image: "assets/images/burger.jpg",
            description: "Juicy beef patty with fresh lettuce, tomatoes, and our special sauce",
            rating: 4.8,
            reviews: 245,
            badge: "Best Seller",
            isSpicy: false
        },
        {
            id: 2,
            name: "Margherita Pizza",
            price: 299,
            category: "main",
            image: "assets/images/pizza.jpg",
            description: "Fresh mozzarella, tomatoes, and basil on our homemade crust",
            rating: 4.5,
            reviews: 180,
            badge: "",
            isSpicy: false
        },
        {
            id: 3,
            name: "Caesar Salad",
            price: 199,
            category: "appetizer",
            image: "assets/images/caesar-salad.jpg",
            description: "Crisp romaine lettuce with creamy Caesar dressing",
            rating: 4.2,
            reviews: 90,
            badge: "",
            isSpicy: false
        },
        {
            id: 4,
            name: "Chocolate Cake",
            price: 149,
            category: "dessert",
            image: "assets/images/cake.jpg",
            description: "Rich chocolate cake with dark chocolate ganache",
            rating: 4.9,
            reviews: 300,
            badge: "Top Rated",
            isSpicy: false
        },
        {
            id: 5,
            name: "Iced Coffee",
            price: 99,
            category: "beverage",
            image: "assets/images/coffee.jpg",
            description: "Cold brewed coffee with milk and ice",
            rating: 4.0,
            reviews: 150,
            badge: "",
            isSpicy: false
        }
    ];

    const menuGrid = document.getElementById('menuGrid');
    const loader = document.getElementById('menuLoader');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function formatPrice(price) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    }

    function renderMenuItems(items) {
        if (!items || !items.length) {
            menuGrid.innerHTML = '<p class="no-items">No menu items found</p>';
            return;
        }

        loader.style.display = 'block';
        menuGrid.style.opacity = '0.5';

        const itemsHTML = items.map((item, index) => `
            <div class="menu-item" style="--item-index: ${index}" data-category="${item.category}">
                ${item.badge ? `<span class="menu-item__badge">${item.badge}</span>` : ''}
                <div class="menu-item__image">
                    <img src="${item.image}" alt="${item.name}" 
                         onerror="this.src='assets/images/default-food.jpg'">
                </div>
                <div class="menu-item__content">
                    <div class="menu-item__header">
                        <h3 class="menu-item__title">${item.name}</h3>
                        <span class="menu-item__price">${formatPrice(item.price)}</span>
                    </div>
                    <div class="menu-item__rating">
                        ${generateStarRating(item.rating)}
                        <span>(${item.reviews})</span>
                    </div>
                    <p class="menu-item__description">${item.description}</p>
                    <div class="menu-item__footer">
                        <div class="menu-item__actions">
                            <button class="add-to-cart" data-id="${item.id}">
                                <i class="fas fa-shopping-cart"></i>
                                Add to Cart
                            </button>
                            <button class="favorite-btn" data-id="${item.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Use setTimeout to ensure smooth transition
        setTimeout(() => {
            menuGrid.innerHTML = itemsHTML;
            loader.style.display = 'none';
            menuGrid.style.opacity = '1';
        }, 300);
    }

    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const stars = [];
        
        for(let i = 0; i < 5; i++) {
            if(i < fullStars) {
                stars.push('<i class="fas fa-star"></i>');
            } else if(i === fullStars && hasHalfStar) {
                stars.push('<i class="fas fa-star-half-alt"></i>');
            } else {
                stars.push('<i class="far fa-star"></i>');
            }
        }
        return stars.join('');
    }

    function filterMenu(category) {
        const filtered = category === 'all' 
            ? menuItems 
            : menuItems.filter(item => item.category === category);
        renderMenuItems(filtered);
    }

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMenu(btn.dataset.category);
        });
    });

    menuGrid.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart')) {
            const btn = e.target.closest('.add-to-cart');
            const id = parseInt(btn.dataset.id);
            const item = menuItems.find(item => item.id === id);
            
            const existingItem = cart.find(cartItem => cartItem.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...item, quantity: 1 });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();

            // Show feedback
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Added';
            btn.style.background = '#4CAF50';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 1000);
        }
    });

    document.getElementById('viewCart').addEventListener('click', () => {
        window.location.href = 'order.html';
    });

    const searchInput = document.getElementById('searchMenu');
    const sortSelect = document.getElementById('sortMenu');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');

    function filterAndSortMenu() {
        let filtered = [...menuItems];
        const searchTerm = searchInput.value.toLowerCase();
        const category = document.querySelector('.filter-btn.active').dataset.category;
        const sortValue = document.getElementById('sortMenu').value;

        // Apply category filter
        if (category !== 'all') {
            filtered = filtered.filter(item => item.category === category);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(searchTerm) || 
                item.description.toLowerCase().includes(searchTerm)
            );
        }

        // Apply sorting
        if (sortValue === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        }

        renderMenuItems(filtered);
    }

    // Event listeners
    document.getElementById('sortMenu').addEventListener('change', filterAndSortMenu);
    document.getElementById('searchMenu').addEventListener('input', filterAndSortMenu);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterAndSortMenu();
        });
    });

    // Initial render
    renderMenuItems(menuItems);
    updateCartCount();
});

function sortItems(items, sortBy) {
    const sortedItems = [...items];
    
    switch(sortBy) {
        case 'price-low':
            return sortedItems.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedItems.sort((a, b) => b.price - a.price);
        case 'name-asc':
            return sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sortedItems.sort((a, b) => b.name.localeCompare(a.name));
        default:
            return sortedItems; // Keep original order for 'default'
    }
}

document.getElementById('sortMenu').addEventListener('change', function() {
    const sortBy = this.value;
    const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
    let filteredItems = activeCategory === 'all' ? 
        menuItems : 
        menuItems.filter(item => item.category === activeCategory);
    
    const sortedItems = sortItems(filteredItems, sortBy);
    renderMenuItems(sortedItems);
});
