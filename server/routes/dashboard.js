import express from 'express';
import { Profile, User } from '../db.mjs';

const router = express.Router();

// ===== DASHBOARD ROUTES =====

/**
 * GET /dashboard/profiles
 * Retrieve profiles from database and send back as a list of JSON objects
 */
router.get('/profiles', async (req, res) => {
  try {
    // Retrieve all published profiles and populate user data
    const profiles = await Profile.find({ isPublished: true })
      .populate('user', 'name email')
      .sort({ avgRating: -1, createdAt: -1 })
      .lean(); // improves performance

    res.json({
      message: 'Profiles retrieved successfully',
      profiles
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

export default router;