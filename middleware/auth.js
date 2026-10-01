import 'dotenv/config';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getSecret = () => process.env.JWT_SECRET || 'pragyapath_super_secret_jwt_key_2026_secure';

// Mandatory authentication middleware for protected routes
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No authentication token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token is empty or malformed.'
      });
    }

    const decoded = jwt.verify(token, getSecret());
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User associated with this token no longer exists.'
      });
    }

    req.user = user;
    req.userId = user._id.toString();
    req.userEmail = user.email;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Your session has expired. Please sign in again.'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid or corrupt token. Please sign in again.'
    });
  }
};

// Optional authentication middleware (for public routes that can personalize when authenticated)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, getSecret());
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
          req.userId = user._id.toString();
          req.userEmail = user.email;
        }
      }
    }
  } catch (e) {
    // Ignore invalid token in optional mode
  }
  next();
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name
    },
    getSecret(),
    { expiresIn: '30d' }
  );
};

