import mongoose from 'mongoose';

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

// Function to create a notification
export const createNotification = async (userId, title, body) => {
  try {
    const notification = new Notification({ userId, title, body });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    throw error;
  }
};

// Function to fetch notifications for a user
export const getNotifications = async (userId) => {
  try {
    return await Notification.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    throw error;
  }
};
