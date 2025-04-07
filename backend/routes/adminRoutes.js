import express from 'express';
import { getUsers, deleteUser, getRides, deleteRide } from '../controllers/adminController.js';
import { auth, adminAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin: Get all users
router.get('/users', auth, adminAuth, getUsers);

// Admin: Delete a user
router.delete('/users/:id', auth, adminAuth, deleteUser);

// Admin: Get all rides
router.get('/rides', auth, adminAuth, getRides);

// Admin: Delete a ride
router.delete('/rides/:id', auth, adminAuth, deleteRide);

export default router;
