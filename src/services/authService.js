const db = require('../config/db');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../logger');

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID || 'dummy_client_id'); // Usually you should set GOOGLE_CLIENT_ID in backend env, but frontend uses VITE_GOOGLE_CLIENT_ID. We will try to read standard GOOGLE_CLIENT_ID if available.

const verifyGoogleToken = async (google_token) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    
    // In a real production setup, we verify with the exact client ID.
    // Since Google Auth setup can be complex and we might not have a valid token right away during testing,
    // we use standard verification here.
    const ticket = await client.verifyIdToken({
      idToken: google_token,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    
    const { sub: google_id, email, name, picture } = payload;
    
    // Check if user exists
    const [rows] = await db.query('SELECT * FROM users WHERE google_id = ? OR email = ?', [google_id, email]);
    
    let user = rows[0];
    
    if (!user) {
      // Insert new user
      const [result] = await db.query(
        'INSERT INTO users (google_id, email, name, auth_provider) VALUES (?, ?, ?, ?)',
        [google_id, email, name, 'google']
      );
      user = {
        id: result.insertId,
        google_id,
        email,
        name,
        auth_provider: 'google'
      };
    } else if (!user.google_id) {
      // Update existing user with google_id
      await db.query('UPDATE users SET google_id = ?, auth_provider = ? WHERE id = ?', [google_id, 'google', user.id]);
      user.google_id = google_id;
      user.auth_provider = 'google';
    }
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      auth_provider: user.auth_provider,
      picture
    };
  } catch (error) {
    logger.error(`Google token verification failed: ${error.message}`);
    throw new Error('Invalid Google token');
  }
};

const adminLogin = async (username, password) => {
  const [rows] = await db.query('SELECT * FROM admin_users WHERE username = ?', [username]);
  const admin = rows[0];

  if (!admin) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, admin.password_hash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    admin: {
      id: admin.id,
      username: admin.username
    }
  };
};

module.exports = {
  verifyGoogleToken,
  adminLogin
};
