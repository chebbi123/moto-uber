import loadEnv from './config/dotenv.js';
import connectDB from './config/db.js';
import { Server } from 'socket.io';
import http from 'http';
import app from './app.js';
import express from 'express';
import rideRoutes from './routes/rideRoutes.js';
import UserRoutes from './routes/UserRoutes.js'; // Import UserRoutes

loadEnv();
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());

// Routes
app.use('/api/rides', rideRoutes);
app.use('/api/users', UserRoutes); // User routes

// Attach WebSocket server to the app
app.set('io', io);

io.on('connection', (socket) => {
  console.log('A driver connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A driver disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});