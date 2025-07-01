import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { couponsAPI } from '@/services/api';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    appliedCoupon, 
    setAppliedCoupon, 
    getDiscountAmount,
    getFinalTotal 
  } = useCart();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }
    
    setCouponLoading(true);
    try {
      console.log('Applying coupon:', couponCode);
      const response = await couponsAPI.validate(couponCode.trim());
      console.log('Coupon validation response:', response);
      
      if (response.valid && response.coupon) {
        setAppliedCoupon({
          code: response.coupon.code,
          discount: response.coupon.discount,
          type: response.coupon.type
        });
        setCouponCode('');
        toast({
          title: "Coupon applied!",
          description: `${response.coupon.code} coupon applied successfully. You saved ₹${response.coupon.type === 'percentage' ? Math.floor((getCartTotal() * response.coupon.discount) / 100) : response.coupon.discount}!`,
        });
      } else {
        throw new Error('Invalid coupon response');
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      toast({
        title: "Invalid coupon",
        description: error.message || "Please enter a valid coupon code",
        variant: "destructive"
      });
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast({
      title: "Coupon removed",
      description: "Coupon has been removed from your order",
    });
  };

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 299 ? 0 : 50;
  const discount = getDiscountAmount();
  const total = getFinalTotal();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" 
            alt="Empty Cart" 
            className="w-64 h-48 mx-auto mb-6 rounded-lg"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet</p>
          <Link to="/menu">
            <Button className="btn-primary">Browse Menu</Button>
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
          <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.restaurant}</p>
                    <p className="text-orange-500 font-semibold">₹{item.price}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              
              {/* Coupon Section */}
              <div className="mb-6">
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponLoading}
                    onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                  />
                  <Button 
                    onClick={applyCoupon} 
                    variant="outline"
                    disabled={couponLoading || !couponCode.trim()}
                  >
                    {couponLoading ? 'Applying...' : 'Apply'}
                  </Button>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                    <p className="text-green-600 text-sm">
                      ✓ Coupon "{appliedCoupon.code}" applied!
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              {/* Bill Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-orange-50 p-3 rounded-lg mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Delivery Time:</strong> 25-30 minutes
                </p>
              </div>

              <Link to="/payment">
                <Button className="w-full btn-primary text-lg py-3">
                  Proceed to Payment
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
