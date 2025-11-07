const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create tables
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(50) NOT NULL,
      password VARCHAR(255) NOT NULL,
      balance NUMERIC(15,2) DEFAULT 0,
      is_active BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      type VARCHAR(20) NOT NULL,
      method VARCHAR(50) NOT NULL,
      amount NUMERIC(15,2) NOT NULL,
      status VARCHAR(20) NOT NULL,
      tx_id VARCHAR(20) UNIQUE,
      created_at TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Insert admin user
  await pool.query(`
    INSERT INTO users (email, username, password, balance, is_active)
    VALUES ('admin@platform.com', 'Admin', '$2b$10$9XqoQ7r8LkM6VgZc5uPjN.zUxGdCtWvBfRJHhKlAeTmYiOqXzYpXa', 1000000, TRUE)
    ON CONFLICT (email) DO NOTHING
  `);
}

initDB();

module.exports = pool;
