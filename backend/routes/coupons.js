
const express = require('express');
const Coupon = require('../models/Coupon');
const router = express.Router();

// Get all coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ message: error.message });
  }
});

// Validate coupon - FIXED
router.post('/validate', async (req, res) => {
  try {
    console.log('Validating coupon:', req.body);
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }
    
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() }
    });
    
    console.log('Found coupon:', coupon);
    
    if (!coupon) {
      return res.status(404).json({ 
        valid: false, 
        message: 'Invalid or expired coupon' 
      });
    }
    
    // Check usage limit if it exists
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ 
        valid: false, 
        message: 'Coupon usage limit exceeded' 
      });
    }
    
    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        type: coupon.type
      }
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new coupon
router.post('/', async (req, res) => {
  try {
    const { code, discount, type, expiresAt, usageLimit } = req.body;
    
    const coupon = new Coupon({
      code: code.toUpperCase(),
      discount,
      type,
      expiresAt: new Date(expiresAt),
      usageLimit
    });
    
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    console.error('Error creating coupon:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Update coupon
router.put('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    res.json(coupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete coupon
router.delete('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ message: error.message });
  }
});

// Use coupon (increment usage count)
router.post('/:id/use', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { $inc: { usedCount: 1 } },
      { new: true }
    );
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    res.json(coupon);
  } catch (error) {
    console.error('Error using coupon:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
