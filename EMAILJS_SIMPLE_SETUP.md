# 🚀 Quick EmailJS Setup (No App Passwords Needed!)

Since Gmail App Passwords can be tricky to find, let's use EmailJS instead - it's much simpler!

## **Step 1: Create EmailJS Account**
1. Go to https://www.emailjs.com/
2. Sign up with your Gmail (swapnil29joshi@gmail.com)
3. It's free for up to 200 emails/month

## **Step 2: Add Email Service**
1. In EmailJS dashboard, click **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail"**
4. Follow the OAuth setup (much easier than App Passwords!)

## **Step 3: Create Email Template**
1. Click **"Email Templates"**
2. Click **"Create New Template"**
3. Use this template:

**Subject:** `New Order #{{order_id}} - ₹{{order_total}}`

**Content:**
```
🛒 New Order Received!

Order Details:
- Order ID: {{order_id}}
- Customer Phone: {{customer_phone}}
- Order Date: {{order_date}}
- Total Amount: ₹{{order_total}}

Items Ordered:
{{{order_items}}}

Delivery Address: {{delivery_address}}

Contact customer at {{customer_phone}} for confirmation.
```

## **Step 4: Get Your IDs**
After setup, you'll get:
- **Service ID**: service_xxxxxxx
- **Template ID**: template_xxxxxxx  
- **User ID**: user_xxxxxxxxxx

## **Step 5: Update Your App**
I'll update your app.js to use EmailJS instead of Firebase Functions - much simpler!