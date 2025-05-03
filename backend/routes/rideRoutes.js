import express from 'express';
import { sendSMS } from '../config/twilio.js'; // Keep this import for placeholder
import Ride from '../models/Ride.js';
import User from '../models/User.js';
import { auth, requireRole } from '../middlewares/authMiddleware.js';
import { calculateDistance } from '../utils/calculateDistance.js';
import { getTranslation } from '../config/locale.js';
import { getRequestedRides, getUserRides } from '../controllers/rideController.js'; // Import getRequestedRides and getUserRides

const router = express.Router();

router.put('/:id/confirm', auth, requireRole('driver'), async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).send({ error: 'Ride not found' });
    }

    if (ride.status !== 'pending') {
      return res.status(400).send({ error: 'Ride is not in a pending state' });
    }

    ride.status = 'accepted';
    // Notify the user via SMS (disabled for now)
    const user = await User.findById(ride.user);
    if (user && user.phone) {
      // await sendSMS(user.phone, `Your ride has been confirmed by ${req.user.name}.`);
      console.log(`SMS notification disabled. Message to ${user.phone}: Your ride has been confirmed.`);
    }

    res.send({ message: 'Ride confirmed successfully', ride });
  } catch (error) {
    res.status(500).send({ error: 'Failed to confirm ride' });
  }
});

router.post('/', auth, async (req, res) => {
  const { pickup, dropoff } = req.body;

  if (!pickup || !dropoff || !pickup.coordinates || !dropoff.coordinates) {
    return res.status(400).json({ message: 'Pickup and dropoff locations are required.' });
  }

  try {
    const ride = new Ride({
      user: req.user._id,
      pickup,
      dropoff,
    });

    const savedRide = await ride.save();
    res.status(201).json(savedRide);
  } catch (error) {
    console.error('Error creating ride:', error);
    res.status(500).json({ message: 'Failed to create ride.' });
  }
});

// Estimate fare for a ride
router.post('/estimate-fare', auth, async (req, res) => {
  try {
    const { pickup, dropoff } = req.body;

    if (!pickup || !dropoff || !pickup.lat || !pickup.lng || !dropoff.lat || !dropoff.lng) {
      return res.status(400).send({ error: 'Pickup and dropoff locations with coordinates are required.' });
    }

    // Calculate distance
    const distance = calculateDistance({ lat: pickup.lat, lng: pickup.lng }, { lat: dropoff.lat, lng: dropoff.lng });

    // Calculate demand factor
    const activeRides = await Ride.countDocuments({ status: { $in: ['pending', 'accepted'] } });
    const demandFactor = 1 + activeRides * 0.01; // 1% increase per active ride

    // Base price per kilometer
    const basePricePerKm = 2; // Example: $2 per kilometer

    // Calculate estimated fare
    const estimatedFare = Math.round(distance * basePricePerKm * demandFactor * 100) / 100;

    res.send({ estimatedFare, distance });
  } catch (error) {
    console.error('Error estimating fare:', error);
    res.status(500).send({ error: 'Failed to estimate fare.' });
  }
});

// Fetch requested rides
router.get('/requested', auth, requireRole('driver'), getRequestedRides); // Add requested rides route

// Fetch all rides for the current user
router.get('/user', auth, getUserRides);

export default router;
