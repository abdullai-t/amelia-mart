import { Order } from "@/types";
import { formatPrice, formatDate } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

interface OrderConfirmationProps {
  order: Order;
}

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  return (
    <div className="max-w-2xl">
      {/* Success Message */}
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your order. We've sent a confirmation email with all the details.
        </p>
        <p className="text-lg font-bold text-green-600 mb-2">Order ID: {order.id}</p>
        <p className="text-sm text-gray-600">
          Please save this order ID for future reference.
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600">Order Date</p>
            <p className="font-semibold text-gray-800">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold text-gray-800 capitalize">{order.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estimated Delivery</p>
            <p className="font-semibold text-gray-800">
              {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "Within 3-5 days"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="font-bold text-green-600 text-lg">
              {formatPrice(order.totalPrice)}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Address</h2>

        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">
              {order.customer.firstName} {order.customer.lastName}
            </span>
          </p>
          <p>{order.customer.address}</p>
          <p>
            {order.customer.city} - {order.customer.zipCode}
          </p>
          <p className="text-sm text-gray-600">Phone: {order.customer.phone}</p>
          <p className="text-sm text-gray-600">Email: {order.customer.email}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} {item.unit}
                </p>
              </div>
              <p className="font-semibold text-gray-800">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link href="/products" className="flex-1">
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Continue Shopping
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full">
            Back to Home
          </Button>
        </Link>
      </div>

      {/* WhatsApp Integration Note */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-gray-700 mb-4">
          💬 Would you like to track your order on WhatsApp?
        </p>
        <a
          href={`https://wa.me/9876543210?text=I want to track my order ${order.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          💬 Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
