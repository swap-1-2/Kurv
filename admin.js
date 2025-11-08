// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHYAgCbh7Su_j94P2NocHPAS61YGjYnQw",
    authDomain: "kurv-mobile-app.firebaseapp.com",
    projectId: "kurv-mobile-app",
    storageBucket: "kurv-mobile-app.firebasestorage.app",
    messagingSenderId: "74456064312",
    appId: "1:74456064312:web:b55d2056b7a07873b821cd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Collections
const categoriesCollection = db.collection('categories');
const productsCollection = db.collection('products');
const ordersCollection = db.collection('orders');

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
    
    // Load data for the tab
    if (tabName === 'categories') {
        loadCategories();
    } else if (tabName === 'products') {
        loadProducts();
        loadCategoriesForDropdown();
    } else if (tabName === 'orders') {
        loadOrders();
    }
}

// Update stats
async function updateStats() {
    try {
        const [categoriesSnapshot, productsSnapshot, ordersSnapshot] = await Promise.all([
            categoriesCollection.get(),
            productsCollection.get(),
            ordersCollection.get()
        ]);
        
        document.getElementById('totalCategories').textContent = categoriesSnapshot.size;
        document.getElementById('totalProducts').textContent = productsSnapshot.size;
        document.getElementById('totalOrders').textContent = ordersSnapshot.size;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// CATEGORIES MANAGEMENT
async function loadCategories() {
    try {
        const snapshot = await categoriesCollection.get();
        const tbody = document.getElementById('categoriesTableBody');
        
        console.log('Loading categories, found:', snapshot.size);
        
        if (snapshot.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-folder-open"></i>
                        <p>No categories found. Add your first category above!</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = '';
        let rowsHTML = '';
        snapshot.forEach(doc => {
            const category = doc.data();
            console.log('Category:', category.id, 'with doc.id:', doc.id);
            rowsHTML += `
                <tr>
                    <td data-label="ID"><strong>${category.id}</strong></td>
                    <td data-label="Name">${category.name || '-'}</td>
                    <td data-label="Icon" class="icon-preview">${category.icon || '-'}</td>
                    <td data-label="Description">${category.description || '-'}</td>
                    <td data-label="Color">
                        <div class="color-preview" style="background: ${category.color || '#cccccc'};"></div>
                    </td>
                    <td class="action-buttons">
                        <button class="btn btn-secondary btn-sm" onclick="editCategory('${doc.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCategory('${doc.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = rowsHTML;
        
        console.log('Categories table HTML updated');
        updateStats();
    } catch (error) {
        console.error('Error loading categories:', error);
        showToast('Error loading categories', 'error');
    }
}

async function saveCategory(event) {
    event.preventDefault();
    
    const editId = document.getElementById('categoryEditId').value;
    const categoryId = document.getElementById('categoryId').value.trim();
    
    const categoryData = {
        id: categoryId,
        name: document.getElementById('categoryName').value.trim() || '',
        icon: document.getElementById('categoryIcon').value.trim() || '',
        description: document.getElementById('categoryDescription').value.trim() || '',
        color: document.getElementById('categoryColor').value || '#4CAF50',
        className: categoryId
    };
    
    try {
        if (editId && editId !== categoryId) {
            // If ID changed, delete old and create new
            await categoriesCollection.doc(editId).delete();
        }
        
        await categoriesCollection.doc(categoryId).set(categoryData);
        showToast(editId ? '✅ Category updated successfully!' : '✅ Category added successfully!');
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryEditId').value = '';
        document.getElementById('categorySaveBtn').innerHTML = '<i class="fas fa-plus"></i> Add Category';
        document.getElementById('categoryCancelBtn').style.display = 'none';
        loadCategories();
    } catch (error) {
        console.error('Error saving category:', error);
        showToast('Error saving category: ' + error.message, 'error');
    }
}

function editCategory(categoryId) {
    categoriesCollection.doc(categoryId).get().then(doc => {
        if (doc.exists) {
            const category = doc.data();
            document.getElementById('categoryEditId').value = categoryId;
            document.getElementById('categoryId').value = category.id || '';
            document.getElementById('categoryName').value = category.name || '';
            document.getElementById('categoryIcon').value = category.icon || '';
            document.getElementById('categoryDescription').value = category.description || '';
            document.getElementById('categoryColor').value = category.color || '#4CAF50';
            document.getElementById('categorySaveBtn').innerHTML = '<i class="fas fa-save"></i> Update Category';
            document.getElementById('categoryCancelBtn').style.display = 'inline-block';
            
            // Scroll to form
            document.querySelector('#categories-tab .form-section').scrollIntoView({ behavior: 'smooth' });
        }
    }).catch(error => {
        console.error('Error loading category for edit:', error);
        showToast('Error loading category', 'error');
    });
}

function cancelCategoryEdit() {
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryEditId').value = '';
    document.getElementById('categorySaveBtn').innerHTML = '<i class="fas fa-plus"></i> Add Category';
    document.getElementById('categoryCancelBtn').style.display = 'none';
}

async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
        await categoriesCollection.doc(categoryId).delete();
        showToast('Category deleted successfully!');
        loadCategories();
    } catch (error) {
        console.error('Error deleting category:', error);
        showToast('Error deleting category', 'error');
    }
}

// PRODUCTS MANAGEMENT
async function loadProducts() {
    try {
        const snapshot = await productsCollection.get();
        const tbody = document.getElementById('productsTableBody');
        
        if (snapshot.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="empty-state">
                        <i class="fas fa-box-open"></i>
                        <p>No products found. Add your first product above!</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = '';
        snapshot.forEach(doc => {
            const product = doc.data();
            
            // Determine if image is URL or emoji
            const isImageUrl = product.image && (product.image.startsWith('http://') || product.image.startsWith('https://'));
            const imageDisplay = isImageUrl 
                ? `<img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: contain; border-radius: 5px; border: 1px solid #e2e8f0; padding: 2px;">` 
                : `<span class="icon-preview">${product.image || '📦'}</span>`;
            
            const row = `
                <tr>
                    <td data-label="Item Number"><strong>${product.itemNumber || product.id}</strong></td>
                    <td data-label="Category"><span class="status-badge" style="background: #667eea; color: white;">${product.category || '-'}</span></td>
                    <td data-label="Sub Category">${product.subCategory || '-'}</td>
                    <td data-label="Name">${product.name || '-'}</td>
                    <td data-label="Make">${product.make || '-'}</td>
                    <td data-label="Specification">${product.specification || '-'}</td>
                    <td data-label="Price"><strong>${product.price ? product.price + ' ₹' : '-'}</strong></td>
                    <td data-label="UOM"><span class="status-badge" style="background: #48bb78; color: white;">${product.uomCode || product.unit || '-'}</span></td>
                    <td data-label="Image">${imageDisplay}</td>
                    <td class="action-buttons">
                        <button class="btn btn-secondary btn-sm" onclick="editProduct('${doc.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${doc.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
        
        updateStats();
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error loading products', 'error');
    }
}

async function loadCategoriesForDropdown() {
    try {
        const snapshot = await categoriesCollection.get();
        const select = document.getElementById('productCategory');
        select.innerHTML = '<option value="">Select Category</option>';
        
        snapshot.forEach(doc => {
            const category = doc.data();
            select.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        });
    } catch (error) {
        console.error('Error loading categories for dropdown:', error);
    }
}

async function saveProduct(event) {
    event.preventDefault();
    
    const editId = document.getElementById('productEditId').value;
    const itemNumber = document.getElementById('productItemNumber').value.trim();
    const uomValue = document.getElementById('productUOM').value.trim();
    
    const productData = {
        itemNumber: itemNumber,
        category: document.getElementById('productCategory').value || '',
        subCategory: document.getElementById('productSubCategory').value.trim() || '',
        name: document.getElementById('productName').value.trim() || '',
        make: document.getElementById('productMake').value.trim() || '',
        specification: document.getElementById('productSpecification').value.trim() || '',
        price: parseFloat(document.getElementById('productPrice').value) || 0,
        uomCode: uomValue || '',
        unitQuantity: document.getElementById('productUnitQty').value.trim() || '',
        image: document.getElementById('productImage').value.trim() || '',
        // Keep backward compatibility
        id: itemNumber,
        unit: uomValue || ''
    };
    
    try {
        if (editId && editId !== itemNumber) {
            // If item number changed, delete old and create new
            await productsCollection.doc(editId).delete();
        }
        
        await productsCollection.doc(itemNumber).set(productData);
        showToast(editId ? '✅ Product updated successfully!' : '✅ Product added successfully!');
        document.getElementById('productForm').reset();
        document.getElementById('productEditId').value = '';
        document.getElementById('productSaveBtn').innerHTML = '<i class="fas fa-plus"></i> Add Product';
        document.getElementById('productCancelBtn').style.display = 'none';
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        showToast('Error saving product: ' + error.message, 'error');
    }
}

function editProduct(productId) {
    productsCollection.doc(productId).get().then(doc => {
        if (doc.exists) {
            const product = doc.data();
            document.getElementById('productEditId').value = productId;
            document.getElementById('productItemNumber').value = product.itemNumber || product.id || '';
            document.getElementById('productCategory').value = product.category || '';
            document.getElementById('productSubCategory').value = product.subCategory || '';
            document.getElementById('productName').value = product.name || '';
            document.getElementById('productMake').value = product.make || '';
            document.getElementById('productSpecification').value = product.specification || '';
            document.getElementById('productPrice').value = product.price || '';
            document.getElementById('productUOM').value = product.uomCode || product.unit || '';
            document.getElementById('productUnitQty').value = product.unitQuantity || '';
            document.getElementById('productImage').value = product.image || '';
            document.getElementById('productSaveBtn').innerHTML = '<i class="fas fa-save"></i> Update Product';
            document.getElementById('productCancelBtn').style.display = 'inline-block';
            
            // Scroll to form
            document.querySelector('#products-tab .form-section').scrollIntoView({ behavior: 'smooth' });
        }
    }).catch(error => {
        console.error('Error loading product for edit:', error);
        showToast('Error loading product', 'error');
    });
}

function cancelProductEdit() {
    document.getElementById('productForm').reset();
    document.getElementById('productEditId').value = '';
    document.getElementById('productSaveBtn').innerHTML = '<i class="fas fa-plus"></i> Add Product';
    document.getElementById('productCancelBtn').style.display = 'none';
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        await productsCollection.doc(productId).delete();
        showToast('Product deleted successfully!');
        loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Error deleting product', 'error');
    }
}

// ORDERS MANAGEMENT
async function loadOrders() {
    try {
        const snapshot = await ordersCollection.orderBy('date', 'desc').get();
        const tbody = document.getElementById('ordersTableBody');
        
        if (snapshot.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-receipt"></i>
                        <p>No orders yet. Orders will appear here when customers make purchases.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = '';
        snapshot.forEach(doc => {
            const order = doc.data();
            const row = `
                <tr>
                    <td data-label="Order ID"><strong>${order.id}</strong></td>
                    <td data-label="Date">${new Date(order.date).toLocaleString('en-IN')}</td>
                    <td data-label="Customer">${order.customerPhone || 'N/A'}</td>
                    <td data-label="Total"><strong>${order.total} ₹</strong></td>
                    <td data-label="Status">
                        <span class="status-badge" style="background: ${getStatusColor(order.status)}; color: white;">
                            ${order.status}
                        </span>
                    </td>
                    <td class="action-buttons">
                        <button class="btn btn-secondary btn-sm" onclick="viewOrderDetails('${doc.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteOrder('${doc.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
        
        updateStats();
    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('Error loading orders', 'error');
    }
}

function getStatusColor(status) {
    const colors = {
        'pending': '#f59e0b',
        'confirmed': '#10b981',
        'delivered': '#3b82f6',
        'cancelled': '#ef4444'
    };
    return colors[status] || '#6b7280';
}

async function viewOrderDetails(orderId) {
    try {
        const doc = await ordersCollection.doc(orderId).get();
        const order = doc.data();
        
        let itemsList = order.items.map(item => 
            `${item.name} x${item.quantity} - ${item.total} kr`
        ).join('\n');
        
        let addressInfo = '';
        if (order.address) {
            addressInfo = `\n\nDelivery Address:\n${order.address.fullName}\n${order.address.streetAddress}\n${order.address.city}, ${order.address.postalCode}\nPhone: ${order.address.phone}`;
        }
        
        alert(`Order Details:\n\nOrder ID: ${order.id}\nDate: ${new Date(order.date).toLocaleString()}\nTotal: ${order.total} kr\nStatus: ${order.status}\n\nItems:\n${itemsList}${addressInfo}`);
    } catch (error) {
        console.error('Error viewing order:', error);
        showToast('Error loading order details', 'error');
    }
}

async function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
        await ordersCollection.doc(orderId).delete();
        showToast('Order deleted successfully!');
        loadOrders();
    } catch (error) {
        console.error('Error deleting order:', error);
        showToast('Error deleting order', 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    updateStats();
});
