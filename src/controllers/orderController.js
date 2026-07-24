const orderService = require('../services/orderService');
const { validationResult } = require('express-validator');
const cloudinary = require('../config/cloudinary');
const { broadcastNewOrder } = require('../sockets/adminSSE');
const { sendOrderConfirmation } = require('../utils/emailSender');
const logger = require('../logger');

const placeOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation failed', data: errors.array() });
    }

    let design_file_url = null;
    if (req.file) {
      // Upload to cloudinary directly from buffer
      design_file_url = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'AshirwadDigitals/designs' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(req.file.buffer);
      });
    }

    const orderData = {
      ...req.body,
      design_file_url
    };

    const result = await orderService.placeOrder(orderData);
    
    // Broadcast the alert only after the order has been committed successfully.
    broadcastNewOrder({
      order_id: result.order_id,
      order_number: result.order_number,
      customer_name: req.body.customer_name,
      message: 'New order received!'
    });

    // Send confirmation email asynchronously if email is provided
    if (req.body.customer_email) {
      // Fetch total amount from db or calculate, but sp_place_order calculates it.
      // We can fetch the order details to get the exact total amount for the email.
      orderService.getOrderDetailsById(result.order_id)
        .then(details => {
          sendOrderConfirmation(req.body.customer_email, result.order_number, result.tracking_token, details.order.total_amount);
        })
        .catch(err => logger.error(`Failed to fetch order details for email: ${err.message}`));
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getAdminOrders = async (req, res, next) => {
  try {
    const { status, limit, offset } = req.query;
    const orders = await orderService.getAllOrders(
      status, 
      limit ? parseInt(limit, 10) : 50, 
      offset ? parseInt(offset, 10) : 0
    );
    
    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const countData = await orderService.getUnreadCount();
    res.status(200).json({
      success: true,
      message: 'Unread count fetched',
      data: countData
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation failed', data: errors.array() });
    }

    const { id } = req.params;
    const { status, cancel_reason } = req.body;

    await orderService.updateOrderStatus(id, status, cancel_reason);
    
    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const markOrderRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await orderService.markOrderRead(id);
    
    res.status(200).json({
      success: true,
      message: 'Order marked as read',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const getAdminOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const details = await orderService.getOrderDetailsById(id);
    
    res.status(200).json({
      success: true,
      message: 'Order details fetched',
      data: details
    });
  } catch (error) {
    if (error.message === 'Order not found') {
      return res.status(404).json({ success: false, message: error.message, data: null });
    }
    next(error);
  }
};

const trackOrder = async (req, res, next) => {
  try {
    const { token } = req.params;
    const details = await orderService.getOrderDetailsByToken(token);
    
    res.status(200).json({
      success: true,
      message: 'Order tracking fetched',
      data: details
    });
  } catch (error) {
    if (error.message === 'Order not found or invalid tracking token') {
      return res.status(404).json({ success: false, message: error.message, data: null });
    }
    next(error);
  }
};

const getCustomerOrders = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId query parameter is required', data: null });
    }

    const orders = await orderService.getCustomerOrders(userId);
    
    res.status(200).json({
      success: true,
      message: 'Customer orders fetched',
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getAdminOrders,
  getUnreadCount,
  updateOrderStatus,
  markOrderRead,
  getAdminOrderById,
  trackOrder,
  getCustomerOrders
};
