import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id).select('-password');
    if (!req.user) {
      return res.status(401).send({ error: 'Invalid token.' });
    }

    next();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized.' });
  }
};
