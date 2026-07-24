const nodemailer = require('nodemailer');
const logger = require('../logger');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOrderConfirmation = async (email, orderNumber, trackingToken, totalAmount) => {
  if (!email || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn(`Skipping email sending for order ${orderNumber} - Missing SMTP config or email`);
    return;
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const trackingUrl = frontendUrl.includes('http') ? `${frontendUrl}/track?token=${trackingToken}` : `https://${frontendUrl}/track?token=${trackingToken}`;

  const mailOptions = {
    from: `"Ashirwad Digitals" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #4f46e5; text-align: center;">Ashirwad Digitals</h2>
        <h3 style="color: #333;">Order Received Successfully!</h3>
        <p>Hi there,</p>
        <p>Thank you for placing an order with us. Your order number is <strong>${orderNumber}</strong>.</p>
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        <p>You can track the status of your order by clicking the link below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${trackingUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Track Your Order</a>
        </div>
        <hr style="border: none; border-top: 1px solid #e0e0e0;" />
        <p style="color: #666; font-size: 14px;">If you have any questions, feel free to reply to this email or call us.</p>
        <p style="color: #666; font-size: 14px; text-align: center;">&copy; ${new Date().getFullYear()} Ashirwad Digitals. All rights reserved.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Order confirmation email sent to ${email} for order ${orderNumber}`);
  } catch (error) {
    logger.error(`Failed to send email to ${email}: ${error.message}`);
  }
};

module.exports = {
  sendOrderConfirmation
};
