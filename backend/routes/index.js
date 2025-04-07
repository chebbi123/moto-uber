import express from 'express';
import userRoutes from './userRoutes.js';
import rideRoutes from './rideRoutes.js';
import adminRoutes from './adminRoutes.js';
import driverRoutes from './driverRoutes.js'; // Import driver routes

const router = express.Router();

router.use('/users', userRoutes);
router.use('/rides', rideRoutes);
router.use('/admin', adminRoutes);
router.use('/driver', driverRoutes); // Add driver routes

export default router;
