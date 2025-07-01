
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600' },
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  deliveryTime: { type: String, default: '30-45 mins' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
