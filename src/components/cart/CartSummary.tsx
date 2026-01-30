import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/helpers";
import Link from "next/link";

interface CartSummaryProps {
  totalPrice: number;
  totalItems: number;
  itemCount: number;
}

export default function CartSummary({
  totalPrice,
  totalItems,
  itemCount,
}: CartSummaryProps) {
  // Calculate taxes and shipping for Ghana
  const taxes = Math.round(totalPrice * 0.025); // 2.5% tax for Ghana
  const shipping = totalPrice > 100 ? 0 : 10; // Free shipping above GHS 100
  const finalTotal = totalPrice + taxes + shipping;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 h-fit">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Order Summary</h2>

      <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal ({itemCount} items)</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Taxes (2.5%)</span>
          <span>{formatPrice(taxes)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
            {shipping === 0 ? "Free!" : formatPrice(shipping)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-bold text-gray-800">Total Amount</span>
        <span className="text-2xl font-bold text-green-600">
          {formatPrice(finalTotal)}
        </span>
      </div>

      <Link href="/checkout" className="w-full">
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6">
          Proceed to Checkout
        </Button>
      </Link>

      <Link href="/products" className="w-full mt-3">
        <Button variant="outline" className="w-full">
          Continue Shopping
        </Button>
      </Link>

      <div className="mt-6 p-3 bg-green-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💳 We accept all payment methods via Paystack
        </p>
        <p className="text-xs text-gray-600 mt-2">
          📦 Order will be delivered within 3-5 business days
        </p>
      </div>
    </div>
  );
}
