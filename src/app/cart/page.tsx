"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCart";
import CartItemComponent from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { items, getTotalPrice, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <ShoppingCart className="w-20 h-20 mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 text-lg mb-8">
            Start shopping to add items to your cart
          </p>
          <Link href="/products">
            <Button className="bg-green-600 hover:bg-green-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
        <p className="text-gray-600">
          You have <span className="font-bold">{totalItems}</span> items in your cart
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemComponent key={item.productId} item={item} />
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-8">
            <Link href="/products">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            totalPrice={totalPrice}
            totalItems={totalItems}
            itemCount={items.length}
          />
        </div>
      </div>
    </div>
  );
}
