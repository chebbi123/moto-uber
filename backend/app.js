import express from 'express';
import cors from 'cors';
import locale from 'express-simple-locale';
import authRoutes from './routes/authRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import driverRoutes from './routes/driverRoutes.js';

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'https://moto-uber.netlify.app'
];

// Configuration CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true // si tu utilises les cookies ou headers d'auth
}));

app.use(express.json());

// Language detection middleware
app.use(locale());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes); // Ensure the rideRoutes include the fare estimation endpoint.
app.use('/api/payments', paymentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes); // Add admin routes
app.use('/api/drivers', driverRoutes); // Add driver routes

// Attach WebSocket server
app.set('io', null);

export default app;
