import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'driver', 'admin'], default: 'user' },
  name: String,
  phone: String,
  createdAt: { type: Date, default: Date.now },
  resetToken: String,
  resetTokenExpiry: Date,
});

export default mongoose.model('User', userSchema);
