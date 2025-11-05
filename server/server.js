import './config.mjs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { User } from './db.mjs';

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
    ? process.env.CLIENT_URL || 'https://your-app.onrender.com'
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection ERROR:', err));

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session configuration
// TODO

// ===== API ROUTES =====

// Home / Landing
app.get('/api', (req, res) => {
  // TODO: Render landing page
  res.json({ message: 'Welcome to LocalWorks' });
});

// ===== AUTH ROUTES ===== (TO BE MOVED)

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'user',
    });

    await user.save();

    // Return user info (without password)
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Return user info
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
app.post('/auth/logout', (req, res) => {
  // To be implemented with proper auth
  res.json({ message: 'Logout successful' });
});

// Also TODO move all routes to their own js files and use express router

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

// ===== ERROR HANDLING =====

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ===== SERVER =====

app.listen(PORT, () => {
  console.log(`LocalWorks server running on port ${PORT}`);
});
