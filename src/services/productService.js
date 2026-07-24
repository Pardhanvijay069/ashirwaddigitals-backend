const db = require('../config/db');

const getAllProducts = async (category, activeOnly) => {
  const [rows] = await db.query('CALL sp_get_all_products(?, ?)', [
    category || null,
    activeOnly !== undefined ? activeOnly : null
  ]);
  
  const products = rows[0]; // First result set: Products
  const images = rows[1]; // Second result set: Product Images

  // Map images to their respective products
  return products.map(product => {
    return {
      ...product,
      images: images.filter(img => img.product_id === product.id)
    };
  });
};

const getProductById = async (id) => {
  const [rows] = await db.query('CALL sp_get_product_by_id(?)', [id]);
  const product = rows[0][0]; // First row of first result set
  const images = rows[1]; // Second result set

  if (!product) {
    throw new Error('Product not found');
  }

  return { product, images };
};

const createProduct = async (productData) => {
  // Execute stored procedure
  await db.query(
    `CALL sp_insert_product(
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @product_id
    )`,
    [
      productData.sku,
      productData.name,
      productData.category,
      productData.description || null,
      productData.base_price,
      productData.unit || 'piece',
      productData.width || null,
      productData.height || null,
      productData.size_unit || null,
      productData.material || null,
      productData.finish || null,
      productData.stock_quantity || 0,
      productData.min_stock_warning || 5,
      productData.is_active !== undefined ? productData.is_active : true,
      productData.metadata ? JSON.stringify(productData.metadata) : null
    ]
  );

  // Retrieve OUT parameter
  const [[result]] = await db.query('SELECT @product_id AS product_id');
  return { product_id: result.product_id };
};

const updateProduct = async (id, productData) => {
  await db.query(
    `CALL sp_update_product(
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )`,
    [
      id,
      productData.sku || null,
      productData.name || null,
      productData.category || null,
      productData.description || null,
      productData.base_price || null,
      productData.unit || null,
      productData.width || null,
      productData.height || null,
      productData.size_unit || null,
      productData.material || null,
      productData.finish || null,
      productData.stock_quantity !== undefined ? productData.stock_quantity : null,
      productData.min_stock_warning !== undefined ? productData.min_stock_warning : null,
      productData.is_active !== undefined ? productData.is_active : null,
      productData.metadata ? JSON.stringify(productData.metadata) : null
    ]
  );
};

const deleteProduct = async (id) => {
  await db.query('CALL sp_delete_product(?)', [id]);
};

const addProductImage = async (productId, imageUrl, altText, isPrimary, sortOrder) => {
  await db.query(
    'CALL sp_insert_product_image(?, ?, ?, ?, ?, @image_id)',
    [
      productId,
      imageUrl,
      altText || null,
      isPrimary || false,
      sortOrder || 0
    ]
  );

  const [[result]] = await db.query('SELECT @image_id AS image_id');
  return { image_id: result.image_id };
};

const deleteProductImage = async (imageId) => {
  await db.query('CALL sp_delete_product_image(?)', [imageId]);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  deleteProductImage
};
