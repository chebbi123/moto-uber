import express from 'express';
import { getDriverRides } from '../controllers/driverController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Driver: Get all rides assigned to the driver
router.get('/rides', auth, getDriverRides);

export default router;
