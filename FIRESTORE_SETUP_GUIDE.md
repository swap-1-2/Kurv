# Firestore Integration Guide

## What Has Been Set Up

### 1. **Admin Panel** (`admin.html`)
A complete admin interface where you can:
- ✅ Add/Delete Categories
- ✅ Add/Delete Products  
- ✅ View All Orders
- ✅ Manage your database visually

**Access**: Open `admin.html` in your browser

### 2. **Firestore Database Rules** (`firestore.rules`)
Your database is currently set to testing mode (open access).
⚠️ **Remember to secure these before production!**

### 3. **Updated Main App** (`app.js` & `index.html`)
Your app now:
- ✅ Reads categories from Firestore
- ✅ Reads products from Firestore
- ✅ Saves orders to Firestore
- ✅ Updates in real-time when you add data via admin panel

## How It Works

### For Users (Main App)
1. User opens `index.html`
2. App loads categories and products from Firestore
3. User browses and adds items to cart
4. When order is placed, it's saved to Firestore
5. Admin can see the order immediately

### For Admin
1. Open `admin.html` in browser
2. Use the tabs to manage:
   - **Categories Tab**: Add new product categories
   - **Products Tab**: Add products to categories
   - **Orders Tab**: View all customer orders

## Getting Started

### Step 1: Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Step 2: Add Initial Data via Admin Panel
1. Open `admin.html` in your browser
2. Go to **Categories** tab
3. Add some categories (e.g., "Fruits", "Beverages")
4. Go to **Products** tab
5. Add products to your categories

### Step 3: Test Your App
1. Open `index.html`
2. You should see the categories you added!
3. Click on a category to see products
4. Place a test order
5. Check the **Orders** tab in admin panel

## Database Structure

### Collections:

**`categories`** collection:
```javascript
{
  id: "fruits",
  name: "Fruits & Vegetables",
  icon: "🥬",
  description: "Fresh Produce",
  color: "#4CAF50",
  className: "fruits"
}
```

**`products`** collection:
```javascript
{
  id: "p1",
  category: "fruits",  // Must match a category ID
  name: "Banana",
  price: 40.00,
  unit: "dozen",
  image: "🍌"
}
```

**`orders`** collection:
```javascript
{
  id: "ORD-1730000000000",
  date: "2025-11-04T...",
  customerPhone: "+4796985758",
  customerEmail: "customer@email.com",
  total: "125.50",
  status: "confirmed",
  items: [...],
  address: {...}
}
```

## Real-Time Updates

Your app automatically loads data from Firestore when it starts:
- Categories are loaded once at startup
- Products are loaded once at startup
- Orders are saved immediately when placed

To see new data, users need to refresh the page. If you want live updates, you can implement Firestore real-time listeners.

## Hosting Options

### Option 1: Firebase Hosting (Recommended)
```bash
# Initialize hosting
firebase init hosting

# Select public directory: . (current directory)
# Configure as single-page app: No
# Set up automatic builds: No

# Deploy
firebase deploy --only hosting
```

### Option 2: Local Testing
```bash
# Install a simple HTTP server
npm install -g http-server

# Run in your project directory
http-server

# Access at http://localhost:8080
```

## Security Considerations

⚠️ **IMPORTANT**: Your current Firestore rules allow anyone to read/write!

Before going live, update `firestore.rules` to:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for categories and products
    match /categories/{document=**} {
      allow read: if true;
      allow write: if false; // Only admin can write
    }
    
    match /products/{document=**} {
      allow read: if true;
      allow write: if false; // Only admin can write
    }
    
    // Orders - users can create, but not read others'
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if false; // Only admin
    }
  }
}
```

Then deploy:
```bash
firebase deploy --only firestore:rules
```

## Next Steps

1. **Add Admin Authentication**: Protect your admin panel
2. **Add More Features**: 
   - Edit existing products/categories
   - Update order status
   - Search functionality
3. **Set Up Email Notifications**: Configure Firebase Functions for order emails
4. **Add Images**: Use Firebase Storage for product images instead of emojis

## Troubleshooting

### Data not showing up?
- Check browser console for errors
- Verify Firebase configuration is correct
- Ensure Firestore rules are deployed
- Check that categories/products exist in Firestore

### Admin panel not working?
- Open browser console (F12) to see errors
- Verify Firebase SDK is loaded
- Check that you deployed the rules

### Orders not saving?
- Check browser console for errors
- Verify user is logged in
- Check Firestore rules allow writes to orders collection

## Support

For more help:
- Firebase Documentation: https://firebase.google.com/docs/firestore
- Your project console: https://console.firebase.google.com/project/kurv-mobile-app
