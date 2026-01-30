"use client";

import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/utils/helpers";
import { useCartStore } from "@/hooks/useCart";
import { toast } from "sonner";

interface CartItemComponentProps {
  item: CartItem;
}

export default function CartItemComponent({ item }: CartItemComponentProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleRemove = () => {
    removeItem(item.productId);
    toast.success(`${item.name} removed from cart`);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(item.productId, newQuantity);
    }
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg border border-gray-200">
      {/* Product Image/Icon */}
      <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
        {getProductEmoji(item.name)}
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {formatPrice(item.price)} per {item.unit}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="h-8 w-8 p-0"
          >
            <Minus size={16} />
          </Button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="h-8 w-8 p-0"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* Price and Remove */}
      <div className="flex flex-col items-end justify-between">
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">
            {formatPrice(itemTotal)}
          </p>
          <p className="text-xs text-gray-500">
            {item.quantity} × {formatPrice(item.price)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
}

function getProductEmoji(productName: string): string {
  const keywords = productName.toLowerCase();
  
  if (keywords.includes("rice")) return "🍚";
  if (keywords.includes("flour")) return "🌾";
  if (keywords.includes("dal") || keywords.includes("lentil")) return "🫘";
  if (keywords.includes("oil")) return "🧈";
  if (keywords.includes("salt")) return "🧂";
  if (keywords.includes("tomato")) return "🍅";
  if (keywords.includes("onion")) return "🧅";
  if (keywords.includes("garlic")) return "🧄";
  if (keywords.includes("potato")) return "🥔";
  if (keywords.includes("carrot")) return "🥕";
  if (keywords.includes("pepper")) return "🫑";
  if (keywords.includes("banana")) return "🍌";
  if (keywords.includes("apple")) return "🍎";
  if (keywords.includes("orange")) return "🍊";
  if (keywords.includes("grape")) return "🍇";
  if (keywords.includes("mango")) return "🥭";
  if (keywords.includes("watermelon")) return "🍉";
  if (keywords.includes("juice")) return "🧃";
  if (keywords.includes("milk")) return "🥛";
  if (keywords.includes("yogurt")) return "🍶";
  if (keywords.includes("tea")) return "☕";
  if (keywords.includes("coffee")) return "☕";
  if (keywords.includes("snack") || keywords.includes("popcorn")) return "🍿";
  if (keywords.includes("chocolate")) return "🍫";
  if (keywords.includes("biscuit")) return "🍪";
  if (keywords.includes("soap")) return "🧼";
  if (keywords.includes("detergent")) return "🧴";
  if (keywords.includes("bleach")) return "🧪";
  if (keywords.includes("paper")) return "📄";
  if (keywords.includes("bag") || keywords.includes("trash")) return "🛍️";
  if (keywords.includes("freshener")) return "🌸";
  
  return "🛒";
}
