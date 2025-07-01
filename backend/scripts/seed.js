
const mongoose = require('mongoose');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Coupon = require('../models/Coupon');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await Coupon.deleteMany({});

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@hemanku.com',
      password: 'admin123',
      isAdmin: true
    });
    await admin.save();

    // Create regular user
    const user = new User({
      name: 'Test User',
      email: 'user@hemanku.com',
      password: 'password123',
      isAdmin: false
    });
    await user.save();

    // Create restaurants
    const restaurants = [
      {
        name: 'Biryani House',
        cuisine: 'Indian',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d29b?w=400',
        rating: 4.5,
        deliveryTime: '25-30 mins'
      },
      {
        name: 'Spice Paradise',
        cuisine: 'North Indian',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
        rating: 4.3,
        deliveryTime: '30-35 mins'
      },
      {
        name: 'Pizza Corner',
        cuisine: 'Italian',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        rating: 4.4,
        deliveryTime: '20-25 mins'
      }
    ];

    const savedRestaurants = await Restaurant.insertMany(restaurants);

    // Create menu items
    const menuItems = [
      {
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice with tender chicken pieces',
        price: 299,
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d29b?w=400',
        category: 'Main Course',
        restaurant: savedRestaurants[0]._id
      },
      {
        name: 'Paneer Butter Masala',
        description: 'Rich and creamy paneer curry',
        price: 249,
        image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400',
        category: 'Main Course',
        restaurant: savedRestaurants[1]._id
      },
      {
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh mozzarella and basil',
        price: 199,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
        category: 'Pizza',
        restaurant: savedRestaurants[2]._id
      }
    ];

    await MenuItem.insertMany(menuItems);

    // Create coupons
    const coupons = [
      {
        code: 'WELCOME20',
        discount: 50,
        type: 'fixed',
        expiresAt: new Date('2024-12-31')
      },
      {
        code: 'SAVE15',
        discount: 15,
        type: 'percentage',
        expiresAt: new Date('2024-12-31')
      }
    ];

    await Coupon.insertMany(coupons);

    console.log('Seed data created successfully!');
    console.log('Admin login: admin@hemanku.com / admin123');
    console.log('User login: user@hemanku.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
