🍽️ Hemanku Food Delivery App
Welcome to Hemanku Food Delivery App, your go-to platform for ordering delicious meals from local restaurants with ease! 🌮 This app connects food lovers with their favorite eateries, offering real-time tracking, secure payments, and a delightful user experience. Built with modern technologies, it's designed for scalability and performance.

📋 Table of Contents





About the Project



Key Features



Tech Stack



Getting Started



Usage



Contributing



License



Contact

🍴 About the Project

The Hemanku Food Delivery App is a full-stack application that simplifies food ordering and delivery. Whether you're craving a quick bite or managing a restaurant's online orders, this app provides a seamless experience for customers and restaurant owners alike. Our mission is to make food delivery fast, reliable, and delightful.



✨ Key Features





Discover Restaurants: Browse a curated list of local restaurants and their menus.



Real-Time Tracking: Follow your order from kitchen to doorstep in real-time.



Secure Payments: Pay safely with multiple payment gateways.



User Profiles: Personalized accounts for customers and restaurant admins.



Push Notifications: Stay updated with order status and exclusive offers.



Admin Dashboard: Manage menus, orders, and analytics with ease.

🛠️ Tech Stack





Frontend: React, Tailwind CSS



Backend: Node.js, Express



Database: MongoDB



Other Tools: Prisma ORM, JWT for authentication, WebSocket for real-time updates

🚀 Getting Started

Follow these steps to set up the Hemanku Food Delivery App locally.

Prerequisites

Ensure you have the following installed:





Node.js (v16.x or higher)



Python (v3.8 or higher)



MongoDB (v4.4 or higher)



Git



npm or yarn

Installation





Clone the Repository:

git clone https://github.com/yourusername/hemanku-food-delivery.git
cd hemanku-food-delivery



Install Dependencies:

npm install



Set Up Environment Variables:





Copy the example environment file:

cp .env.example .env



Update .env with your MongoDB URI, API keys, and other settings.



Initialize the Database:

npx prisma generate
npx prisma db push



Start the Application:

npm run dev



Access the App: Visit http://localhost:3000 in your browser.

📖 Usage





Customers:





Sign up or log in to explore restaurants.



Add items to your cart and place orders.



Track your delivery in real-time.



Restaurant Admins:





Access the admin dashboard at http://localhost:3000/admin.



Manage menus, view orders, and update statuses.



Run in Production:

npm run build
npm start

For detailed instructions, check the User Guide.

🤝 Contributing

We love contributions! To get started:





Fork this repository.



Create a feature branch: git checkout -b feature/your-feature.



Commit your changes: git commit -m 'Add your feature'.



Push to the branch: git push origin feature/your-feature.



Open a pull request.

See our Contributing Guidelines for more details.

📜 License

This project is licensed under the MIT License.
