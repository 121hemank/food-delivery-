import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Star, Clock, Package, TrendingUp } from 'lucide-react';
import { couponsAPI, restaurantsAPI, menuAPI, ordersAPI } from '@/services/api';

interface Coupon {
  _id: string;
  code: string;
  discount: number;
  type: 'fixed' | 'percentage';
  expiresAt: string;
  isActive: boolean;
  usedCount?: number;
  usageLimit?: number;
}

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

interface Order {
  _id: string;
  user: string;
  items: Array<{
    menuItem: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  deliveryAddress: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Analytics state
  const [analytics, setAnalytics] = useState({
    totalRestaurants: 0,
    totalMenuItems: 0,
    totalCoupons: 0,
    activeCoupons: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  // Coupon form state
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 0,
    type: 'fixed' as 'fixed' | 'percentage',
    expiresAt: ''
  });

  // Restaurant form state
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    cuisine: '',
    image: '',
    deliveryTime: '',
    rating: 4.0
  });

  // Menu item form state
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    restaurant: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [couponsData, restaurantsData, menuData, ordersData] = await Promise.all([
        couponsAPI.getAll().catch(() => []),
        restaurantsAPI.getAll().catch(() => []),
        menuAPI.getAll().catch(() => []),
        ordersAPI.getAdminOrders().catch(() => [])
      ]);
      
      setCoupons(couponsData);
      setRestaurants(restaurantsData);
      setMenuItems(menuData);
      setOrders(ordersData);

      // Calculate analytics
      const totalRevenue = ordersData.reduce((sum, order) => sum + order.totalAmount, 0);
      setAnalytics({
        totalRestaurants: restaurantsData.length,
        totalMenuItems: menuData.length,
        totalCoupons: couponsData.length,
        activeCoupons: couponsData.filter(c => c.isActive).length,
        totalOrders: ordersData.length,
        totalRevenue
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error loading data",
        description: "Some data may not be available",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Coupon operations
  const handleCreateCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount || !newCoupon.expiresAt) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const coupon = await couponsAPI.create(newCoupon);
      setCoupons(prev => [...prev, coupon]);
      setNewCoupon({ code: '', discount: 0, type: 'fixed', expiresAt: '' });
      toast({
        title: "Coupon created",
        description: `Coupon ${coupon.code} has been created successfully`,
      });
    } catch (error) {
      toast({
        title: "Error creating coupon",
        description: "Failed to create coupon. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      await couponsAPI.delete(id);
      setCoupons(prev => prev.filter(coupon => coupon._id !== id));
      toast({
        title: "Coupon deleted",
        description: "Coupon has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting coupon",
        description: "Failed to delete coupon. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleCouponStatus = async (id: string) => {
    const coupon = coupons.find(c => c._id === id);
    if (!coupon) return;

    try {
      const updatedCoupon = await couponsAPI.update(id, { isActive: !coupon.isActive });
      setCoupons(prev => prev.map(c => c._id === id ? updatedCoupon : c));
    } catch (error) {
      toast({
        title: "Error updating coupon",
        description: "Failed to update coupon status.",
        variant: "destructive"
      });
    }
  };

  // Restaurant operations
  const handleCreateRestaurant = async () => {
    if (!newRestaurant.name || !newRestaurant.cuisine) {
      toast({
        title: "Error",
        description: "Please fill required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const restaurant = await restaurantsAPI.create(newRestaurant);
      setRestaurants(prev => [...prev, restaurant]);
      setNewRestaurant({ name: '', cuisine: '', image: '', deliveryTime: '', rating: 4.0 });
      toast({
        title: "Restaurant created",
        description: `${restaurant.name} has been created successfully`,
      });
    } catch (error) {
      toast({
        title: "Error creating restaurant",
        description: "Failed to create restaurant. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    try {
      await restaurantsAPI.delete(id);
      setRestaurants(prev => prev.filter(restaurant => restaurant._id !== id));
      toast({
        title: "Restaurant deleted",
        description: "Restaurant has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting restaurant",
        description: "Failed to delete restaurant. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Menu item operations
  const handleCreateMenuItem = async () => {
    if (!newMenuItem.name || !newMenuItem.price || !newMenuItem.restaurant) {
      toast({
        title: "Error",
        description: "Please fill required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const menuItem = await menuAPI.create(newMenuItem);
      setMenuItems(prev => [...prev, menuItem]);
      setNewMenuItem({ name: '', description: '', price: 0, image: '', category: '', restaurant: '' });
      toast({
        title: "Menu item created",
        description: `${menuItem.name} has been created successfully`,
      });
    } catch (error) {
      toast({
        title: "Error creating menu item",
        description: "Failed to create menu item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await menuAPI.delete(id);
      setMenuItems(prev => prev.filter(item => item._id !== id));
      toast({
        title: "Menu item deleted",
        description: "Menu item has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting menu item",
        description: "Failed to delete menu item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast({
        title: "Order updated",
        description: `Order status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error updating order",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-8 overflow-x-auto">
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'outline'}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </Button>
        <Button
          variant={activeTab === 'orders' ? 'default' : 'outline'}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </Button>
        <Button
          variant={activeTab === 'coupons' ? 'default' : 'outline'}
          onClick={() => setActiveTab('coupons')}
        >
          Coupons
        </Button>
        <Button
          variant={activeTab === 'restaurants' ? 'default' : 'outline'}
          onClick={() => setActiveTab('restaurants')}
        >
          Restaurants
        </Button>
        <Button
          variant={activeTab === 'menu' ? 'default' : 'outline'}
          onClick={() => setActiveTab('menu')}
        >
          Menu Items
        </Button>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-orange-500">{analytics.totalRestaurants}</h3>
            <p className="text-gray-600">Total Restaurants</p>
          </Card>
          <Card className="p-6 text-center">
            <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-blue-500">{analytics.totalMenuItems}</h3>
            <p className="text-gray-600">Total Menu Items</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="text-2xl font-bold text-green-500">{analytics.totalCoupons}</h3>
            <p className="text-gray-600">Total Coupons</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="text-2xl font-bold text-purple-500">{analytics.activeCoupons}</h3>
            <p className="text-gray-600">Active Coupons</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="text-2xl font-bold text-indigo-500">{analytics.totalOrders}</h3>
            <p className="text-gray-600">Total Orders</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="text-2xl font-bold text-pink-500">₹{analytics.totalRevenue}</h3>
            <p className="text-gray-600">Total Revenue</p>
          </Card>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-600">Address: {order.deliveryAddress}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">₹{order.totalAmount}</p>
                    <p className="text-sm text-gray-600">{order.items.length} items</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-center text-gray-500 py-8">No orders found</p>
            )}
          </div>
        </Card>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <>
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Coupon</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Coupon Code"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Discount Amount"
                value={newCoupon.discount}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
              />
              <select
                value={newCoupon.type}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, type: e.target.value as 'fixed' | 'percentage' }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="fixed">Fixed Amount</option>
                <option value="percentage">Percentage</option>
              </select>
              <Input
                type="date"
                value={newCoupon.expiresAt}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, expiresAt: e.target.value }))}
              />
            </div>
            <Button onClick={handleCreateCoupon} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create Coupon
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Existing Coupons</h2>
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{coupon.code}</h3>
                    <p className="text-gray-600">
                      {coupon.type === 'fixed' ? '₹' : ''}{coupon.discount}{coupon.type === 'percentage' ? '%' : ''} off
                    </p>
                    <p className="text-sm text-gray-500">Expires: {new Date(coupon.expiresAt).toLocaleDateString()}</p>
                    {coupon.usageLimit && (
                      <p className="text-sm text-gray-500">Used: {coupon.usedCount || 0}/{coupon.usageLimit}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={coupon.isActive ? "default" : "secondary"}
                      size="sm"
                      onClick={() => toggleCouponStatus(coupon._id)}
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCoupon(coupon._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Restaurants Tab */}
      {activeTab === 'restaurants' && (
        <>
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Restaurant</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Restaurant Name"
                value={newRestaurant.name}
                onChange={(e) => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Cuisine Type"
                value={newRestaurant.cuisine}
                onChange={(e) => setNewRestaurant(prev => ({ ...prev, cuisine: e.target.value }))}
              />
              <Input
                placeholder="Image URL"
                value={newRestaurant.image}
                onChange={(e) => setNewRestaurant(prev => ({ ...prev, image: e.target.value }))}
              />
              <Input
                placeholder="Delivery Time (e.g., 25-30 min)"
                value={newRestaurant.deliveryTime}
                onChange={(e) => setNewRestaurant(prev => ({ ...prev, deliveryTime: e.target.value }))}
              />
            </div>
            <Button onClick={handleCreateRestaurant} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create Restaurant
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Existing Restaurants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map((restaurant) => (
                <Card key={restaurant._id} className="overflow-hidden">
                  <img 
                    src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'} 
                    alt={restaurant.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                    <p className="text-gray-600">{restaurant.cuisine}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{restaurant.rating}</span>
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{restaurant.deliveryTime}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteRestaurant(restaurant._id)}
                      className="mt-2 w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Menu Items Tab */}
      {activeTab === 'menu' && (
        <>
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Menu Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Item Name"
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Price"
                value={newMenuItem.price}
                onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
              />
              <select
                value={newMenuItem.restaurant}
                onChange={(e) => setNewMenuItem(prev => ({ ...prev, restaurant: e.target.value }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Select Restaurant</option>
                {restaurants.map(restaurant => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Category"
                value={newMenuItem.category}
                onChange={(e) => setNewMenuItem(prev => ({ ...prev, category: e.target.value }))}
              />
              <Input
                placeholder="Image URL"
                value={newMenuItem.image}
                onChange={(e) => setNewMenuItem(prev => ({ ...prev, image: e.target.value }))}
              />
              <Textarea
                placeholder="Description"
                value={newMenuItem.description}
                onChange={(e) => setNewMenuItem(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <Button onClick={handleCreateMenuItem} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create Menu Item
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Existing Menu Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <Card key={item._id} className="overflow-hidden">
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'} 
                    alt={item.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.restaurant.name}</p>
                    <p className="text-orange-500 font-semibold">₹{item.price}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteMenuItem(item._id)}
                      className="mt-2 w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
