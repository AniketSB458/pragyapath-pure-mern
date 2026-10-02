import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Route handlers
import authRoutes from './routes/auth.js';
import sessionRoutes from './routes/sessions.js';
import practiceRoutes from './routes/practice.js';
import noteRoutes from './routes/notes.js';
import bookmarkRoutes from './routes/bookmarks.js';
import mentorRoutes from './routes/mentor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pragyapath_mern';

// Helper to mask MongoDB URI credentials in logs
function sanitizeMongoUri(uri) {
  try {
    return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/, '$1****$3');
  } catch {
    return 'mongodb://[credentials-hidden]';
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (supports local MongoDB and MongoDB Atlas)
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'pragyapath_mern',
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully to: ${sanitizeMongoUri(MONGODB_URI)} (db: pragyapath_mern)`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error.message);
    if (error.message.includes('whitelist') || error.message.includes('connect ETIMEOUT')) {
      console.warn('[MongoDB Atlas Tip] Make sure your current IP address is whitelisted in MongoDB Atlas Network Access (or set to 0.0.0.0/0).');
    }
    console.log('[MongoDB] Running in offline fallback mode.');
  }
}
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/mentor', mentorRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    stack: 'MERN (Pure JavaScript)',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    databaseName: mongoose.connection.name || 'pragyapath_mern',
    authEnabled: true,
    timestamp: new Date().toISOString()
  });
});

// Live MongoDB Collections Viewer endpoints
app.get('/api/mern/collections', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    const cols = await db.listCollections().toArray();
    const result = [];
    for (const c of cols) {
      const count = await db.collection(c.name).countDocuments();
      result.push({ name: c.name, count });
    }
    res.json({ database: db.databaseName, collections: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/mern/collections/:collection', async (req, res) => {
  try {
    const collName = req.params.collection;
    const db = mongoose.connection.db;
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    const docs = await db.collection(collName).find({}).project({ password: 0 }).toArray();
    res.json({
      database: db.databaseName,
      collection: collName,
      totalCount: docs.length,
      documents: docs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[Express] MERN Server running on port ${PORT} (Node.js runtime)`);
});
