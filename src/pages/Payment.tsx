
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { paymentAPI, ordersAPI } from '@/services/api';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { 
    cartItems, 
    getCartTotal, 
    clearCart, 
    appliedCoupon, 
    getDiscountAmount,
    getFinalTotal 
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 299 ? 0 : 50;
  const discount = getDiscountAmount();
  const taxes = Math.round(subtotal * 0.05); // 5% tax
  const total = getFinalTotal() + taxes; // Add taxes to final total

  const handlePayment = async () => {
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your delivery address",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'stripe') {
        // Prepare order items for Stripe
        const orderItems = cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }));

        // Create Stripe payment session
        const paymentResponse = await paymentAPI.createSession({
          items: orderItems,
          totalAmount: total,
          deliveryAddress: address,
          appliedCoupon: appliedCoupon
        });

        if (paymentResponse.url) {
          // Redirect to Stripe checkout
          window.location.href = paymentResponse.url;
        } else {
          throw new Error('Failed to create payment session');
        }
      } else if (paymentMethod === 'cod') {
        // Handle Cash on Delivery
        const orderData = {
          items: cartItems.map(item => ({
            menuItem: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: total,
          deliveryAddress: address,
          paymentMethod: 'cod',
          appliedCoupon: appliedCoupon
        };

        await ordersAPI.create(orderData);
        clearCart();
        
        toast({
          title: "Order Placed Successfully!",
          description: "Your food will be delivered in 25-30 minutes.",
        });
        navigate('/payment-success');
      } else {
        // Handle UPI or other payment methods
        toast({
          title: "Payment Method",
          description: "This payment method will be available soon",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before proceeding to payment</p>
          <Button onClick={() => navigate('/menu')} className="btn-primary">
            Browse Menu
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Complete Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Details */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                Delivery Address
              </h3>
              <Input
                placeholder="Enter your complete address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mb-4"
              />
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Estimated delivery: 25-30 minutes
                </p>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-orange-500" />
                Payment Method
              </h3>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        <span className="font-medium">Credit/Debit Card (Stripe)</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">Secure payment via Stripe</p>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      <div className="flex items-center">
                        <Wallet className="w-5 h-5 mr-2" />
                        <span className="font-medium">UPI Payment</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">Pay using PhonePe, Google Pay, Paytm</p>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center">
                        <span className="w-5 h-5 mr-2 text-center">💵</span>
                        <span className="font-medium">Cash on Delivery</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">Pay when your order arrives</p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Bill Breakdown */}
              <div className="space-y-2 mb-6 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {appliedCoupon && discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Charges</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>Total Amount</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* User Info */}
              {user && (
                <div className="bg-gray-50 p-3 rounded-lg mb-6">
                  <p className="text-sm font-medium">Ordering as:</p>
                  <p className="text-sm text-gray-600">{user.name} ({user.email})</p>
                </div>
              )}

              {/* Payment Button */}
              <Button 
                onClick={handlePayment}
                disabled={!address || isProcessing}
                className="w-full btn-primary text-lg py-3"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Pay ₹${total}`
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing this order, you agree to our Terms & Conditions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
