import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'driver', 'admin'], default: 'user' },
  name: String,
  phone: String,
  location: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  availability: { type: String, enum: ['available', 'busy'], default: 'available' },
  wallet: { type: Number, default: 0 }, // Wallet balance in USD
  vehicleType: { type: String, default: null }, // Vehicle type for drivers
  vehicleNumber: { type: String, default: null }, // Vehicle number for drivers
  documents: [
    {
      name: { type: String },
      url: { type: String },
    },
  ], // Uploaded documents for onboarding
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
