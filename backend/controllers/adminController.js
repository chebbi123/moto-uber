import User from '../models/User.js';
import Ride from '../models/Ride.js';

// Fetch all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude passwords
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch users' });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!['user', 'driver', 'admin'].includes(role)) {
      return res.status(400).send({ error: 'Invalid role' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.send({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update user role' });
  }
};

// Fetch analytics data
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({ status: 'completed' });

    res.send({
      totalUsers,
      totalDrivers,
      totalRides,
      completedRides,
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch analytics data' });
  }
};
