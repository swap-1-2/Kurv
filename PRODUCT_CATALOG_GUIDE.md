# 📦 Enhanced Product Catalog System

## New Features Added

### ✅ Enhanced Product Information

Your product catalog now supports comprehensive information:

| Field | Description | Required | Example |
|-------|-------------|----------|---------|
| **Item Number** | Unique product identifier | ✅ Yes | ITM-001, FRUIT-BAN-001 |
| **Category** | Main category | ✅ Yes | fruits, beverages |
| **Sub Category** | Product subcategory | No | Fresh Fruits, Citrus, Organic |
| **Name** | Product name | ✅ Yes | Organic Banana |
| **Specification** | Product details/grade | No | Premium Quality, Grade A, Fresh |
| **Price** | Price in NOK | ✅ Yes | 25.00 |
| **Product UOM Code** | Unit of Measure | ✅ Yes | KG, PC, L, etc. |
| **Unit Quantity** | Quantity description | No | 500g, 1L, 12 pack |
| **Image** | URL or Emoji | No | https://... or 🍌 |

### 🎨 Image Support

**Two Ways to Add Images:**

1. **Image URL** (Recommended for professional look):
   ```
   https://example.com/images/banana.jpg
   https://cdn.shopify.com/product.png
   ```

2. **Emoji** (Quick and easy):
   ```
   🍌 🍎 🥤 🍞 🧀
   ```

**How It Works:**
- If URL (starts with http:// or https://): Displays actual image
- Otherwise: Displays emoji/text

### 📊 UOM Codes (Unit of Measure)

Pre-defined standard codes:

- **KG** - Kilogram (for fruits, vegetables, meat)
- **G** - Gram (for spices, small items)
- **L** - Liter (for liquids)
- **ML** - Milliliter (for small liquid quantities)
- **PC** - Piece (individual items)
- **PK** - Pack (packaged items)
- **BX** - Box (boxed items)
- **DZ** - Dozen (12 pieces)
- **EA** - Each (individual units)

## 📝 How to Add Products

### Step 1: Open Admin Panel
```bash
open admin.html
```

### Step 2: Go to Products Tab

### Step 3: Fill in Product Information

**Example 1: Product with Image URL**
```
Category: fruits
Sub Category: Fresh Fruits
Item Number: FRUIT-BAN-001
Name: Organic Banana
Specification: Premium Quality, Grade A
Price: 40.00
UOM Code: KG
Unit Quantity: 1kg
Image URL: https://example.com/banana.jpg
```

**Example 2: Product with Emoji**
```
Category: beverages
Sub Category: Soft Drinks
Item Number: BEV-COLA-001
Name: Coca Cola
Specification: Regular, 330ml Can
Price: 25.00
UOM Code: PC
Unit Quantity: 1 can
Image: 🥤
```

**Example 3: Minimal Product**
```
Category: snacks
Item Number: SNK-CHIPS-001
Name: Potato Chips
Price: 30.00
UOM Code: PK
Image: 🍟
```

## 🎯 Database Structure

### Product Document in Firestore:
```javascript
{
  itemNumber: "FRUIT-BAN-001",      // Document ID
  category: "fruits",
  subCategory: "Fresh Fruits",
  name: "Organic Banana",
  specification: "Premium Quality, Grade A",
  price: 40.00,
  uomCode: "KG",
  unitQuantity: "1kg",
  image: "https://example.com/banana.jpg",
  
  // Backward compatibility fields
  id: "FRUIT-BAN-001",
  unit: "KG"
}
```

## 📱 How It Displays

### In Product Catalog:
```
┌──────────────────┐
│   [Image/Emoji]  │
│   Product Name   │
│  Sub Category    │ (if available)
│  40 kr/KG - Spec │
│   [ - ] 0 [ + ]  │
└──────────────────┘
```

### In Cart:
```
[Img] Product Name
      Specification
      40 kr/KG
      [ - ] 2 [ + ]  80.00 kr
```

### In Admin Table:
```
Item Number | Category | Sub Cat | Name | Spec | Price | UOM | Image | Actions
FRUIT-001   | fruits   | Fresh   | Ban  | A    | 40kr  | KG  | [img] | Delete
```

## 🔄 Sample Data to Test

Copy this into admin panel:

### Category 1: Fruits
```
Category: fruits
Name: Fruits & Vegetables
Icon: 🥬
Description: Fresh Produce
Color: #4CAF50
```

### Product 1: Banana
```
Category: fruits
Sub Category: Fresh Fruits
Item Number: FRUIT-BAN-001
Name: Organic Banana
Specification: Grade A, Premium
Price: 40.00
UOM Code: KG
Unit Quantity: 1kg
Image: 🍌
```

### Product 2: Apple
```
Category: fruits
Sub Category: Fresh Fruits
Item Number: FRUIT-APP-001
Name: Red Apple
Specification: Imported, Fresh
Price: 120.00
UOM Code: KG
Unit Quantity: 1kg
Image: 🍎
```

### Category 2: Beverages
```
Category: beverages
Name: Beverages
Icon: 🥤
Description: Drinks & Beverages
Color: #FF5722
```

### Product 3: Coca Cola
```
Category: beverages
Sub Category: Soft Drinks
Item Number: BEV-COLA-001
Name: Coca Cola
Specification: 330ml Can
Price: 25.00
UOM Code: PC
Unit Quantity: 1 can
Image: 🥤
```

## 💡 Best Practices

### ✅ DO:
- Use clear, descriptive item numbers (FRUIT-BAN-001, BEV-COLA-001)
- Add specifications for premium products
- Use appropriate UOM codes
- Add subcategories for better organization
- Use high-quality image URLs (1:1 aspect ratio recommended)

### ❌ DON'T:
- Use duplicate item numbers
- Leave required fields empty
- Use very long item numbers (keep under 20 chars)
- Use broken image URLs

## 🖼️ Image Guidelines

### For Best Results:
- **Size**: 400x400px or larger
- **Format**: JPG, PNG, WebP
- **Aspect Ratio**: 1:1 (square)
- **Quality**: High resolution, well-lit
- **Background**: White or transparent

### Free Image Sources:
- Unsplash: https://unsplash.com/
- Pexels: https://pexels.com/
- Pixabay: https://pixabay.com/

### Example Image URLs:
```
https://images.unsplash.com/photo-...
https://cdn.pixabay.com/photo/...
https://images.pexels.com/photos/...
```

## 🔧 Migration from Old Format

Old products still work! The system supports both:

**Old Format:**
```javascript
{
  id: "p1",
  name: "Banana",
  price: 40,
  unit: "kg",
  image: "🍌"
}
```

**New Format:**
```javascript
{
  itemNumber: "FRUIT-BAN-001",
  name: "Organic Banana",
  price: 40,
  uomCode: "KG",
  specification: "Grade A",
  image: "🍌"
}
```

Both will display correctly in the app!

## 📊 Export Your Catalog

You can export your product data from Firestore:

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Select "products" collection
4. Click "Export" (top right)
5. Download as JSON or CSV

## 🎯 Next Steps

1. ✅ Add categories via admin panel
2. ✅ Add products with full details
3. ✅ Test in main app (index.html)
4. ✅ Upload product images to a CDN
5. ✅ Update image URLs in products
6. ✅ Test ordering workflow

## 🆘 Troubleshooting

### Images not showing?
- Check if URL is accessible (open in browser)
- Verify URL starts with http:// or https://
- Check image hosting allows hotlinking
- Try using emoji as fallback

### Product not appearing?
- Verify category exists
- Check item number is unique
- Ensure all required fields filled
- Click reload button (🔄) in main app

### Cart issues?
- Products use itemNumber as ID
- Old products use id
- System handles both automatically

## 📞 Support

For issues:
1. Check browser console (F12)
2. Verify Firestore data
3. Test with emoji first, then image URLs
4. Ensure categories match exactly
