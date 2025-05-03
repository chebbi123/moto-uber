import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Explicitly load the .env file from the backend directory
dotenv.config({ path: '../.env' });

const createTestAccounts = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in the .env file.');
    }

    // Connect to the database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 8);
    const driverPassword = await bcrypt.hash('driver123', 8);

    // Create admin account
    const admin = new User({
      name: 'Admin User',
      email: 'admin@moto-uber.com',
      password: adminPassword,
      role: 'admin',
    });

    // Create driver account
    const driver = new User({
      name: 'Driver User',
      email: 'driver@moto-uber.com',
      password: driverPassword,
      role: 'driver',
      vehicleType: 'Motorcycle',
      vehicleNumber: 'TN-1234',
    });

    // Save accounts to the database
    await admin.save();
    await driver.save();

    console.log('Admin and Driver accounts created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test accounts:', error.message);
    process.exit(1);
  }
};

createTestAccounts();
