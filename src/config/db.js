const mysql = require('mysql2/promise');
const logger = require('../logger');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: Number(process.env.DB_PORT) || 3306, // ✅ Add this
  password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ashirwad_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
  connectTimeout: 30000
});

pool.getConnection()
  .then(conn => {
    logger.info('MySQL Database Connected Successfully');
    conn.release();
  })
  .catch(err => {
    logger.error(`Database Connection Failed: ${err.message}`);
  });

module.exports = pool;
