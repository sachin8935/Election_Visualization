import pkg from 'pg';
const { Pool } = pkg;

const URI = process.env.PG_URI;
const pool = new Pool({
  connectionString: URI,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Export the pool for use in other files
export default pool;
