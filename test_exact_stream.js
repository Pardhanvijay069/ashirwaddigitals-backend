require('dotenv').config({ path: 'd:/Frame/SourceAnywhere/ashirwad/backend/.env' });
const cloudinary = require('./src/config/cloudinary');

async function test() {
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'AshirwadDigitals/products' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const buffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    uploadStream.end(buffer);
  });
  console.log('Result object:', result);
  console.log('secure_url:', result.secure_url);
}

test();
