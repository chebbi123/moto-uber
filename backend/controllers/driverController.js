import Ride from '../models/Ride.js';

// Update driver location
export const updateDriverLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (lat == null || lng == null) {
      return res.status(400).send({ error: 'Latitude and longitude are required' });
    }

    req.user.location = { lat, lng };
    await req.user.save();

    res.send({ message: 'Location updated successfully', location: req.user.location });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update location' });
  }
};

// Update driver availability
export const updateDriverAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    if (!['available', 'busy'].includes(availability)) {
      return res.status(400).send({ error: 'Invalid availability status' });
    }

    req.user.availability = availability;
    await req.user.save();

    res.send({ message: 'Availability updated successfully', availability: req.user.availability });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update availability' });
  }
};

// Fetch driver performance metrics
export const getDriverPerformance = async (req, res) => {
  try {
    const completedRides = await Ride.countDocuments({ driver: req.user._id, status: 'completed' });
    const ratings = await Ride.aggregate([
      { $match: { driver: req.user._id, status: 'completed', rating: { $exists: true } } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);

    const ongoingRides = await Ride.countDocuments({ driver: req.user._id, status: 'ongoing' });
    const canceledRides = await Ride.countDocuments({ driver: req.user._id, status: 'canceled' });

    res.send({
      completedRides,
      averageRating: ratings[0]?.averageRating || 0,
      ongoingRides,
      canceledRides,
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch performance metrics' });
  }
};

