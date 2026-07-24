const db = require('../config/db');

const placeOrder = async (orderData) => {
  // Use a single connection to call SP and get OUT params
  const connection = await db.getConnection();
  
  try {
    await connection.query(
      `CALL sp_place_order(
        ?, ?, ?, ?, ?, ?, ?, ?,
        @order_id,
        @order_number,
        @tracking_token
      )`,
      [
        orderData.user_id || null,
        orderData.customer_name,
        orderData.customer_phone,
        orderData.customer_email || null,
        orderData.address,
        orderData.special_instructions || null,
        orderData.design_file_url || null,
        orderData.items // JSON string
      ]
    );

    const [[result]] = await connection.query(
      `SELECT 
        @order_id AS order_id, 
        @order_number AS order_number, 
        @tracking_token AS tracking_token`
    );

    return result;
  } finally {
    connection.release();
  }
};

const getAllOrders = async (status, limit, offset) => {
  const [rows] = await db.query('CALL sp_get_all_orders(?, ?, ?)', [
    status || null,
    limit || 50,
    offset || 0
  ]);
  return rows[0];
};

const getUnreadCount = async () => {
  const [rows] = await db.query('CALL sp_get_unread_count()');
  return rows[0][0]; // Unread count is in the first row of first result set
};

const updateOrderStatus = async (orderId, status, cancelReason) => {
  await db.query('CALL sp_update_order_status(?, ?, ?)', [
    orderId,
    status,
    cancelReason || null
  ]);
};

const markOrderRead = async (orderId) => {
  await db.query('CALL sp_mark_order_read(?)', [orderId]);
};

const getOrderDetailsById = async (orderId) => {
  const [rows] = await db.query('CALL sp_get_order_details_by_id(?)', [orderId]);
  const order = rows[0][0];
  const items = rows[1];
  
  if (!order) {
    throw new Error('Order not found');
  }

  return { order, items };
};

const getOrderDetailsByToken = async (token) => {
  const [rows] = await db.query('CALL sp_get_order_details_by_token(?)', [token]);
  const order = rows[0][0];
  const items = rows[1];
  
  if (!order) {
    throw new Error('Order not found or invalid tracking token');
  }

  return { order, items };
};

const getCustomerOrders = async (userId) => {
  const [rows] = await db.query('CALL sp_get_customer_orders(?)', [userId]);
  return rows[0];
};

module.exports = {
  placeOrder,
  getAllOrders,
  getUnreadCount,
  updateOrderStatus,
  markOrderRead,
  getOrderDetailsById,
  getOrderDetailsByToken,
  getCustomerOrders
};
