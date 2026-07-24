const productService = require('../services/productService');
const cloudinary = require('../config/cloudinary');
const { validationResult } = require('express-validator');

const getAllProducts = async (req, res, next) => {
  try {
    const { category, active_only } = req.query;
    // For boolean query params
    const isActiveOnly = active_only === 'true' || active_only === '1';

    const products = await productService.getAllProducts(category, isActiveOnly);

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: products
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await productService.getProductById(id);

    res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      data: result
    });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ success: false, message: error.message, data: null });
    }
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation failed', data: errors.array() });
    }

    const result = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productService.updateProduct(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: 'Product soft-deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const uploadProductImages = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(422).json({ success: false, message: 'No images provided', data: null });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'AshirwadDigitals/products' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    // Save to DB
    for (let i = 0; i < uploadResults.length; i++) {
      const result = uploadResults[i];
      const file = req.files[i];
      const isPrimary = i === 0; // First uploaded image in batch is primary if specified, but SP handles it
      
      console.log("Cloudinary Response:", result);
      console.log("secure_url:", result.secure_url);
      console.log("Saving URL:", result.secure_url);

      await productService.addProductImage(id, result.secure_url, file.originalname || 'product_image', isPrimary, i);
    }

    res.status(201).json({
      success: true,
      message: 'Images uploaded successfully',
      data: null
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    next(error);
  }
};

const deleteProductImage = async (req, res, next) => {
  try {
    const { image_id } = req.params;
    await productService.deleteProductImage(image_id);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage
};
