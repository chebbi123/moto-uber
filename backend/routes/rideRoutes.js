import express from 'express';
import { createRide, getRides, estimateRidePrice } from '../controllers/rideController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a new ride
router.post('/', auth, createRide);

// Get user rides
router.get('/', auth, getRides);

// Estimate ride price
router.post('/estimate', auth, estimateRidePrice);

export default router;
