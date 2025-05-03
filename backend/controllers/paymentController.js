import { createPaymentIntent } from '../config/stripe.js';

// Create a payment intent
export const createPayment = async (req, res) => {
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
};
