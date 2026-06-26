document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    fetchMetrics();
    fetchUsers();
    fetchProducts();
});

// Simple Frontend Tabs
function setupNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".dashboard-section");

    navButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            navButtons.forEach(b => b.classList.remove("active"));
            sections.forEach(s => s.classList.add("hidden"));

            btn.classList.add("active");
            const targetId = btn.getAttribute("href").substring(1);
            document.getElementById(targetId).classList.remove("hidden");
        });
    });
}

// Fetch Backend APIs
async function fetchMetrics() {
    try {
        const res = await fetch('/api/admin/metrics'); // Replace with your actual backend route
        const data = await res.json();
        document.getElementById('count-customers').innerText = data.total_customers;
        document.getElementById('count-shops').innerText = data.total_shops;
        document.getElementById('count-products').innerText = data.total_products;
    } catch (err) { console.error("Error fetching metrics", err); }
}

async function fetchUsers() {
    try {
        const res = await fetch('/api/admin/users');
        const users = await res.json();
        const tbody = document.querySelector("#users-table tbody");
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.role}</td>
                <td>${user.is_active ? 'Active' : 'Suspended'}</td>
                <td><button class="btn-toggle" onclick="toggleUser(${user.id}, ${user.is_active})">Toggle Status</button></td>
            </tr>
        `).join('');
    } catch (err) { console.error("Error fetching users", err); }
}

async function fetchProducts() {
    try {
        const res = await fetch('/api/admin/products');
        const products = await res.json();
        const tbody = document.querySelector("#products-table tbody");
        tbody.innerHTML = products.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.shop_id}</td>
                <td>${p.name}</td>
                <td>₹${p.price}</td>
                <td>${p.stock_quantity}</td>
                <td>${p.is_available ? 'In Stock' : 'Out of Stock'}</td>
            </tr>
        `).join('');
    } catch (err) { console.error("Error fetching products", err); }
}