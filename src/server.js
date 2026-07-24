require('dotenv').config();
const app = require('./app');
const logger = require('./logger');

// Validate critical environment variables
const requiredEnvVars = [
  'DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET',
  'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS',
  'FRONTEND_URL'
];

const missing = requiredEnvVars.filter(v => !process.env[v]);
if (missing.length > 0) {
  logger.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const PORT = process.env.PORT || 26632;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
