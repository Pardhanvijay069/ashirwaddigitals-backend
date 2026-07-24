const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const token = jwt.sign(
  { id: 1, role: 'admin' },
  process.env.JWT_SECRET || '8d3f2c7a9b1e4f6a8c9d2e5f7b1a3c6d9e8f1a2b4c6d8e9f0a1b2c3d4e5f6a7',
  { expiresIn: '1h' }
);

console.log("Token:", token);
