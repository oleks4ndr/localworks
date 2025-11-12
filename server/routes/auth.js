import express from 'express';
import { firebaseAuth } from '../config/firebase-admin.js';
import { User } from '../db.mjs';

const router = express.Router();

// ===== FIREBASE AUTH ROUTES =====

/**
 * POST /auth/firebase-register
 * Register a new user with Firebase authentication
 * Expects: { idToken, name, role }
 */
router.post('/firebase-register', async (req, res) => {
  try {
    const { idToken, name, role } = req.body;

    if (!idToken || !name) {
      return res.status(400).json({ error: 'ID token and name are required' });
    }

    // Verify the Firebase token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { firebaseUid: uid },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user in MongoDB
    const user = new User({
      firebaseUid: uid,
      name,
      email: email.toLowerCase(),
      role: role || 'user'
    });

    await user.save();

    // Return user info
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Firebase registration error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    if (error.code === 'auth/argument-error') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /auth/firebase-login
 * Login with Firebase authentication
 * Expects: { idToken }
 */
router.post('/firebase-login', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    // Verify the Firebase token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Find user in MongoDB
    let user = await User.findOne({ firebaseUid: uid });

    // If user doesn't exist, create them (first-time Firebase login)
    if (!user) {
      user = new User({
        firebaseUid: uid,
        name: decodedToken.name || email.split('@')[0], // use Firebase name or email prefix
        email: email.toLowerCase(),
        role: 'user'
      });
      await user.save();
    }

    // Return user info
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Firebase login error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    if (error.code === 'auth/argument-error') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /auth/logout
 * Logout endpoint (client-side handles Firebase sign out)
 */
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

export default router;