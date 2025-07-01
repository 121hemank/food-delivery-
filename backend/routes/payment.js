
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Create payment session
router.post('/create-session', auth, async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;
    
    // Create order in database first
    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod: 'stripe',
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    await order.save();
    
    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : []
          },
          unit_amount: item.price * 100, // Convert to paise
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?order_id=${order._id}`,
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      }
    });
    
    // Update order with stripe session ID
    order.stripeSessionId = session.id;
    await order.save();
    
    res.json({ 
      sessionId: session.id, 
      url: session.url,
      orderId: order._id 
    });
  } catch (error) {
    console.error('Payment session creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Verify payment
router.get('/verify/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    if (session.payment_status === 'paid') {
      // Update order status
      await Order.findOneAndUpdate(
        { stripeSessionId: req.params.sessionId },
        { 
          paymentStatus: 'paid',
          status: 'confirmed'
        }
      );
    }
    
    res.json({ 
      paid: session.payment_status === 'paid',
      status: session.payment_status 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment status
router.get('/status/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      paymentStatus: order.paymentStatus,
      orderStatus: order.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
