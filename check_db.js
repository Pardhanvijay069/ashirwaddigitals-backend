const db = require('./src/config/db');

async function checkDb() {
  const [rows] = await db.query('SELECT * FROM product_images ORDER BY id DESC LIMIT 5');
  console.log(rows);
  process.exit(0);
}

checkDb();
