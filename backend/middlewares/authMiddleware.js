import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Authentication middleware
export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ error: 'Token missing. Please authenticate.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).send({ error: 'Token expired. Please log in again.' });
    } else {
      res.status(401).send({ error: 'Please authenticate.' });
    }
  }
};

// Role-based access control middleware
export const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).send({ error: 'Access denied' });
  }
  next();
};
