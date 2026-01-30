"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/hooks/useCart";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import { Order } from "@/types";
import { getEstimatedDelivery } from "@/utils/helpers";
import { toast } from "sonner";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const reference = searchParams.get("reference");
  const { clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && reference) {
      verifyPayment();
    } else if (mounted && orderId) {
      fetchOrder();
    }
  }, [mounted, reference, orderId]);

  const verifyPayment = async () => {
    try {
      const response = await fetch(`/api/payment/verify?reference=${reference}`);
      const data = await response.json();

      if (data.status) {
        toast.success("Payment verified successfully!");
        setPaymentVerified(true);
        // Clear cart after successful payment
        clearCart();
        // Fetch the order details
        if (orderId) {
          fetchOrder();
        }
      } else {
        toast.error(data.message || "Payment verification failed");
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error("Failed to verify payment");
      setLoading(false);
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders`);
      const orders = await response.json();
      
      // Find the order by order number
      const foundOrder = orders.find((o: any) => o.orderNumber === orderId);
      
      if (foundOrder) {
        setOrder(foundOrder);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  if (!mounted || loading) {
    return <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{reference ? 'Verifying payment...' : 'Loading order...'}</p>
      </div>
    </div>;
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Order not found</h1>
          <p className="text-gray-600 mb-8">We couldn't find your order</p>
        </div>
      </div>
    );
  }

  // Transform database order to Order type
  const transformedOrder: Order = {
    id: order.orderNumber,
    customer: {
      firstName: order.customer.name.split(' ')[0] || '',
      lastName: order.customer.name.split(' ').slice(1).join(' ') || '',
      email: order.customer.email,
      phone: order.customer.phone,
      address: order.shippingAddress,
      city: order.customer.city || '',
      zipCode: '',
    },
    items: order.items.map((item: any) => ({
      productId: item.productId,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      unit: item.product.unit,
    })),
    totalPrice: order.total,
    status: order.status,
    createdAt: order.createdAt,
    estimatedDelivery: getEstimatedDelivery(),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {paymentVerified && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">✓ Payment confirmed successfully!</p>
        </div>
      )}
      <OrderConfirmation order={transformedOrder} />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
