import Ride from '../models/Ride.js';
import User from '../models/User.js';
import { calculateDistance } from '../utils/calculateDistance.js';
import { getTranslation } from '../config/locale.js';

// Confirm a ride
export const confirmRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).send({ error: 'Ride not found' });
    }

    if (ride.status !== 'pending') {
      return res.status(400).send({ error: 'Ride is not in a pending state' });
    }

    ride.status = 'accepted';
    ride.driver = req.user._id;
    await ride.save();

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
};

// Create a new ride
export const createRide = async (req, res) => {
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
};

// Estimate fare for a ride
export const estimateFare = async (req, res) => {
  try {
    const { pickup, dropoff } = req.body;
    const lang = req.locale || 'en';

    if (!pickup || !dropoff || !pickup.coordinates || !dropoff.coordinates) {
      return res.status(400).send({ error: getTranslation(lang, 'error_missing_locations') });
    }

    // Calculate distance
    const distance = calculateDistance(pickup.coordinates, dropoff.coordinates);

    // Calculate demand factor
    const activeRides = await Ride.countDocuments({ status: { $in: ['pending', 'accepted'] } });
    const demandFactor = 1 + activeRides * 0.01; // 1% increase per active ride

    // Base price per kilometer
    const basePricePerKm = 2; // Example: $2 per kilometer

    // Calculate estimated fare
    const estimatedFare = Math.round(distance * basePricePerKm * demandFactor * 100) / 100;

    res.send({ message: getTranslation(lang, 'fare_estimation', { fare: estimatedFare }), distance });
  } catch (error) {
    res.status(500).send({ error: getTranslation(req.locale || 'en', 'error_generic') });
  }
};

// Fare estimation function
const calculateFare = (distance) => {
  const pricePerKm = 0.7; // Price per kilometer in TND
  return Math.round(distance * pricePerKm * 100) / 100; // Round to 2 decimal places
};

// Fetch requested rides
export const getRequestedRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'pending' }).populate('user', 'name');

    // Calculate distance and fare for each ride
    const ridesWithDetails = rides.map((ride) => {
      const distance = calculateDistance(
        ride.pickup.coordinates,
        ride.dropoff.coordinates
      );
      const estimatedFare = calculateFare(distance); // Use the fare estimation function
      return {
        ...ride.toObject(),
        distance, // Add calculated distance to the ride object
        estimatedFare, // Add estimated fare to the ride object
      };
    });

    res.send(ridesWithDetails);
    console.log('Requested rides fetched successfully:', ridesWithDetails);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch requested rides' });
  }
};

// Fetch all rides for the current user
export const getUserRides = async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Add distance and estimated fare to each ride
    const ridesWithDetails = rides.map((ride) => {
      const distance = calculateDistance(
        ride.pickup.coordinates,
        ride.dropoff.coordinates
      );
      const estimatedFare = calculateFare(distance); // Use the fare estimation function
      return {
        ...ride.toObject(),
        distance, // Add calculated distance to the ride object
        estimatedFare, // Add estimated fare to the ride object
      };
    });

    res.send(ridesWithDetails);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch ride history' });
  }
};
