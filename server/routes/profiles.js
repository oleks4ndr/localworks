import express from 'express';
import { Profile, User } from '../db.mjs';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

// ===== PROFILE ROUTES =====

/**
 * GET /api/profiles/me
 * Get current user's trades profile
 */
router.get('/me', verifyFirebaseToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate('user', 'name email role');

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * POST /api/profiles
 * Create new trades profile
 */
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const {
      displayName,
      headline,
      skills,
      credentials,
      bio,
      rate,
      location,
      serviceRadiusKm,
      photos,
      isPublished
    } = req.body;

    // Check if user already has a profile
    const existingProfile = await Profile.findOne({ user: req.user.id });
    if (existingProfile) {
      return res.status(400).json({ error: 'Profile already exists. Use PUT to update.' });
    }

    // Validate required fields
    if (!displayName) {
      return res.status(400).json({ error: 'Display name is required' });
    }

    // Validate rate if provided
    if (rate && rate.amount !== undefined && rate.amount <= 0) {
      return res.status(400).json({ error: 'Rate amount must be greater than 0' });
    }

    // Validate service radius
    if (serviceRadiusKm && (serviceRadiusKm < 0 || serviceRadiusKm > 100)) {
      return res.status(400).json({ error: 'Service radius must be between 0 and 100 km' });
    }

    // Create new profile
    const profile = new Profile({
      user: req.user.id,
      displayName,
      headline,
      skills: skills || [],
      credentials: credentials || [],
      bio,
      rate: rate || { currency: 'USD', amount: 0, unit: 'hour' },
      location: location || {},
      serviceRadiusKm: serviceRadiusKm || 25,
      photos: photos || [],
      isPublished: isPublished || false,
      avgRating: null,
      reviewCount: 0
    });

    await profile.save();

    // Populate user data before sending response
    await profile.populate('user', 'name email role');

    res.status(201).json({
      message: 'Profile created successfully',
      profile
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

/**
 * PUT /api/profiles/:id
 * Update existing trades profile
 */
router.put('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      displayName,
      headline,
      skills,
      credentials,
      bio,
      rate,
      location,
      serviceRadiusKm,
      photos,
      isPublished
    } = req.body;

    // Find profile and verify ownership
    const profile = await Profile.findById(id);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (profile.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    // Validate rate if provided
    if (rate && rate.amount !== undefined && rate.amount <= 0) {
      return res.status(400).json({ error: 'Rate amount must be greater than 0' });
    }

    // Validate service radius
    if (serviceRadiusKm !== undefined && (serviceRadiusKm < 0 || serviceRadiusKm > 100)) {
      return res.status(400).json({ error: 'Service radius must be between 0 and 100 km' });
    }

    // Update profile fields
    if (displayName !== undefined) profile.displayName = displayName;
    if (headline !== undefined) profile.headline = headline;
    if (skills !== undefined) profile.skills = skills;
    if (credentials !== undefined) profile.credentials = credentials;
    if (bio !== undefined) profile.bio = bio;
    if (rate !== undefined) profile.rate = rate;
    if (location !== undefined) profile.location = location;
    if (serviceRadiusKm !== undefined) profile.serviceRadiusKm = serviceRadiusKm;
    if (photos !== undefined) profile.photos = photos;
    if (isPublished !== undefined) profile.isPublished = isPublished;

    await profile.save();

    // Populate user data before sending response
    await profile.populate('user', 'name email role');

    res.json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * PATCH /api/profiles/:id/role
 * Update user role to tradesperson
 */
router.patch('/:id/role', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = 'tradesperson';
    await user.save();

    res.json({
      message: 'User role updated to tradesperson',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

export default router;
