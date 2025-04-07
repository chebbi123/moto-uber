import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickup: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  dropoff: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending',
  },
  price: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Ride', rideSchema);
