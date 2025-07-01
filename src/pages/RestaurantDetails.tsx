
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { restaurantsAPI, menuAPI } from '@/services/api';

interface Restaurant {
  _id: string;
  name: string;
  cuisine: string;
  image: string;
  rating: number;
  deliveryTime: string;
  isActive: boolean;
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurant: {
    _id: string;
    name: string;
  };
  isAvailable: boolean;
}

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      loadRestaurantData();
    }
  }, [id]);

  const loadRestaurantData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [restaurantData, menuData] = await Promise.all([
        restaurantsAPI.getById(id),
        menuAPI.getByRestaurant(id)
      ]);
      
      setRestaurant(restaurantData);
      setMenuItems(menuData);
    } catch (error) {
      console.error('Error loading restaurant data:', error);
      toast({
        title: "Error loading restaurant",
        description: "Failed to load restaurant details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      restaurant: item.restaurant.name
    });

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];
  const filteredItems = selectedCategory === 'all' 
    ? menuItems.filter(item => item.isAvailable)
    : menuItems.filter(item => item.category === selectedCategory && item.isAvailable);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Restaurant not found</h2>
          <Link to="/menu">
            <Button>Back to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/menu" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </Link>
        </div>

        {/* Restaurant Info */}
        <Card className="mb-8 overflow-hidden">
          <div className="md:flex">
            <img 
              src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'} 
              alt={restaurant.name}
              className="w-full md:w-1/3 h-64 md:h-48 object-cover"
            />
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
                  <p className="text-gray-600 text-lg mb-4">{restaurant.cuisine}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="ml-1 font-medium">{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-5 h-5" />
                      <span className="ml-1">{restaurant.deliveryTime}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={restaurant.isActive ? 'default' : 'secondary'}>
                  {restaurant.isActive ? 'Open' : 'Closed'}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Menu Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Items' : category}
              </Button>
            ))}
          </div>

          {/* Menu Items */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No menu items available in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'} 
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-orange-500">₹{item.price}</span>
                      <Button 
                        onClick={() => handleAddToCart(item)}
                        className="btn-primary"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
