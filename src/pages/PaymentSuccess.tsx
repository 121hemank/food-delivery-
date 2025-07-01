
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';

const PaymentSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart after successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="p-8 text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your payment has been processed successfully and your food will be prepared shortly.
          </p>
          
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-green-800">
              <strong>Estimated Delivery:</strong> 25-30 minutes
            </p>
            <p className="text-sm text-green-800">
              <strong>Order ID:</strong> #HK{Date.now().toString().slice(-6)}
            </p>
          </div>
          
          <div className="space-y-3">
            <Link to="/" className="block">
              <Button className="w-full btn-primary">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <Link to="/menu" className="block">
              <Button variant="outline" className="w-full">
                <Receipt className="w-4 h-4 mr-2" />
                Order More Food
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
