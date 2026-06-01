const twilio = require('twilio');

let client = null;
try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
} catch (error) {
  console.warn('Twilio disabled (dev mode):', error.message);
}
const sendWhatsAppNotification = async (message) => {
  try {
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      process.env.TWILIO_ACCOUNT_SID === 'your_twilio_account_sid'
    ) {
      console.log('[WhatsApp - DEV MODE] Would send:', message);
      return { success: true, dev: true };
    }

    const result = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.SHOPKEEPER_WHATSAPP_NUMBER,
      body: message,
    });

    console.log(`WhatsApp notification sent: ${result.sid}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('WhatsApp notification failed:', error.message);
    return { success: false, error: error.message };
  }
};

const sendNewOrderNotification = async (order) => {
  const itemList = order.items
    .map((item) => `  - ${item.title} x${item.quantity} @ Rs.${item.price}`)
    .join('\n');

  const message = `
🛍️ *NEW ORDER RECEIVED!*

📦 Order ID: ${order.orderId}
💰 Total Amount: Rs.${order.totalAmount}

👤 *Customer Details:*
  Name: ${order.customerDetails.name}
  Phone: ${order.customerDetails.phone}
  Email: ${order.customerDetails.email}

📍 *Delivery Address:*
  ${order.customerDetails.address.street}
  ${order.customerDetails.address.city}, ${order.customerDetails.address.state} ${order.customerDetails.address.postalCode}
  ${order.customerDetails.address.country}

🧾 *Items Ordered:*
${itemList}

⏰ Placed at: ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
`.trim();

  return sendWhatsAppNotification(message);
};

const sendOrderCancelledNotification = async (order) => {
  const message = `
❌ *ORDER CANCELLED*

📦 Order ID: ${order.orderId}
💰 Amount: Rs.${order.totalAmount}
👤 Customer: ${order.customerDetails.name}
📞 Phone: ${order.customerDetails.phone}
🚫 Cancelled by: ${order.cancelledBy === 'customer' ? 'Customer' : 'Shopkeeper'}
⏰ At: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
`.trim();

  return sendWhatsAppNotification(message);
};

const sendWhatsAppToCustomer = async (number, message) => {
  try {
    if (!client || !process.env.TWILIO_WHATSAPP_FROM) {
      console.log(`[WhatsApp - DEV MODE] Would send to ${number}:`, message);
      return { success: true, dev: true };
    }

    // Normalize to Indian E.164 format (+91XXXXXXXXXX)
    const digits = number.replace(/[^0-9]/g, '');
    const e164 = digits.startsWith('91') ? `+${digits}` : `+91${digits}`;

    const result = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${e164}`,
      body: message,
    });

    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('WhatsApp customer notification failed:', error.message);
    return { success: false, error: error.message };
  }
};

const sendTrackingLinkNotification = async (order, trackingUrl) => {
  const message = `
✨ *HABIBI BOUTIQUE | LOGISTICS PULSE*

Your acquisition *${order.orderId}* has entered the heritage transit.

📍 *TRACK YOUR JOURNEY:*
${trackingUrl}

We are committed to delivering your piece within our absolute 48-hour window.

*Heritage . Identity . Future*
`.trim();

  return sendWhatsAppToCustomer(order.customerDetails.phone, message);
};

module.exports = { 
  sendNewOrderNotification, 
  sendOrderCancelledNotification,
  sendTrackingLinkNotification 
};
