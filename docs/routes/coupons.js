
const express = require('express');
const router = express.Router();

// For now, we'll use an in-memory array for coupons
// In production, you'd want to create a Coupon model
let coupons = [
  {
    id: '1',
    code: 'WELCOME20',
    discount: 20,
    type: 'percentage',
    isActive: true,
    expiresAt: new Date('2024-12-31')
  },
  {
    id: '2',
    code: 'SAVE50',
    discount: 50,
    type: 'fixed',
    isActive: true,
    expiresAt: new Date('2024-12-31')
  }
];

// Get all coupons (Admin only)
router.get('/', async (req, res) => {
  try {
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validate coupon
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    
    const coupon = coupons.find(c => 
      c.code.toLowerCase() === code.toLowerCase() && 
      c.isActive && 
      new Date() < new Date(c.expiresAt)
    );
    
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon' });
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
    res.status(500).json({ message: error.message });
  }
});

// Create new coupon
router.post('/', async (req, res) => {
  try {
    const { code, discount, type, expiresAt } = req.body;
    
    const newCoupon = {
      id: Date.now().toString(),
      code: code.toUpperCase(),
      discount,
      type,
      isActive: true,
      expiresAt: new Date(expiresAt)
    };
    
    coupons.push(newCoupon);
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update coupon
router.put('/:id', async (req, res) => {
  try {
    const couponIndex = coupons.findIndex(c => c.id === req.params.id);
    
    if (couponIndex === -1) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    coupons[couponIndex] = { ...coupons[couponIndex], ...req.body };
    res.json(coupons[couponIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete coupon
router.delete('/:id', async (req, res) => {
  try {
    const couponIndex = coupons.findIndex(c => c.id === req.params.id);
    
    if (couponIndex === -1) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    coupons.splice(couponIndex, 1);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
