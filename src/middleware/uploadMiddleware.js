const multer = require('multer');
const path = require('path');

// Memory storage to upload directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();

  // Reject executables and scripts explicitly
  const rejectedExtensions = ['.exe', '.bat', '.sh', '.js', '.php', '.zip', '.tar', '.gz'];
  
  if (rejectedExtensions.includes(ext)) {
    return cb(new Error('Executable or script files are not allowed'), false);
  }

  if (allowedExtensions.includes(ext) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
  fileFilter
});

module.exports = upload;
