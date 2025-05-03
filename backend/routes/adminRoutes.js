import express from 'express';
import { auth, requireRole } from '../middlewares/authMiddleware.js';
import User from '../models/User.js';
import Ride from '../models/Ride.js';
import ActivityLog from '../models/ActivityLog.js';

const router = express.Router();

// Get all users and drivers
router.get('/users', auth, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch users' });
  }
});

// Delete a user or driver
router.delete('/users/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Log the admin action
    await ActivityLog.create({
      admin: req.user._id,
      action: 'delete_user',
      target: req.params.id,
    });

    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete user' });
  }
});

// Admin dashboard analytics
router.get('/analytics', auth, requireRole('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalRides = await Ride.countDocuments();
    const activeRides = await Ride.countDocuments({ status: { $in: ['pending', 'accepted'] } });
    const totalRevenue = await Ride.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    res.send({
      totalUsers,
      totalDrivers,
      totalRides,
      activeRides,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch analytics data' });
  }
});

export default router;
