import express from 'express';
import User from '../models/User.js';
import { requireAuth, generateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      targetGoal,
      targetExamId,
      degreeOrStream,
      dailyHours,
      educationStage
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Valid email is required.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists. Please sign in instead.'
      });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      targetGoal: targetGoal || 'National & State Competitive Exams',
      targetExamId: targetExamId || 'upsc_cse',
      degreeOrStream: degreeOrStream || 'Bachelor Degree (Final Year / Graduate)',
      dailyHours: dailyHours || 4,
      educationStage: educationStage || 'ug_general'
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Error in /api/auth/register:', error);
    res.status(500).json({ success: false, error: error.message || 'Registration failed.' });
  }
});

// POST /api/auth/login - Authenticate user & issue JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    // Update streak or last active date
    const today = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate !== today) {
      user.lastActiveDate = today;
      await user.save();
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user
    });
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    res.status(500).json({ success: false, error: error.message || 'Login failed.' });
  }
});

// GET /api/auth/me - Get current logged-in user from JWT
router.get('/me', requireAuth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/auth/profile?email=... (Backwards-compatibility & fallback)
router.get('/profile', async (req, res) => {
  try {
    const email = req.query.email || 'anyabandgar458@gmail.com';
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        email: email.toLowerCase(),
        name: 'Anya Bandgar',
        targetGoal: 'National & State Competitive Exams',
        targetExamId: 'upsc_cse',
        degreeOrStream: 'Bachelor Degree (Final Year / Graduate)',
        dailyHours: 4,
        language: 'en'
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error in /api/auth/profile:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/profile - Update profile
router.post('/profile', async (req, res) => {
  try {
    const { email, ...updates } = req.body;
    const targetEmail = (email || 'anyabandgar458@gmail.com').toLowerCase();

    // Prevent direct password modification through general profile update
    delete updates.password;

    const user = await User.findOneAndUpdate(
      { email: targetEmail },
      { $set: updates },
      { new: true, upsert: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
