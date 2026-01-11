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
      const orderItemsHtml = order.items.map((item: any) =>
        `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; 
          font-size: 12px; color: #666;">
          ${item.itemNumber || "N/A"}
        </td>
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
        <div style="text-align: center; padding: 30px 20px; 
          background: linear-gradient(135deg, #20BBBE 0%, #F57B20 100%); 
          border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0 0 10px 0; font-size: 28px; 
            letter-spacing: 1px;">SWARUP Solutions</h1>
          <h2 style="color: white; margin: 0; font-size: 20px;">
            📧 New Enquiry Received!
          </h2>
        </div>
        
        <div style="background: #f8f9ff; padding: 20px; border-radius: 10px; 
          margin: 20px 0;">
          <h3>Enquiry Details</h3>
          <p><strong>Enquiry ID:</strong> ${order.id.replace("ENQ-", "")}</p>
          <p><strong>Customer Phone:</strong> ${customerPhone}</p>
          <p><strong>Enquiry Date (IST):</strong> 
            ${new Date(order.date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  })}
          </p>
          <p><strong>Delivery Address:</strong> 
            ${order.address || "Default Address"}
          </p>
        </div>

        ${order.additionalNotes ? `
        <div style="background: #fff9e6; padding: 15px; border-radius: 8px; 
          margin: 20px 0; border-left: 4px solid #ffa502;">
          <h3>💬 Additional Information</h3>
          <p style="white-space: pre-wrap; font-family: Arial; 
            line-height: 1.6; color: #333;">
            ${order.additionalNotes}
          </p>
        </div>
        ` : ""}

        <table style="width: 100%; border-collapse: collapse; 
          margin: 20px 0;">
          <thead>
            <tr style="background: #20BBBE; color: white;">
              <th style="padding: 12px; text-align: left; font-size: 12px;">
                Item Code
              </th>
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
              <td colspan="4" style="padding: 15px; text-align: right;">
                Total Amount:
              </td>
              <td style="padding: 15px; text-align: right; color: #20BBBE;">
                ₹${order.total}
              </td>
            </tr>
            <tr>
              <td colspan="5" style="padding: 10px; text-align: right; 
                font-size: 11px; color: #666; font-style: italic;">
                *Prices are exclusive of taxes and charges
              </td>
            </tr>
          </tfoot>
        </table>

        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; 
          margin: 20px 0;">
          <p style="margin: 0; color: #2d5a2d;">
            📞 Contact customer at <strong>${customerPhone}</strong> 
            for enquiry confirmation or delivery updates.
          </p>
        </div>

        <p style="color: #666; font-size: 14px;">
          This is an automated notification from Swarup Solutions.
        </p>
      </div>
    `;

      // Send email to business owner
      const businessEmailOptions = {
        from: "swapnil29joshi@gmail.com",
        to: "swapnil29joshi@gmail.com",
        subject: `Enquiry received #${
          order.id.replace("ENQ-", "")} - ₹${order.total}`,
        html: htmlContent,
      };

      // Send email to customer
      const customerEmailOptions = {
        from: "swapnil29joshi@gmail.com",
        to: data.customerEmail,
        subject: `Enquiry received #${order.id.replace("ENQ-", "")}`,
        html: `
          <div style="font-family: Arial, sans-serif; 
            max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 30px 20px; 
              background: linear-gradient(135deg, 
              #20BBBE 0%, #F57B20 100%); 
              border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0 0 10px 0; font-size: 28px; 
                letter-spacing: 1px;">SWARUP Solutions</h1>
              <h2 style="color: white; margin: 0; font-size: 20px;">
                ✅ Enquiry received!
              </h2>
            </div>
            
            <p>Dear Customer,</p>
            <p>Thank you for your enquiry! We've received your enquiry and will 
              process it shortly.</p>
            
            <div style="background: #f8f9ff; padding: 20px; 
              border-radius: 10px; margin: 20px 0;">
              <h3>Enquiry Details</h3>
              <p><strong>Enquiry ID:</strong> 
                ${order.id.replace("ENQ-", "")}
              </p>
              <p><strong>Enquiry Date (IST):</strong> 
                ${new Date(order.date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  })}
              </p>
              <p><strong>Phone:</strong> ${customerPhone}</p>
            </div>

            ${order.additionalNotes ? `
            <div style="background: #fff9e6; padding: 15px; border-radius: 8px; 
              margin: 20px 0; border-left: 4px solid #ffa502;">
              <h3>💬 Additional Information</h3>
              <p style="white-space: pre-wrap; font-family: Arial; 
                line-height: 1.6; color: #333;">
                ${order.additionalNotes}
              </p>
            </div>
            ` : ""}

            <table style="width: 100%; border-collapse: collapse; 
              margin: 20px 0;">
              <thead>
                <tr style="background: #20BBBE; color: white;">
                  <th style="padding: 12px; text-align: left; 
                    font-size: 12px;">Item Code</th>
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
                  <td colspan="4" style="padding: 15px; text-align: right;">
                    Total Amount:
                  </td>
                  <td style="padding: 15px; text-align: right; 
                    color: #20BBBE;">
                    ₹${order.total}
                  </td>
                </tr>
                <tr>
                  <td colspan="5" style="padding: 10px; text-align: right; 
                    font-size: 11px; color: #666; font-style: italic;">
                    *Prices are exclusive of taxes and charges
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
              Thank you for choosing Swarup! 📧
            </p>
          </div>
        `,
      };

      // Send emails to both business owner and customer
      await transporter.sendMail(businessEmailOptions);
      await transporter.sendMail(customerEmailOptions);

      console.log("Enquiry confirmation email sent successfully",
        {orderId: order.id});

      return {
        success: true,
        message: "Enquiry confirmation email sent successfully",
        orderId: order.id,
      };
    } catch (error) {
      console.error("Error sending enquiry confirmation email:", error);
      throw new functions.https.HttpsError("internal",
        `Failed to send enquiry confirmation email: ${error}`);
    }
  });
