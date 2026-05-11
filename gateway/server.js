import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';

// Load ENV from current dir or root dir
dotenv.config({ path: '../.env' }); // Root level .env

const app = express();
const PORT = process.env.GATEWAY_PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'gateway' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clauseease')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Gateway service running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // In dev mode without Mongo, we can still start
    console.warn('Starting without DB connection for local preview');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Gateway service running on http://0.0.0.0:${PORT} (NO DB)`);
    });
  });
