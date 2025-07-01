
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discount: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true },
  usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

// Ensure code is always uppercase
couponSchema.pre('save', function(next) {
  if (this.code) {
    this.code = this.code.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Coupon', couponSchema);
