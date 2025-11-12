import './config.mjs';
import './config/firebase-admin.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import { verifyFirebaseToken, requireRole } from './middleware/auth.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Env variables
const NODE_ENV = process.env.NODE_ENV ?? 'development';
const PORT = process.env.PORT ?? 3000;
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost/localworks';

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? process.env.CLIENT_URL || 'https://localworks.onrender.com'
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection ERROR:', err));

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========= API ROUTES ==========

// Home / Landing
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to LocalWorks' });
});

// Test protected route
app.get('/api/protected', verifyFirebaseToken, (req, res) => {
  res.json({ 
    message: 'This is a protected route',
    user: req.user 
  });
});

// ===== AUTH ROUTES =====
app.use('/auth', authRoutes);

// ===== PROFILE ROUTES =====
// TODO: Move these routes into their own profile.js router

// Get single profile by ID or slug (public route)
app.get('/profiles/:id', async (req, res) => {
  // TODO: Get profile by ID
  // - Populate user reference
  // - Only return published profiles (unless owner)
  res.json({ message: 'Get profile endpoint - TODO' });
});

// Create/update profile (protected route)
app.post('/profiles', verifyFirebaseToken, async (req, res) => {
  // TODO: Create or update profile
  // req.user contains authenticated user info
  res.json({ message: 'Create/update profile endpoint - TODO', user: req.user });
});

// ===== MESSAGE ROUTES =====
// TODO: Move these routes into their own messages.js router

// Get messages for a conversation (protected route)
app.get('/messages', verifyFirebaseToken, async (req, res) => {
  // TODO: Get messages
  // - Verify user is participant
  // - Populate sender info
  // req.user contains authenticated user info
  res.json({ message: 'Get messages endpoint - TODO', user: req.user });
});

// Send a message (protected route)
app.post('/messages', verifyFirebaseToken, async (req, res) => {
  // TODO: Send message
  // req.user contains authenticated user info
  res.json({ message: 'Send message endpoint - TODO', user: req.user });
});

// ===== ERROR HANDLE (final middleware) =====

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});


// ===== SERVER =====

app.listen(PORT, () => {
  console.log(`LocalWorks API running on port http://localhost:${PORT}/`);
});
