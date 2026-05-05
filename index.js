const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')));

// ===== MOCK DATA =====
let mockProducts = [
    {
        _id: "1",
        name: "Leather Backpack",
        price: 4999,
        description: "Premium genuine leather backpack with laptop compartment",
        image: "/buisness.webp",
        category: "Backpack",
        stock: 50,
        rating: 4.5
    },
    {
        _id: "2",
        name: "Canvas Travel Bag",
        price: 2999,
        description: "Durable canvas travel bag for weekend trips",
        image: "/canvas.webp",
        category: "Travel",
        stock: 30,
        rating: 4.0
    },
    {
        _id: "3",
        name: "Business Briefcase",
        price: 5999,
        description: "Professional leather briefcase for the modern executive",
        image: "/shoppingbag.webp",
        category: "Briefcase",
        stock: 20,
        rating: 4.8
    }
];

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== HOME PAGE (CLEAN ENTRY) =====
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>🎒 Bag Store | Admin Portal</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Inter', -apple-system, sans-serif; 
                    background: #0f172a;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                .hero-card {
                    max-width: 500px;
                    background: #1e293b;
                    padding: 50px;
                    border-radius: 24px;
                    text-align: center;
                    border: 1px solid #334155;
                }
                h1 { font-size: 32px; margin-bottom: 16px; }
                p { color: #94a3b8; margin-bottom: 32px; line-height: 1.6; }
                .btn { 
                    padding: 14px 28px; 
                    border-radius: 12px; 
                    font-size: 16px; 
                    text-decoration: none; 
                    display: inline-block; 
                    font-weight: 600;
                    background: #6366f1;
                    color: white;
                    transition: transform 0.2s;
                }
                .btn:hover { transform: translateY(-2px); background: #4f46e5; }
            </style>
        </head>
        <body>
            <div class="hero-card">
                <div style="font-size: 50px; margin-bottom: 20px;">🎒</div>
                <h1>Bag Store Admin</h1>
                <p>Manage your luxury inventory, track stock levels, and update your product catalog from the unified dashboard.</p>
                <a href="/dashboard" class="btn">Go to Dashboard</a>
            </div>
        </body>
        </html>
    `);
});

// ===== PREMIUM DASHBOARD =====
app.get("/dashboard", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bag Store | Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #0f172a; --accent: #6366f1; --bg: #f8fafc;
            --text: #1e293b; --muted: #64748b; --border: #e2e8f0;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); display: flex; }
        
        .sidebar { width: 260px; background: var(--primary); color: white; padding: 2rem 1.5rem; position: fixed; height: 100vh; }
        .logo { font-size: 1.5rem; font-weight: 700; margin-bottom: 3rem; display: flex; align-items: center; gap: 10px; }
        .nav-item { padding: 0.8rem 1rem; border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer; color: #94a3b8; display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .nav-item.active { background: #1e293b; color: white; }

        .main-content { margin-left: 260px; flex: 1; padding: 2rem 3rem; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .stat-card span { font-size: 0.8rem; color: var(--muted); font-weight: 600; }
        .stat-card h3 { font-size: 1.5rem; margin-top: 0.4rem; }

        .toolbar { display: flex; gap: 1rem; margin-bottom: 2rem; }
        .search-input { flex: 1; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid var(--border); outline: none; }
        
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        .product-card { background: white; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); transition: 0.3s; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .product-img { height: 180px; width: 100%; object-fit: cover; background: #f1f5f9; }
        .p-body { padding: 1.2rem; }
        .p-cat { font-size: 0.7rem; color: var(--accent); font-weight: 700; text-transform: uppercase; }
        .p-title { font-weight: 600; margin: 0.5rem 0; font-size: 1.1rem; }
        .p-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; }
        
        .btn { padding: 0.6rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; transition: 0.2s; }
        .btn-primary { background: var(--accent); color: white; }
        .btn-outline { background: #f1f5f9; color: var(--text); margin-top: 10px; flex: 1; }
        .btn-danger { background: #fee2e2; color: #ef4444; }

        /* Modal */
        .modal { display: none; position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); align-items:center; justify-content:center; z-index:1000; }
        .modal.active { display: flex; }
        .modal-content { background: white; padding: 2.5rem; border-radius: 16px; width: 90%; max-width: 500px; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; font-size: 0.8rem; margin-bottom: 0.4rem; color: var(--muted); }
        .form-group input { width: 100%; padding: 0.7rem; border: 1px solid var(--border); border-radius: 6px; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="logo">🎒 BagStore</div>
        <a href="#" class="nav-item active">📊 Dashboard</a>
        <a href="/" class="nav-item">🏠 Exit to Home</a>
    </div>

    <div class="main-content">
        <div class="header">
            <div><h1>Inventory</h1><p style="color:var(--muted)">Manage your product catalog</p></div>
            <button class="btn btn-primary" onclick="openModal()">+ Add Product</button>
        </div>

        <div class="stats-grid">
            <div class="stat-card"><span>Total Items</span><h3 id="statItems">0</h3></div>
            <div class="stat-card"><span>Inventory Value</span><h3 id="statValue">₹0</h3></div>
            <div class="stat-card"><span>Total Stock</span><h3 id="statStock">0</h3></div>
            <div class="stat-card"><span>Categories</span><h3 id="statCats">0</h3></div>
        </div>

        <div class="toolbar">
            <input type="text" id="searchInput" class="search-input" placeholder="Search by name..." oninput="filterProducts()">
        </div>

        <div class="products-grid" id="productsGrid"></div>
    </div>

    <div id="modal" class="modal">
        <div class="modal-content">
            <h2 id="modalTitle" style="margin-bottom: 1.5rem;">Add Product</h2>
            <form id="pForm">
                <div class="form-group"><label>Name</label><input type="text" id="pName" required></div>
                <div style="display:flex; gap:1rem">
                    <div class="form-group" style="flex:1"><label>Category</label><input type="text" id="pCat" required></div>
                    <div class="form-group" style="flex:1"><label>Price (₹)</label><input type="number" id="pPrice" required></div>
                </div>
                <div class="form-group"><label>Stock Units</label><input type="number" id="pStock" required></div>
                <div class="form-group"><label>Image URL</label><input type="url" id="pImg"></div>
                <div style="display:flex; gap:1rem; margin-top:2rem;">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary" style="flex:1">Save Product</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        let allProducts = [];
        let editId = null;

        async function load() {
            const res = await fetch('/api/products');
            allProducts = await res.json();
            render(allProducts);
            stats(allProducts);
        }

        function stats(data) {
            document.getElementById('statItems').innerText = data.length;
            document.getElementById('statValue').innerText = '₹' + data.reduce((s, p) => s + (p.price * p.stock), 0).toLocaleString();
            document.getElementById('statStock').innerText = data.reduce((s, p) => s + p.stock, 0);
            document.getElementById('statCats').innerText = new Set(data.map(p => p.category)).size;
        }

        function render(data) {
            const grid = document.getElementById('productsGrid');
            grid.innerHTML = data.map(p => \`
                <div class="product-card">
                    <img src="\${p.image}" class="product-img">
                    <div class="p-body">
                        <span class="p-cat">\${p.category}</span>
                        <div class="p-title">\${p.name}</div>
                        <div class="p-footer">
                            <span style="font-weight:700">₹\${p.price.toLocaleString()}</span>
                            <span style="font-size:0.8rem; color:var(--muted)">Stock: \${p.stock}</span>
                        </div>
                        <div style="display:flex; gap:0.5rem">
                            <button class="btn btn-outline" onclick="editProduct('\${p._id}')">Edit</button>
                            <button class="btn btn-outline btn-danger" style="flex:0" onclick="delProduct('\${p._id}')">🗑️</button>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        function filterProducts() {
            const q = document.getElementById('searchInput').value.toLowerCase();
            render(allProducts.filter(p => p.name.toLowerCase().includes(q)));
        }

        function openModal() { 
            editId = null; 
            document.getElementById('pForm').reset();
            document.getElementById('modalTitle').innerText = "Add Product";
            document.getElementById('modal').classList.add('active'); 
        }
        function closeModal() { document.getElementById('modal').classList.remove('active'); }

        async function editProduct(id) {
            const p = allProducts.find(x => x._id === id);
            editId = id;
            document.getElementById('pName').value = p.name;
            document.getElementById('pCat').value = p.category;
            document.getElementById('pPrice').value = p.price;
            document.getElementById('pStock').value = p.stock;
            document.getElementById('pImg').value = p.image;
            document.getElementById('modalTitle').innerText = "Edit Product";
            document.getElementById('modal').classList.add('active');
        }

        async function delProduct(id) {
            if(confirm('Delete this product?')) {
                await fetch('/api/products/' + id, { method: 'DELETE' });
                load();
            }
        }

        document.getElementById('pForm').onsubmit = async (e) => {
            e.preventDefault();
            const payload = {
                name: document.getElementById('pName').value,
                category: document.getElementById('pCat').value,
                price: Number(document.getElementById('pPrice').value),
                stock: Number(document.getElementById('pStock').value),
                image: document.getElementById('pImg').value || 'https://via.placeholder.com/300'
            };
            
            const url = editId ? '/api/products/' + editId : '/api/products/create';
            await fetch(url, {
                method: editId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            closeModal();
            load();
        };

        load();
    </script>
</body>
</html>
    `);
});

// ===== API ROUTES =====
app.get("/api/products", (req, res) => res.json(mockProducts));

app.post("/api/products/create", (req, res) => {
    const newProduct = { _id: Date.now().toString(), ...req.body };
    mockProducts.push(newProduct);
    res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
    const index = mockProducts.findIndex(p => p._id === req.params.id);
    if (index !== -1) mockProducts[index] = { ...mockProducts[index], ...req.body };
    res.json({ success: true });
});

app.delete("/api/products/:id", (req, res) => {
    mockProducts = mockProducts.filter(p => p._id !== req.params.id);
    res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));