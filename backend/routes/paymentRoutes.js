import express from 'express';
import { createPaymentIntent } from '../config/stripe.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).send({ error: 'Invalid amount' });
    }

    const paymentIntent = await createPaymentIntent(amount);
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create payment intent' });
  }
});

export default router;
