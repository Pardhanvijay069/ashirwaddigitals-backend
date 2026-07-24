const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorMiddleware');
const logger = require('./logger');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
//const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Security Middlewares
app.use(helmet());
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }));
app.use(cors({
  origin: true,
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Standard Middlewares
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
//app.post('/api/admin/login', require('./validators').adminLoginValidation, require('./controllers/authController').adminLogin);

app.use('/api/products', productRoutes);
app.use('/api/admin/products', require('./routes/adminProductRoutes'));
//app.use('/api/admin', require('./routes/adminStreamRoutes'));

//app.use('/api', orderRoutes);
//app.use('/api/admin/orders', require('./routes/adminOrderRoutes'));

// Root Route (Railway Health Check)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ashirwad Digitals Backend is running 🚀'
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy'
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Centralized Error Handling
app.use(errorHandler);

module.exports = app;
