import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// API Routes
app.use('/api', routes);


// Test database connection and start server
const startServer = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Access the API at: http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

startServer();
// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import routes from './routes.js';
// import pool from './db.js';
// import functions from 'firebase-functions';

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // API Routes
// app.use('/api', routes);

// // Health check route (optional but useful)
// app.get('/health', async (req, res) => {
//   try {
//     await pool.query('SELECT NOW()');
//     res.status(200).json({ status: 'ok', db: 'connected' });
//   } catch (error) {
//     res.status(500).json({ status: 'error', db: 'disconnected', error });
//   }
// });

// // Export Express app as a Firebase Cloud Function
// export const api = functions.https.onRequest(app);