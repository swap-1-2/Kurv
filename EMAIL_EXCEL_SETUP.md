# Email Setup with Excel/CSV Enquiry Format

## Overview
The application now sends enquiry details in **CSV format** via email, which can be easily opened in Excel. The email includes:
- Enquiry summary in readable format
- Complete CSV data that can be copied to Excel
- All product details: Item Number, Category, Name, Make, Specification, Price, Quantity, UOM

## Setup Instructions

### Option 1: EmailJS (Recommended - Easy Setup)

#### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

#### 2. Add Email Service
1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the connection instructions
5. Note down your **Service ID** (e.g., `service_abc123`)

#### 3. Create Email Template
1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template structure:

**Subject:**
```
New Enquiry {{order_id}} - Swati Enterprises
```

**Email Body (HTML):**
```html
<h2>New Enquiry Received</h2>

<div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h3>Enquiry Details</h3>
    <p><strong>Enquiry ID:</strong> {{order_id}}</p>
    <p><strong>Order Date:</strong> {{order_date}}</p>
    <p><strong>Total Items:</strong> {{item_count}}</p>
    <p><strong>Total Amount:</strong> {{order_total}}</p>
</div>

<div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h3>Customer Information</h3>
    <p><strong>Name:</strong> {{customer_name}}</p>
    <p><strong>Phone:</strong> {{customer_phone}}</p>
    <p><strong>Company:</strong> {{company_name}}</p>
    <p><strong>GSTIN:</strong> {{gstin}}</p>
</div>

<div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h3>Delivery Address</h3>
    <pre style="white-space: pre-wrap; font-family: Arial;">{{delivery_address}}</pre>
</div>

<div style="background: #fff9e6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffa502;">
    <h3>💬 Additional Requirements / Notes</h3>
    <p style="white-space: pre-wrap; font-family: Arial; line-height: 1.6; color: #333;">{{additional_notes}}</p>
</div>

<div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h3>Enquiry Items</h3>
    <ul>
        {{{order_items_html}}}
    </ul>
</div>

<div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #4caf50;">
    <h3>📊 CSV Data for Excel (Copy the text below)</h3>
    <p style="color: #666; font-size: 13px;">Select all the text in the box below, copy it, and paste into Excel or Google Sheets</p>
    <pre style="background: white; padding: 15px; border-radius: 5px; overflow-x: auto; font-family: 'Courier New', monospace; font-size: 12px; border: 1px solid #ddd;">{{order_csv}}</pre>
    <p style="color: #666; font-size: 12px; margin-top: 10px;">
        💡 <strong>How to use:</strong><br>
        1. Copy the CSV data above<br>
        2. Open Excel or Google Sheets<br>
        3. Paste the data (Ctrl+V or Cmd+V)<br>
        4. Use "Text to Columns" feature if needed<br>
        5. The data will be automatically organized into columns
    </p>
</div>

<div style="background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6;">
    <h3>📋 Detailed Item List</h3>
    <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.6;">{{order_items_text}}</pre>
</div>

<hr style="margin: 30px 0; border: none; border-top: 2px solid #ddd;">

<p style="color: #666; font-size: 13px;">
    This is an automated email from Swati Enterprises enquiry management system.<br>
    Please process this enquiry at your earliest convenience.
</p>
```

4. Click **Save** and note your **Template ID** (e.g., `template_xyz789`)

#### 4. Get Your User ID
1. Go to **Account** > **General**
2. Find your **Public Key** (also called User ID)
3. Copy it (e.g., `user_def456`)

#### 5. Update Code
Open `app.js` and find the `sendEmailViaEmailJS` function around line 1419. Replace:

```javascript
await emailjs.send(
    'your_service_id',    // Replace with your Service ID
    'your_template_id',   // Replace with your Template ID  
    templateParams,
    'your_user_id'        // Replace with your Public Key
);
```

With your actual IDs:

```javascript
await emailjs.send(
    'service_abc123',     // Your Service ID
    'template_xyz789',    // Your Template ID  
    templateParams,
    'user_def456'         // Your Public Key
);
```

#### 6. Set Email Recipient
In your EmailJS template settings:
1. Click on your template
2. Go to **Settings** tab
3. Set **To Email** to your business email (e.g., `orders@swatienterprises.com`)
4. You can add multiple recipients separated by commas

#### 7. Test the System
1. Place a test order in your app
2. Check your email inbox
3. Copy the CSV data from the email
4. Paste it into Excel to verify it works correctly

---

### Option 2: Firebase Cloud Functions (Advanced)

If you want to use Firebase Cloud Functions for more professional email delivery:

#### 1. Install SendGrid or Similar
```bash
cd functions
npm install @sendgrid/mail
```

#### 2. Create Function
Add to `functions/src/index.ts`:

```typescript
import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';

sgMail.setApiKey(functions.config().sendgrid.key);

export const sendOrderConfirmation = functions.https.onCall(async (data, context) => {
    const { order } = data;
    
    // Create CSV content
    const csvHeader = 'Item Number,Category,Product Name,Make,Specification,Unit Price,Quantity,Total Price,UOM\n';
    const csvData = order.items.map((item: any) => {
        return `${item.itemNumber},${item.category},"${item.name}",${item.make},"${item.specification}",${item.price},${item.quantity},${item.price * item.quantity},${item.uomCode}`;
    }).join('\n');
    
    const msg = {
        to: 'orders@swatienterprises.com',
        from: 'noreply@swatienterprises.com',
        subject: `New Order ${order.id} - Swati Enterprises`,
        text: csvHeader + csvData,
        html: `<h2>Order ${order.id}</h2><pre>${csvHeader + csvData}</pre>`
    };
    
    await sgMail.send(msg);
    return { success: true };
});
```

#### 3. Set API Key
```bash
firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
```

#### 4. Deploy
```bash
firebase deploy --only functions
```

---

## CSV Format Details

The email includes CSV data with these columns:
1. **Item Number** - Product item/SKU number
2. **Category** - Product category
3. **Product Name** - Full product name
4. **Make** - Manufacturer/brand
5. **Specification** - Technical specifications
6. **Unit Price** - Price per unit (₹)
7. **Quantity** - Ordered quantity
8. **Total Price** - Line total (₹)
9. **UOM** - Unit of Measurement

The CSV data can be directly copied from the email and pasted into:
- Microsoft Excel
- Google Sheets
- LibreOffice Calc
- Any CSV-compatible software

---

## Email Template Variables Reference

Use these variables in your EmailJS template:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{order_id}}` | Enquiry ID | ORD-1699999999999 |
| `{{order_date}}` | Enquiry date and time | 8 Nov 2025, 10:30 AM |
| `{{order_total}}` | Total amount | ₹15,450 |
| `{{item_count}}` | Number of items | 5 |
| `{{customer_name}}` | Customer full name | Rajesh Kumar |
| `{{customer_phone}}` | Customer phone | +91 9876543210 |
| `{{customer_email}}` | Customer email | customer@example.com |
| `{{company_name}}` | Company name | ABC Industries |
| `{{gstin}}` | GST number | 27XXXXX1234X1Z5 |
| `{{delivery_address}}` | Complete address | Formatted address block |
| `{{additional_notes}}` | Customer's notes | Special requirements/questions |
| `{{{order_items_html}}}` | HTML list of items | (Use 3 braces) |
| `{{order_items_text}}` | Plain text items | Formatted text list |
| `{{order_csv}}` | CSV formatted data | Complete CSV content |

**Note:** Use triple braces `{{{ }}}` for HTML content to prevent escaping.

---

## Troubleshooting

### Email not sending
1. Check browser console for errors
2. Verify EmailJS credentials in `app.js`
3. Check EmailJS dashboard for quota limits (100 free emails/month)
4. Ensure internet connection is active

### CSV not formatting correctly in Excel
1. Copy the entire CSV block including headers
2. In Excel, use "Paste Special" > "Text"
3. Use "Data" > "Text to Columns" > "Delimited" > "Comma"

### Missing order details
1. Verify all product fields are filled in admin panel
2. Check that products have itemNumber, make, specification, etc.
3. Check browser console for JavaScript errors

---

## Cost & Limits

### EmailJS Free Tier:
- 200 emails/month
- 2 email services
- 2 email templates
- Community support

### EmailJS Pro ($15/month):
- 50,000 emails/month
- Priority support
- Custom domains
- Advanced features

---

## Support

For setup help or issues:
1. Check the browser console (F12) for error messages
2. Review EmailJS dashboard for delivery status
3. Test with a simple order first
4. Verify all IDs are correctly entered

---

**Last Updated:** 8 November 2025
