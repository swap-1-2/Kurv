import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";

// Email configuration interface
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
  address?: string;
  additionalNotes?: string;
}

interface EmailData {
  order: Order;
  customerPhone: string;
  customerEmail: string;
}

// Email notification function
export const sendOrderConfirmation = functions.https.onCall(
  async (request: any) => {
    try {
      const data = request.data as EmailData;
      const {order, customerPhone} = data;

      console.log("Processing order confirmation email", {orderId: order.id});

      // Create nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "swapnil29joshi@gmail.com",
          pass: "pzyv jdbl flyf sybm",
        },
      });

      // Generate order items HTML
      const orderItemsHtml = order.items.map((item) =>
        `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; 
          text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; 
          text-align: right;">
          ₹${item.price}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; 
          text-align: right;">
          ₹${item.price * item.quantity}
        </td>
      </tr>`
      ).join("");

      // HTML email template
      const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; 
        margin: 0 auto;">
        <h2 style="color: #667eea;">🛒 New Order Received!</h2>
        
        <div style="background: #f8f9ff; padding: 20px; border-radius: 10px; 
          margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Customer Phone:</strong> ${customerPhone}</p>
          <p><strong>Order Date:</strong> 
            ${new Date(order.date).toLocaleString()}
          </p>
          <p><strong>Delivery Address:</strong> 
            ${order.address || "Default Address"}
          </p>
        </div>

        ${order.additionalNotes ? `
        <div style="background: #fff9e6; padding: 15px; border-radius: 8px; 
          margin: 20px 0; border-left: 4px solid #ffa502;">
          <h3>💬 Additional Requirements / Notes</h3>
          <p style="white-space: pre-wrap; font-family: Arial; 
            line-height: 1.6; color: #333;">
            ${order.additionalNotes}
          </p>
        </div>
        ` : ""}

        <table style="width: 100%; border-collapse: collapse; 
          margin: 20px 0;">
          <thead>
            <tr style="background: #667eea; color: white;">
              <th style="padding: 12px; text-align: left;">Item</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
              <th style="padding: 12px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsHtml}
          </tbody>
          <tfoot>
            <tr style="background: #f0f0f0; font-weight: bold;">
              <td colspan="3" style="padding: 15px; text-align: right;">
                Total Amount:
              </td>
              <td style="padding: 15px; text-align: right; color: #667eea;">
                ₹${order.total}
              </td>
            </tr>
          </tfoot>
        </table>

        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; 
          margin: 20px 0;">
          <p style="margin: 0; color: #2d5a2d;">
            📞 Contact customer at <strong>${customerPhone}</strong> 
            for order confirmation or delivery updates.
          </p>
        </div>

        <p style="color: #666; font-size: 14px;">
          This is an automated notification from your Kurv grocery delivery app.
        </p>
      </div>
    `;

      // Send email to business owner
      const businessEmailOptions = {
        from: "swapnil29joshi@gmail.com",
        to: "swapnil29joshi@gmail.com",
        subject: `🛒 New Order Received #${order.id} - ₹${order.total}`,
        html: htmlContent,
      };

      // Send email to customer
      const customerEmailOptions = {
        from: "swapnil29joshi@gmail.com",
        to: data.customerEmail,
        subject: `✅ Order Confirmation #${order.id} - ₹${order.total}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; 
            margin: 0 auto;">
            <h2 style="color: #667eea;">✅ Order Confirmed!</h2>
            
            <p>Dear Customer,</p>
            <p>Thank you for your order! We've received your order and will 
              process it shortly.</p>
            
            <div style="background: #f8f9ff; padding: 20px; 
              border-radius: 10px; margin: 20px 0;">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Order Date:</strong> 
                ${new Date(order.date).toLocaleString()}
              </p>
              <p><strong>Phone:</strong> ${customerPhone}</p>
            </div>

            ${order.additionalNotes ? `
            <div style="background: #fff9e6; padding: 15px; border-radius: 8px; 
              margin: 20px 0; border-left: 4px solid #ffa502;">
              <h3>💬 Your Requirements / Notes</h3>
              <p style="white-space: pre-wrap; font-family: Arial; 
                line-height: 1.6; color: #333;">
                ${order.additionalNotes}
              </p>
            </div>
            ` : ""}

            <table style="width: 100%; border-collapse: collapse; 
              margin: 20px 0;">
              <thead>
                <tr style="background: #667eea; color: white;">
                  <th style="padding: 12px; text-align: left;">Item</th>
                  <th style="padding: 12px; text-align: center;">Qty</th>
                  <th style="padding: 12px; text-align: right;">Price</th>
                  <th style="padding: 12px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHtml}
              </tbody>
              <tfoot>
                <tr style="background: #f0f0f0; font-weight: bold;">
                  <td colspan="3" style="padding: 15px; text-align: right;">
                    Total Amount:
                  </td>
                  <td style="padding: 15px; text-align: right; color: #667eea;">
                    ₹${order.total}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; 
              margin: 20px 0;">
              <p style="margin: 0; color: #2d5a2d;">
                📞 We'll contact you at <strong>${customerPhone}</strong> 
                for delivery confirmation.
              </p>
            </div>

            <p style="color: #666; font-size: 14px;">
              Thank you for choosing Kurv! 🛒
            </p>
          </div>
        `,
      };

      // Send emails to both business owner and customer
      await transporter.sendMail(businessEmailOptions);
      await transporter.sendMail(customerEmailOptions);

      console.log("Order confirmation email sent successfully",
        {orderId: order.id});

      return {
        success: true,
        message: "Order confirmation email sent successfully",
        orderId: order.id,
      };
    } catch (error) {
      console.error("Error sending order confirmation email:", error);
      throw new functions.https.HttpsError("internal",
        `Failed to send order confirmation email: ${error}`);
    }
  });
