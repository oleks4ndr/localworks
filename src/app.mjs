import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { User, Profile, Review, Conversation, Message } from './db.mjs';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/localworks');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// session configuration
// TODO

// ===== ROUTES =====

// Home / Landing
app.get('/', (req, res) => {
  // TODO: Render landing page
  res.json({ message: 'Welcome to LocalWorks' });
});

// ===== AUTH ROUTES =====

// Register
app.post('/auth/register', async (req, res) => {
  // TODO: Implement registration
  // - Hash password with bcrypt
  // - Create user in database
  // - Return user info (without password)
  res.json({ message: 'Register endpoint - TODO' });
});

// Login
app.post('/auth/login', (req, res, next) => {
  // TODO: Implement passport local strategy login
  // - Authenticate credentials
  // - Start session
  res.json({ message: 'Login endpoint - TODO' });
});

// Logout
app.post('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// ===== PROFILE ROUTES =====

// Get single profile by ID or slug
app.get('/profiles/:id', async (req, res) => {
  // TODO: Get profile by ID
  // - Populate user reference
  // - Only return published profiles (unless owner)
  res.json({ message: 'Get profile endpoint - TODO' });
});

// ===== MESSAGE ROUTES =====

// Get messages for a conversation
app.get('/messages', async (req, res) => {
  // TODO: Get messages
  // - Verify user is participant
  // - Populate sender info
  res.json({ message: 'Get messages endpoint - TODO' });
});

// ===== DASHBOARD ROUTE =====

// User dashboard
app.get('/dashboard', requireAuth, async (req, res) => {
  // TODO: Get dashboard data
  // - User info
  // - Profile info (if tradesperson)
  // - Recent messages
  // - Recent reviews (if tradesperson)
  res.json({ message: 'Dashboard endpoint - TODO' });
});

// ===== ERROR HANDLING =====

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ===== SERVER =====

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LocalWorks server running on port ${PORT}`);
});
