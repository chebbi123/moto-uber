import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import './config/database.js';
import routes from './routes/index.js';
import { createNotification } from './config/notificationService.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRide', (rideId) => {
    socket.join(rideId);
    console.log(`User joined ride room: ${rideId}`);
  });

  socket.on('leaveRide', (rideId) => {
    socket.leave(rideId);
    console.log(`User left ride room: ${rideId}`);
  });

  socket.on('updateLocation', ({ rideId, location }) => {
    io.to(rideId).emit('locationUpdate', location);
  });

  socket.on('updateStatus', async ({ rideId, status, userId }) => {
    io.to(rideId).emit('statusUpdate', status);

    try {
      await createNotification(userId, 'Ride Status Update', `Your ride status is now: ${status}`);
    } catch (error) {
      console.error('Error creating notification:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});