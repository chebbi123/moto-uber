import express from 'express';
import { registerUser, loginUser, requestPasswordReset, resetPassword } from '../controllers/userController.js';
import { createNotification, getNotifications } from '../config/notificationService.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// User registration
router.post('/api/users/register', registerUser);

// User login
router.post('/api/users/login', loginUser);

// Request password reset
router.post('/request-reset', requestPasswordReset);

// Reset password
router.post('/reset-password', resetPassword);

// Create a notification
router.post('/notifications', auth, async (req, res) => {
  try {
    const { title, body } = req.body;
    const notification = await createNotification(req.user._id, title, body);
    res.status(201).send(notification);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    const notifications = await getNotifications(req.user._id);
    res.send(notifications);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
