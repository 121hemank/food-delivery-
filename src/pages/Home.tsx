
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, Plus, Truck, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const featuredRestaurants = [
    {
      id: '1',
      name: 'Spice Paradise',
      cuisine: 'North Indian',
      rating: 4.5,
      deliveryTime: '25-30 min',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
      specialDish: 'Butter Chicken',
      dishPrice: 299,
      dishImage: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400'
    },
    {
      id: '2',
      name: 'South Delight',
      cuisine: 'South Indian',
      rating: 4.3,
      deliveryTime: '30-35 min',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFzYWxhJTIwZG9zYXxlbnwwfHwwfHx8MA%3D%3D',
      specialDish: 'Masala Dosa',
      dishPrice: 199,
      dishImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400'
    },
    {
      id: '3',
      name: 'Pizza Corner',
      cuisine: 'Italian',
      rating: 4.2,
      deliveryTime: '20-25 min',
      image: 'https://images.unsplash.com/photo-1695324318807-a234819bad21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBpenphJTIwY29uY2VyfGVufDB8fDB8fHww',
      specialDish: 'Margherita Pizza',
      dishPrice: 349,
      dishImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'
    },
    {
      id: '4',
      name: 'Burger House',
      cuisine: 'American',
      rating: 4.4,
      deliveryTime: '15-20 min',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
      specialDish: 'Classic Burger',
      dishPrice: 249,
      dishImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
    }
  ];

  const handleAddToCart = (restaurant: any) => {
    addToCart({
      id: `${restaurant.id}-special`,
      name: restaurant.specialDish,
      price: restaurant.dishPrice,
      image: restaurant.dishImage,
      restaurant: restaurant.name
    });

    toast({
      title: "Added to cart",
      description: `${restaurant.specialDish} from ${restaurant.name} has been added to your cart`,
    });
  };

  const stats = [
    { icon: Users, value: '10,000+', label: 'Happy Customers' },
    { icon: Award, value: '50+', label: 'Partner Restaurants' },
    { icon: TrendingUp, value: '99.9%', label: 'Delivery Success' },
    { icon: Clock, value: '< 30min', label: 'Average Delivery' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Delicious Food,<br />
            <span className="text-yellow-300">Delivered Fast</span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Order from your favorite restaurants and get fresh, hot meals delivered to your doorstep in minutes.
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter your delivery address"
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-orange-300 text-lg"
              />
            </div>
            <Link to="/menu">
              <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl font-semibold">
                Find Food
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-orange-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Hemanku?</h2>
            <p className="text-xl text-gray-600">We make food delivery simple, fast, and reliable</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Lightning Fast Delivery</h3>
              <p className="text-gray-600 text-lg">Get your food delivered in 30 minutes or less, guaranteed fresh and hot</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Premium Restaurants</h3>
              <p className="text-gray-600 text-lg">Partner with the best restaurants in your area for quality you can trust</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">24/7 Availability</h3>
              <p className="text-gray-600 text-lg">We're available round the clock for your convenience, whenever you're hungry</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Restaurants</h2>
            <p className="text-xl text-gray-600">Discover amazing food from top-rated restaurants</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <Link to={`/restaurant/${restaurant.id}`}>
                  <div className="relative">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
                      <Star className="w-4 h-4 text-yellow-500 fill-current inline mr-1" />
                      {restaurant.rating}
                    </div>
                  </div>
                </Link>
                
                <div className="p-6">
                  <Link to={`/restaurant/${restaurant.id}`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-orange-500 transition-colors">
                      {restaurant.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
                  
                  <div className="flex items-center text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{restaurant.deliveryTime}</span>
                  </div>
                  
                  {/* Special Dish Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-800">{restaurant.specialDish}</span>
                      <span className="text-orange-500 font-bold text-lg">₹{restaurant.dishPrice}</span>
                    </div>
                    <Button 
                      onClick={() => handleAddToCart(restaurant)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 rounded-lg transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/menu">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-12 py-4 text-lg rounded-xl font-semibold">
                View All Restaurants
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl mb-10 leading-relaxed">Browse our menu and get your favorite food delivered now!</p>
          <Link to="/menu">
            <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 px-12 py-4 text-xl rounded-xl font-semibold">
              Order Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
