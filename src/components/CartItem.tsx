
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    restaurant: string;
    price: number;
    quantity: number;
    image: string;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center space-x-4 p-4 border-b">
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
  );
};

export default CartItem;
