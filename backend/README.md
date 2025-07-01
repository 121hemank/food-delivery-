
# Hemanku Backend API

Backend API for the Hemanku Food Delivery Application built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT)
- Restaurant management
- Menu item management
- Order processing
- Payment integration with Stripe
- Coupon system
- Admin panel functionality

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your environment variables (already provided)

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant (Admin)
- `PUT /api/restaurants/:id` - Update restaurant (Admin)
- `DELETE /api/restaurants/:id` - Delete restaurant (Admin)

### Menu Items
- `GET /api/menu` - Get all menu items
- `GET /api/menu/restaurant/:restaurantId` - Get menu by restaurant
- `GET /api/menu/:id` - Get menu item by ID
- `POST /api/menu` - Create menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/admin` - Get all orders (Admin)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/payment` - Update payment status

### Payment
- `POST /api/payment/create-session` - Create Stripe checkout session
- `GET /api/payment/verify/:sessionId` - Verify payment
- `GET /api/payment/session/:sessionId` - Get payment details

### Coupons
- `GET /api/coupons` - Get all coupons (Admin)
- `POST /api/coupons/validate` - Validate coupon code
- `POST /api/coupons` - Create coupon (Admin)
- `PUT /api/coupons/:id` - Update coupon (Admin)
- `DELETE /api/coupons/:id` - Delete coupon (Admin)
- `POST /api/coupons/:id/use` - Use coupon

## Environment Variables

All environment variables are already configured in your `.env` file.

## Database Models

- **User**: User accounts with authentication
- **Restaurant**: Restaurant information
- **MenuItem**: Menu items linked to restaurants
- **Order**: Customer orders with items and payment info
- **Coupon**: Discount coupons with usage tracking

## Middleware

- **auth**: JWT authentication middleware
- **adminAuth**: Admin-only access middleware

## Running the Server

The server will run on port 5000 by default. You can access:
- API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

Make sure your frontend is configured to connect to this backend URL.
