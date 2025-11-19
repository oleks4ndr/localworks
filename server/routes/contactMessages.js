import express from 'express';
import { ContactMessage, Profile, User } from '../db.mjs';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

// Send a contact message
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { toProfileId, senderName, senderEmail, senderPhone, message } = req.body;

    // Validation
    if (!toProfileId || !senderName || !senderEmail || !message) {
      return res.status(400).json({ 
        error: 'Profile ID, sender name, email, and message are required' 
      });
    }

    if (message.length > 500) {
      return res.status(400).json({ 
        error: 'Message must be 500 characters or less' 
      });
    }

    // Verify the profile exists
    const profile = await Profile.findById(toProfileId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Verify the profile is published
    if (!profile.isPublished) {
      return res.status(400).json({ error: 'Cannot send message to unpublished profile' });
    }

    // Create the contact message (user already verified by middleware)
    const contactMessage = new ContactMessage({
      fromUser: req.user.id,
      toProfile: profile._id,
      senderName: senderName.trim(),
      senderEmail: senderEmail.trim().toLowerCase(),
      senderPhone: senderPhone ? senderPhone.trim() : undefined,
      message: message.trim(),
      isRead: false
    });

    await contactMessage.save();

    res.status(201).json({ 
      message: 'Message sent successfully',
      contactMessage 
    });
  } catch (error) {
    console.error('Send contact message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get all contact messages received by current tradesperson
router.get('/received', verifyFirebaseToken, async (req, res) => {
  try {
    // User is already verified by middleware, use req.user directly
    // Check if user is a tradesperson
    if (req.user.role !== 'tradesperson') {
      return res.status(403).json({ 
        error: 'Only tradespeople can access received messages',
        currentRole: req.user.role 
      });
    }

    // Find the user's profile
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Get all messages sent to this profile
    const messages = await ContactMessage.find({ toProfile: profile._id })
      .populate('fromUser', 'name email')
      .sort({ createdAt: -1 }); // Newest first

    res.json({ messages });
  } catch (error) {
    console.error('Get received messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark a contact message as read
router.patch('/:id/read', verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is a tradesperson (user already verified by middleware)
    if (req.user.role !== 'tradesperson') {
      return res.status(403).json({ error: 'Only tradespeople can mark messages as read' });
    }

    // Find the user's profile
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Find the message and verify ownership
    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.toProfile.toString() !== profile._id.toString()) {
      return res.status(403).json({ error: 'You can only mark your own messages as read' });
    }

    // Update the message
    message.isRead = true;
    await message.save();

    res.json({ message: 'Message marked as read', contactMessage: message });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

// Delete a contact message
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is a tradesperson (user already verified by middleware)
    if (req.user.role !== 'tradesperson') {
      return res.status(403).json({ error: 'Only tradespeople can delete messages' });
    }

    // Find the user's profile
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Find the message and verify ownership
    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.toProfile.toString() !== profile._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }

    // Delete the message
    await ContactMessage.findByIdAndDelete(id);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
