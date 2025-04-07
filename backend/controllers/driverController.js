import Ride from '../models/Ride.js';

export const getDriverRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id }).populate('user').populate('driver');
    res.send(rides);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching rides.' });
  }
};
