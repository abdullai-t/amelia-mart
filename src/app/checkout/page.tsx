"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/hooks/useCart";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <ShoppingCart className="w-20 h-20 mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 text-lg mb-8">
            Add items to your cart before checking out
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

  const handleSubmit = async (formData: any) => {
    setIsProcessing(true);
    
    try {
      const subtotal = getTotalPrice();
      const shipping = subtotal >= 100 ? 0 : 10;
      const tax = (subtotal * 2.5) / 100;
      const total = subtotal + shipping + tax;

      // Create order first
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
          },
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          tax,
          shipping,
          total,
          paymentMethod: 'paystack',
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
          notes: '',
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const order = await orderResponse.json();

      // Initialize Paystack payment
      const paymentResponse = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          amount: total,
          orderId: order.orderNumber,
          metadata: {
            customerName: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            itemsCount: items.length,
          },
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentData.status) {
        throw new Error(paymentData.message || 'Payment initialization failed');
      }

      // Clear cart before redirecting
      clearCart();

      // Redirect to Paystack payment page
      window.location.href = paymentData.data.authorizationUrl;

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process checkout');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Checkout</h1>
        <p className="text-gray-600">Complete your order</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-8">
            <CheckoutForm onSubmit={handleSubmit} isLoading={isProcessing} />
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <OrderSummary items={items} totalPrice={getTotalPrice()} />
        </div>
      </div>
    </div>
  );
}
