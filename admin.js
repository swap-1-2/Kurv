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
const servicesCollection = db.collection('services');
const solutionsCollection = db.collection('solutions');

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
    } else if (tabName === 'services') {
        loadServices();
    } else if (tabName === 'solutions') {
        loadSolutions();
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
            
            // Check if icon is an image URL or data URL
            const isImageUrl = category.icon && (category.icon.startsWith('http://') || category.icon.startsWith('https://') || category.icon.startsWith('data:image/'));
            const iconDisplay = isImageUrl 
                ? `<img src="${category.icon}" alt="${category.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px;">` 
                : (category.icon || '-');
            
            rowsHTML += `
                <tr>
                    <td data-label="ID"><strong>${category.id}</strong></td>
                    <td data-label="Name">${category.name || '-'}</td>
                    <td data-label="Icon" class="icon-preview">${iconDisplay}</td>
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

// Handle category icon file upload
function handleCategoryIconUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
    }
    
    // Check file size (limit to 5MB for original file)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Create an image to compress it
        const img = new Image();
        img.onload = function() {
            // Create canvas to resize/compress image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set maximum dimensions (smaller images = smaller data URLs)
            const maxWidth = 200;
            const maxHeight = 200;
            let width = img.width;
            let height = img.height;
            
            // Calculate new dimensions maintaining aspect ratio
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw resized image
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to data URL with compression (quality 0.7 for good balance)
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            // Check if compressed image is still too large
            const sizeInBytes = (compressedDataUrl.length * 3) / 4;
            if (sizeInBytes > 900000) { // 900KB limit to be safe
                showToast('Image is still too large after compression. Please use a smaller image.', 'error');
                return;
            }
            
            // Set the compressed data URL to the icon input field
            document.getElementById('categoryIcon').value = compressedDataUrl;
            showToast('Image uploaded and compressed successfully!');
        };
        img.onerror = function() {
            showToast('Error loading image', 'error');
        };
        img.src = e.target.result;
    };
    reader.onerror = function() {
        showToast('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
}

function handleProductImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
    }
    
    // Check file size (limit to 5MB for original file)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Create an image to compress it
        const img = new Image();
        img.onload = function() {
            // Create canvas to resize/compress image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set maximum dimensions (smaller images = smaller data URLs)
            const maxWidth = 200;
            const maxHeight = 200;
            let width = img.width;
            let height = img.height;
            
            // Calculate new dimensions maintaining aspect ratio
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw resized image
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to data URL with compression (quality 0.7 for good balance)
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            // Check if compressed image is still too large
            const sizeInBytes = (compressedDataUrl.length * 3) / 4;
            if (sizeInBytes > 900000) { // 900KB limit to be safe
                showToast('Image is still too large after compression. Please use a smaller image.', 'error');
                return;
            }
            
            // Set the compressed data URL to the product image input field
            document.getElementById('productImage').value = compressedDataUrl;
            showToast('Image uploaded and compressed successfully!');
        };
        img.onerror = function() {
            showToast('Error loading image', 'error');
        };
        img.src = e.target.result;
    };
    reader.onerror = function() {
        showToast('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
}

function handleSolutionIconUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
    }
    
    // Check file size (limit to 5MB for original file)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Create an image to compress it
        const img = new Image();
        img.onload = function() {
            // Create canvas to resize/compress image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set maximum dimensions (smaller images = smaller data URLs)
            const maxWidth = 200;
            const maxHeight = 200;
            let width = img.width;
            let height = img.height;
            
            // Calculate new dimensions maintaining aspect ratio
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw resized image
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to data URL with compression (quality 0.7 for good balance)
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            // Check if compressed image is still too large
            const sizeInBytes = (compressedDataUrl.length * 3) / 4;
            if (sizeInBytes > 900000) { // 900KB limit to be safe
                showToast('Image is still too large after compression. Please use a smaller image.', 'error');
                return;
            }
            
            // Set the compressed data URL to the solution icon input field
            document.getElementById('solutionIcon').value = compressedDataUrl;
            showToast('Image uploaded and compressed successfully!');
        };
        img.onerror = function() {
            showToast('Error loading image', 'error');
        };
        img.src = e.target.result;
    };
    reader.onerror = function() {
        showToast('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
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
                    <td data-label="Category"><span class="status-badge" style="background: #3B82F6; color: white;">${product.category || '-'}</span></td>
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
        name: document.getElementById('productName').value.trim() || '',
        make: document.getElementById('productMake').value.trim() || '',
        specification: document.getElementById('productSpecification').value.trim() || '',
        description: document.getElementById('productDescription').value.trim() || '',
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
            document.getElementById('productName').value = product.name || '';
            document.getElementById('productMake').value = product.make || '';
            document.getElementById('productSpecification').value = product.specification || '';
            document.getElementById('productDescription').value = product.description || '';
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

// ENQUIRIES MANAGEMENT
async function loadOrders() {
    try {
        const snapshot = await ordersCollection.orderBy('date', 'desc').get();
        const tbody = document.getElementById('ordersTableBody');
        
        if (snapshot.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-receipt"></i>
                        <p>No enquiries yet. Enquiries will appear here when customers submit requests.</p>
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
                    <td data-label="Enquiry ID"><strong>${order.id}</strong></td>
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
        console.error('Error loading enquiries:', error);
        showToast('Error loading enquiries', 'error');
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
        
        let itemsList = '';
        if (order.items && order.items.length > 0) {
            itemsList = order.items.map(item => 
                `  • ${item.name} (${item.itemNumber || 'N/A'}) x${item.quantity} - ₹${item.total || '0'}`
            ).join('\n');
        } else {
            itemsList = '  No items';
        }
        
        let contactInfo = '\n\n📞 CUSTOMER CONTACT INFORMATION:\n';
        contactInfo += `Name: ${order.address?.fullName || 'Not provided'}\n`;
        contactInfo += `Email: ${order.customerEmail || 'Not provided'}\n`;
        contactInfo += `Phone: ${order.customerPhone || order.address?.phone || 'Not provided'}\n`;
        
        let companyInfo = '';
        if (order.address?.companyName && order.address.companyName !== 'Not provided') {
            companyInfo = '\n\n🏢 COMPANY INFORMATION:\n';
            companyInfo += `Company: ${order.address.companyName}\n`;
            if (order.address.gstin && order.address.gstin !== 'Not provided') {
                companyInfo += `GSTIN: ${order.address.gstin}\n`;
            }
        }
        
        let addressInfo = '';
        if (order.address) {
            addressInfo = '\n\n📍 DELIVERY ADDRESS:\n';
            if (order.address.streetAddress && order.address.streetAddress !== 'Not provided') {
                addressInfo += `${order.address.streetAddress}\n`;
            }
            if (order.address.landmark) {
                addressInfo += `Landmark: ${order.address.landmark}\n`;
            }
            if (order.address.city && order.address.city !== 'Not provided') {
                addressInfo += `${order.address.city}`;
                if (order.address.postalCode) {
                    addressInfo += ` - ${order.address.postalCode}`;
                }
                addressInfo += '\n';
            }
            if (order.address.type) {
                addressInfo += `Address Type: ${order.address.type}\n`;
            }
        }
        
        let additionalInfo = '';
        if (order.additionalNotes && order.additionalNotes.trim()) {
            additionalInfo = `\n\n💬 ADDITIONAL REQUIREMENTS/COMMENTS:\n${order.additionalNotes}`;
        }
        
        const orderDate = order.date ? new Date(order.date).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }) : 'N/A';
        
        alert(`📋 ENQUIRY DETAILS\n\n` +
              `Order ID: ${order.id}\n` +
              `Date: ${orderDate}\n` +
              `Status: ${order.status || 'Pending'}\n` +
              `Total: ₹${order.total || '0'}\n\n` +
              `🛒 ENQUIRY ITEMS:\n${itemsList}` +
              contactInfo +
              companyInfo +
              addressInfo +
              additionalInfo);
    } catch (error) {
        console.error('Error viewing enquiry:', error);
        showToast('Error loading enquiry details', 'error');
    }
}

async function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    
    try {
        await ordersCollection.doc(orderId).delete();
        showToast('Enquiry deleted successfully!');
        loadOrders();
    } catch (error) {
        console.error('Error deleting enquiry:', error);
        showToast('Error deleting enquiry', 'error');
    }
}

// SOLUTIONS MANAGEMENT
async function loadSolutions() {
    try {
        const snapshot = await solutionsCollection.get();
        const tbody = document.getElementById('solutionsTableBody');
        
        console.log('Loading solutions, found:', snapshot.size);
        
        if (snapshot.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <i class="fas fa-lightbulb"></i>
                        <p>No solutions found. Add your first solution above!</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = '';
        snapshot.forEach(doc => {
            const solution = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${solution.id || doc.id}</td>
                <td>${solution.title || 'N/A'}</td>
                <td><i class="fas ${solution.icon || 'fa-lightbulb'}"></i></td>
                <td>${solution.description || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-edit" onclick="editSolution('${doc.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteSolution('${doc.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading solutions:', error);
        showToast('Error loading solutions', 'error');
    }
}

async function loadServices() {
    try {
        const snapshot = await servicesCollection.get();
        const tbody = document.getElementById('servicesTableBody');
        
        console.log('Loading services, found:', snapshot.size);
        
        if (snapshot.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <i class="fas fa-cogs"></i>
                        <p>No services found. Add your first service above!</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = '';
        snapshot.forEach(doc => {
            const service = doc.data();
            
            // Display icon (check if it's a data URL or Font Awesome class)
            const isImageUrl = service.icon && (service.icon.startsWith('http://') || service.icon.startsWith('https://') || service.icon.startsWith('data:'));
            const iconDisplay = isImageUrl 
                ? `<img src="${service.icon}" alt="${service.title}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">` 
                : `<i class="fas ${service.icon || 'fa-cogs'}"></i>`;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.id || doc.id}</td>
                <td>${service.title || 'N/A'}</td>
                <td>${iconDisplay}</td>
                <td>${service.description || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-edit" onclick="editService('${doc.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteService('${doc.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading services:', error);
        showToast('Error loading services', 'error');
    }
}

async function saveSolution(event) {
    event.preventDefault();
    
    const solutionData = {
        id: document.getElementById('solutionId').value.trim(),
        title: document.getElementById('solutionTitle').value.trim(),
        icon: document.getElementById('solutionIcon').value.trim() || 'fa-lightbulb',
        description: document.getElementById('solutionDescription').value.trim(),
        specification: document.getElementById('solutionSpecification').value.trim() || '',
        detailedDescription: document.getElementById('solutionDetailedDescription').value.trim() || ''
    };
    
    const editId = document.getElementById('solutionEditId').value;
    
    try {
        if (editId) {
            // Update existing solution
            await solutionsCollection.doc(editId).update(solutionData);
            showToast('Solution updated successfully!');
        } else {
            // Add new solution
            await solutionsCollection.doc(solutionData.id).set(solutionData);
            showToast('Solution added successfully!');
        }
        
        document.getElementById('solutionForm').reset();
        document.getElementById('solutionEditId').value = '';
        document.getElementById('solutionSaveBtn').innerHTML = '<i class="fas fa-plus"></i> Add Solution';
        document.getElementById('solutionCancelBtn').style.display = 'none';
        loadSolutions();
        updateStats();
    } catch (error) {
        console.error('Error saving solution:', error);
        showToast('Error saving solution: ' + error.message, 'error');
    }
}

async function editSolution(solutionId) {
    try {
        const doc = await solutionsCollection.doc(solutionId).get();
        if (!doc.exists) {
            showToast('Solution not found', 'error');
            return;
        }
        
        const solution = doc.data();
        document.getElementById('solutionEditId').value = solutionId;
        document.getElementById('solutionId').value = solution.id || solutionId;
        document.getElementById('solutionTitle').value = solution.title || '';
        document.getElementById('solutionIcon').value = solution.icon || 'fa-lightbulb';
        document.getElementById('solutionDescription').value = solution.description || '';
        document.getElementById('solutionSpecification').value = solution.specification || '';
        document.getElementById('solutionDetailedDescription').value = solution.detailedDescription || '';
        
        document.getElementById('solutionSaveBtn').innerHTML = '<i class="fas fa-save"></i> Update Solution';
        document.getElementById('solutionCancelBtn').style.display = 'inline-block';
        
        // Scroll to form
        document.getElementById('solutionForm').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error loading solution:', error);
        showToast('Error loading solution', 'error');
    }
}

function cancelSolutionEdit() {
    document.getElementById('solutionForm').reset();
    document.getElementById('solutionEditId').value = '';
    document.getElementById('solutionSaveBtn').innerHTML = '<i class="fas fa-plus"></i> Add Solution';
    document.getElementById('solutionCancelBtn').style.display = 'none';
}

async function deleteSolution(solutionId) {
    if (!confirm('Are you sure you want to delete this solution?')) {
        return;
    }
    
    try {
        await solutionsCollection.doc(solutionId).delete();
        showToast('Solution deleted successfully!');
        loadSolutions();
        updateStats();
    } catch (error) {
        console.error('Error deleting solution:', error);
        showToast('Error deleting solution', 'error');
    }
}

// Services Management Functions
async function saveService(event) {
    event.preventDefault();
    
    const serviceData = {
        id: document.getElementById('serviceId').value.trim(),
        title: document.getElementById('serviceTitle').value.trim(),
        icon: document.getElementById('serviceIcon').value.trim() || 'fa-cogs',
        description: document.getElementById('serviceDescription').value.trim(),
        specification: document.getElementById('serviceSpecification').value.trim() || '',
        detailedDescription: document.getElementById('serviceDetailedDescription').value.trim() || ''
    };
    
    const editId = document.getElementById('serviceEditId').value;
    
    try {
        if (editId) {
            // Update existing service
            await servicesCollection.doc(editId).update(serviceData);
            showToast('Service updated successfully!');
        } else {
            // Add new service
            await servicesCollection.doc(serviceData.id).set(serviceData);
            showToast('Service added successfully!');
        }
        
        document.getElementById('serviceForm').reset();
        document.getElementById('serviceEditId').value = '';
        document.getElementById('serviceSaveBtn').innerHTML = '<i class="fas fa-plus"></i> Add Service';
        document.getElementById('serviceCancelBtn').style.display = 'none';
        loadServices();
        updateStats();
    } catch (error) {
        console.error('Error saving service:', error);
        showToast('Error saving service: ' + error.message, 'error');
    }
}

async function editService(serviceId) {
    try {
        const doc = await servicesCollection.doc(serviceId).get();
        if (!doc.exists) {
            showToast('Service not found', 'error');
            return;
        }
        
        const service = doc.data();
        document.getElementById('serviceEditId').value = serviceId;
        document.getElementById('serviceId').value = service.id || serviceId;
        document.getElementById('serviceTitle').value = service.title || '';
        document.getElementById('serviceIcon').value = service.icon || 'fa-cogs';
        document.getElementById('serviceDescription').value = service.description || '';
        document.getElementById('serviceSpecification').value = service.specification || '';
        document.getElementById('serviceDetailedDescription').value = service.detailedDescription || '';
        
        document.getElementById('serviceSaveBtn').innerHTML = '<i class="fas fa-save"></i> Update Service';
        document.getElementById('serviceCancelBtn').style.display = 'inline-block';
        
        // Scroll to form
        document.getElementById('serviceForm').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error loading service:', error);
        showToast('Error loading service', 'error');
    }
}

function cancelServiceEdit() {
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceEditId').value = '';
    document.getElementById('serviceSaveBtn').innerHTML = '<i class="fas fa-plus"></i> Add Service';
    document.getElementById('serviceCancelBtn').style.display = 'none';
}

async function deleteService(serviceId) {
    if (!confirm('Are you sure you want to delete this service?')) {
        return;
    }
    
    try {
        await servicesCollection.doc(serviceId).delete();
        showToast('Service deleted successfully!');
        loadServices();
        updateStats();
    } catch (error) {
        console.error('Error deleting service:', error);
        showToast('Error deleting service', 'error');
    }
}

function handleServiceIconUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
    }
    
    // Check file size (limit to 5MB for original file)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Create an image to compress it
        const img = new Image();
        img.onload = function() {
            // Create canvas to resize/compress image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set maximum dimensions (smaller images = smaller data URLs)
            const maxWidth = 200;
            const maxHeight = 200;
            let width = img.width;
            let height = img.height;
            
            // Calculate new dimensions maintaining aspect ratio
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw resized image
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to data URL with compression (quality 0.7 for good balance)
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            // Check if compressed image is still too large
            const sizeInBytes = (compressedDataUrl.length * 3) / 4;
            if (sizeInBytes > 900000) { // 900KB limit to be safe
                showToast('Image is still too large after compression. Please use a smaller image.', 'error');
                return;
            }
            
            // Set the compressed data URL to the service icon input field
            document.getElementById('serviceIcon').value = compressedDataUrl;
            showToast('Image uploaded and compressed successfully!');
        };
        img.onerror = function() {
            showToast('Error loading image', 'error');
        };
        img.src = e.target.result;
    };
    reader.onerror = function() {
        showToast('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
}

// Download enquiries as Excel
async function downloadOrdersExcel() {
    try {
        const snapshot = await ordersCollection.orderBy('date', 'desc').get();
        
        if (snapshot.empty) {
            showToast('No enquiries to download', 'warning');
            return;
        }
        
        // Prepare CSV data
        let csv = 'Enquiry ID,Date,Customer Name,Customer Email,Customer Phone,Company Name,GSTIN,Street Address,City,Postal Code,Landmark,Address Type,Items,Quantity,Total Amount,Status,Additional Requirements\n';
        
        snapshot.forEach(doc => {
            const order = doc.data();
            const orderDate = order.date ? new Date(order.date).toLocaleString('en-IN') : 'N/A';
            
            // Customer info
            const customerName = order.address?.fullName || 'N/A';
            const customerEmail = order.customerEmail || 'N/A';
            const customerPhone = order.customerPhone || order.address?.phone || 'N/A';
            
            // Company info
            const companyName = order.address?.companyName && order.address.companyName !== 'Not provided' ? order.address.companyName : '';
            const gstin = order.address?.gstin && order.address.gstin !== 'Not provided' ? order.address.gstin : '';
            
            // Address info
            const streetAddress = order.address?.streetAddress && order.address.streetAddress !== 'Not provided' ? order.address.streetAddress : '';
            const city = order.address?.city && order.address.city !== 'Not provided' ? order.address.city : '';
            const postalCode = order.address?.postalCode || '';
            const landmark = order.address?.landmark || '';
            const addressType = order.address?.type || '';
            
            // Items info
            const itemsList = order.items && order.items.length > 0 
                ? order.items.map(item => `${item.name} (${item.itemNumber || 'N/A'})`).join('; ')
                : 'No items';
            const totalQuantity = order.items && order.items.length > 0
                ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
                : 0;
            
            const total = order.total || '0';
            const status = order.status || 'Pending';
            const additionalNotes = order.additionalNotes ? order.additionalNotes.replace(/"/g, '""').replace(/\n/g, ' ') : '';
            
            // Escape quotes in fields
            const escapeCSV = (str) => `"${String(str).replace(/"/g, '""')}"`;
            
            csv += `${escapeCSV(order.id)},${escapeCSV(orderDate)},${escapeCSV(customerName)},${escapeCSV(customerEmail)},${escapeCSV(customerPhone)},${escapeCSV(companyName)},${escapeCSV(gstin)},${escapeCSV(streetAddress)},${escapeCSV(city)},${escapeCSV(postalCode)},${escapeCSV(landmark)},${escapeCSV(addressType)},${escapeCSV(itemsList)},${totalQuantity},${escapeCSV(total)},${escapeCSV(status)},${escapeCSV(additionalNotes)}\n`;
        });
        
        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const filename = `enquiries_${new Date().toISOString().split('T')[0]}.csv`;
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Enquiries downloaded successfully!');
    } catch (error) {
        console.error('Error downloading enquiries:', error);
        showToast('Error downloading enquiries', 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    updateStats();
});
