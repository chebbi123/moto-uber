import express from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import User from '../models/User.js';
import { createPaymentIntent } from '../config/stripe.js';
import { sendReceipt } from '../utils/sendReceipt.js';

const router = express.Router();

// Add funds to wallet
router.post('/add-funds', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).send({ error: 'Invalid amount' });
    }

    const paymentIntent = await createPaymentIntent(amount);

    // Simulate receipt details (replace with actual transaction details in production)
    const receiptDetails = {
      amount,
      date: new Date().toLocaleString(),
      transactionId: paymentIntent.id,
    };

    // Send receipt via email
    await sendReceipt(req.user.email, receiptDetails);

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create payment intent' });
  }
});

// Deduct funds from wallet
router.post('/deduct-funds', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).send({ error: 'Invalid amount' });
    }

    const user = await User.findById(req.user._id);

    if (user.wallet < amount) {
      return res.status(400).send({ error: 'Insufficient wallet balance' });
    }

    user.wallet -= amount;
    await user.save();

    res.send({ message: 'Funds deducted successfully', wallet: user.wallet });
  } catch (error) {
    res.status(500).send({ error: 'Failed to deduct funds' });
  }
});

// Get wallet balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.send({ wallet: user.wallet });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch wallet balance' });
  }
});

export default router;
