// Alternative: Simple email service using EmailJS (no backend needed)
// Add this script to your index.html head section:
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

// EmailJS configuration
const EMAIL_CONFIG = {
    SERVICE_ID: 'your_emailjs_service_id',
    TEMPLATE_ID: 'your_emailjs_template_id', 
    PUBLIC_KEY: 'your_emailjs_public_key'
};

// Initialize EmailJS (call this in your app initialization)
function initializeEmailJS() {
    emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
}

// Alternative email function using EmailJS (simpler, no backend needed)
async function sendOrderEmailViaEmailJS(order) {
    try {
        const templateParams = {
            order_id: order.id,
            order_date: new Date(order.date).toLocaleString(),
            customer_phone: user,
            total_amount: order.total,
            items_list: order.items.map(item => 
                `${item.image} ${item.name} x${item.quantity} = ${(item.price * item.quantity).toFixed(2)} kr`
            ).join('\n'),
            delivery_address: order.address ? 
                `${order.address.fullName}\n${order.address.streetAddress}\n${order.address.city}, ${order.address.postalCode}\nPhone: ${order.address.phone}` : 
                'No address provided',
            to_email: 'your-store-email@gmail.com' // Your store email
        };

        const result = await emailjs.send(
            EMAIL_CONFIG.SERVICE_ID,
            EMAIL_CONFIG.TEMPLATE_ID,
            templateParams
        );

        console.log('Email sent successfully via EmailJS:', result);
        return { success: true };

    } catch (error) {
        console.error('Error sending email via EmailJS:', error);
        return { success: false, error };
    }
}