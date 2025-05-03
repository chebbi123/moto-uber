import express from 'express';
import { updateUser, userInfo } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // Use named import

const router = express.Router();

// Update user route
router.put('/:id', updateUser);

// Route to get user information
router.get('/me', authMiddleware, userInfo);

export default router;
