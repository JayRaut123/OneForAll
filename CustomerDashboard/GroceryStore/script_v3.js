const defaultGroceryProducts = [
    { id: 1, name: "Britania Biscuit", price: 20.00, image: "../Britannia Biscuit.jpeg", badge: "FRESH", category: "Bakery", dietary: ["Vegetarian"], inStock: true },
    { id: 2, name: "Everest Chat masala", price: 60.00, image: "../Everest Chat Masala.jpeg", badge: "SPICE", category: "Pantry", dietary: ["Vegetarian", "Vegan"], inStock: true },
    { id: 3, name: "Amul Milk", price: 40.00, image: "../Amul Milk.jpeg", badge: "DAIRY", category: "Dairy & Eggs", dietary: ["Vegetarian"], inStock: true },
    { id: 4, name: "Wibs Brown Bread", price: 35.00, image: "../One for all.jpeg", badge: "HEALTHY", category: "Bakery", dietary: ["Vegetarian"], inStock: true },
    { id: 5, name: "Cooking Oil", price: 220.00, image: "../Cooking Oil.jpeg", badge: "STAPLE", category: "Pantry", dietary: ["Vegetarian", "Vegan"], inStock: true },
    { id: 6, name: "Wheat Flour", price: 50.00, image: "../Wheat Flour.jpeg", badge: "STAPLE", category: "Pantry", dietary: ["Vegetarian", "Vegan"], inStock: true }
];

if (!localStorage.getItem('groceryProductsV5')) {
    localStorage.setItem('groceryProductsV5', JSON.stringify(defaultGroceryProducts));
}

let products = JSON.parse(localStorage.getItem('groceryProductsV5'));

let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartBadge = document.getElementById('cart-badge');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const trackingModal = document.getElementById('tracking-modal');
const closeTrackingBtn = document.getElementById('close-tracking');
const openTrackingBtn = document.getElementById('open-tracking-btn');

// Initialize Dashboard
function init() {
    renderProducts();
    setupEventListeners();
}

function renderProducts() {
    productGrid.innerHTML = '';

    // Get active filters
    const categoryFilters = Array.from(document.querySelectorAll('#category-filters .filter-cb:checked')).map(cb => cb.value);
    const dietaryFilters = Array.from(document.querySelectorAll('#dietary-filters .filter-cb:checked')).map(cb => cb.value);
    const priceFilters = Array.from(document.querySelectorAll('#price-filters .filter-cb:checked')).map(cb => cb.value);
    
    const searchInput = document.querySelector('.search-bar input');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    let filtered = products.filter(product => {
        let nameMatch = searchTerm === '' || product.name.toLowerCase().includes(searchTerm);
        
        // Category Match
        let categoryMatch = categoryFilters.length === 0 || categoryFilters.includes(product.category);
        
        // Dietary Match (must have all selected)
        let dietaryMatch = dietaryFilters.length === 0 || dietaryFilters.every(d => product.dietary.includes(d));
        
        // Price Match
        let priceMatch = priceFilters.length === 0 || priceFilters.includes('all');
        if (!priceMatch) {
            priceMatch = priceFilters.some(pf => {
                if (pf === 'under-100' && product.price < 100) return true;
                if (pf === '100-200' && product.price >= 100 && product.price <= 200) return true;
                if (pf === 'over-200' && product.price > 200) return true;
                return false;
            });
        }

        return nameMatch && categoryMatch && dietaryMatch && priceMatch;
    });

    if (filtered.length === 0) {
        productGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">No groceries found matching your filters.</div>';
        return;
    }

    filtered.forEach(product => {
        const isOutOfStock = !product.inStock;
        const cardClass = isOutOfStock ? 'product-card out-of-stock' : 'product-card';
        
        const badgeHtml = isOutOfStock 
            ? `<div class="badge out-stock">OUT OF STOCK</div>` 
            : `<div class="badge ${product.badge === 'FRESH' ? 'fresh' : ''}">${product.badge}</div>`;
            
        const buttonHtml = isOutOfStock
            ? `<button class="add-to-cart" disabled><i class="fa-solid fa-ban"></i> Unavailable</button>`
            : `<button class="add-to-cart" onclick="addToCart(${product.id})"><i class="fa-solid fa-plus"></i> Add to Cart</button>`;

        const card = document.createElement('div');
        card.className = cardClass;
        card.innerHTML = `
            <div class="product-img-wrapper">
                ${badgeHtml}
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">₹${product.price.toFixed(2)}</div>
                ${buttonHtml}
            </div>
        `;
        productGrid.appendChild(card);
    });
}

function setupEventListeners() {
    cartBtn.addEventListener('click', () => {
        cartOverlay.classList.add('active');
        renderCart();
    });

    closeCartBtn.addEventListener('click', () => {
        cartOverlay.classList.remove('active');
    });

    checkoutBtn.addEventListener('click', handleCheckout);

    closeTrackingBtn.addEventListener('click', () => {
        trackingModal.classList.remove('active');
    });

    if (openTrackingBtn) {
        openTrackingBtn.addEventListener('click', () => {
            trackingModal.classList.add('active');
        });
    }

    // Listen for filter changes
    document.querySelectorAll('.filter-cb').forEach(cb => {
        cb.addEventListener('change', renderProducts);
    });
    
    // Listen for search input changes
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', renderProducts);
    }
    
    // Dropdown animation for filters
    document.querySelectorAll('.filter-section h3').forEach(header => {
        header.addEventListener('click', () => {
            const list = header.nextElementSibling;
            list.classList.toggle('collapsed');
            header.classList.toggle('collapsed');
        });
    });

    // Listen for changes from Owner Dashboard (another tab)
    window.addEventListener('storage', (e) => {
        if (e.key === 'groceryProductsV5') {
            products = JSON.parse(e.newValue);
            renderProducts();
            
            // Remove items that are now out of stock
            cart = cart.filter(item => {
                const prod = products.find(p => p.id === item.id);
                return prod && prod.inStock;
            });
            renderCart();
            updateCartBadge();
        }
    });
}

// Sound and Toast Animation
function playPopSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Cart Logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartBadge();
    
    playPopSound();
    showToast(product.name + " added to cart!");
    
    // Bounce effect on cart icon
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
    updateCartBadge();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCart();
            updateCartBadge();
        }
    }
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
}

function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg" style="text-align: center; color: var(--text-muted); margin-top: 2rem;">Your cart is empty.</div>';
        cartTotalPrice.textContent = '₹0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalPrice.textContent = `₹${total.toFixed(2)}`;
}

// Checkout and Tracking
function handleCheckout() {
    if (cart.length === 0) return;

    checkoutBtn.classList.add('processing');
    checkoutBtn.querySelector('.btn-text').textContent = 'Processing...';

    setTimeout(() => {
        checkoutBtn.classList.remove('processing');
        checkoutBtn.querySelector('.btn-text').textContent = 'Pay Now';
        
        cartOverlay.classList.remove('active');
        cart = [];
        updateCartBadge();
        
        trackingModal.classList.add('active');
        if (openTrackingBtn) openTrackingBtn.style.display = 'block';
        startTrackingAnimation();
    }, 2000); 
}

// Google Maps Tracking Algorithm
let map, donorMarker, truckMarker, polyline;
const donorPos = { lat: 19.2307, lng: 72.8567 }; // Customer Home (Borivali)
const startPos = { lat: 19.1136, lng: 72.8697 }; // Store (Andheri)

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: donorPos,
        disableDefaultUI: true,
        zoomControl: true,
    });

    donorMarker = new google.maps.Marker({
        position: donorPos,
        map: map,
        title: "My Home",
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    });

    truckMarker = new google.maps.Marker({
        map: map,
        title: "Delivery",
        position: startPos,
        icon: {
            url: "https://maps.gstatic.com/mapfiles/ms2/micons/truck.png",
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    polyline = new google.maps.Polyline({
        map: map,
        geodesic: true,
        strokeColor: '#2ecc71', // Primary color for Grocery
        strokeOpacity: 1.0,
        strokeWeight: 5,
        path: [startPos, donorPos]
    });
}
window.initMap = initMap;

function updateTruckLocation(driverPos) {
    if(!truckMarker) return;
    truckMarker.setPosition(driverPos);
    polyline.setPath([driverPos, donorPos]);

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(donorPos);
    bounds.extend(driverPos);
    map.fitBounds(bounds, { padding: 80 });
}

let simSteps = [];
let simIndex = 0;
let simInterval;

function startTrackingAnimation() {
    setTimeout(() => {
        if (map) google.maps.event.trigger(map, "resize");

        if (simInterval) clearInterval(simInterval);

        let currLat = startPos.lat;
        let currLng = startPos.lng;
        const targetLat = donorPos.lat;
        const targetLng = donorPos.lng;

        simSteps = [];
        for (let i = 1; i <= 30; i++) {
            simSteps.push({
                lat: currLat + ((targetLat - currLat) * (i / 30)),
                lng: currLng + ((targetLng - currLng) * (i / 30))
            });
        }

        simIndex = 0;
        document.getElementById("status-text").innerText = "Out for Delivery!";
        updateTruckLocation(startPos);
        
        const steps = document.querySelectorAll('#tracking-modal .status-step');
        if(steps.length >= 4) {
            steps[2].classList.add('pulse');
            steps[3].classList.remove('active');
        }

        simInterval = setInterval(() => {
            if (simIndex >= simSteps.length) {
                clearInterval(simInterval);
                document.getElementById("status-text").innerText = "Arrived at your Doorstep!";
                document.getElementById("dist-text").innerText = "0.0 km left";
                
                if(steps.length >= 4) {
                    steps[2].classList.remove('pulse');
                    steps[3].classList.add('active');
                }
                
                // Hide tracking button when delivery is complete
                if (openTrackingBtn) openTrackingBtn.style.display = 'none';
                
                return;
            }
            const pos = simSteps[simIndex];
            updateTruckLocation(pos);

            const remainingKm = ((30 - simIndex) * 0.4).toFixed(1);
            document.getElementById("dist-text").innerText = `${remainingKm} km left`;

            simIndex++;
        }, 800);
    }, 400); 
}

// Run init
init();
