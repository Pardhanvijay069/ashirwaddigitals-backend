require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// A tiny 1x1 transparent GIF
const tinyGif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

const uploadStream = cloudinary.uploader.upload_stream(
  { folder: 'AshirwadDigitals/test' },
  (error, result) => {
    if (error) {
      console.error("Error:", error);
      process.exit(1);
    }
    console.log("Cloudinary Response:", JSON.stringify(result, null, 2));
    console.log("secure_url:", result.secure_url);
    process.exit(0);
  }
);
uploadStream.end(tinyGif);
