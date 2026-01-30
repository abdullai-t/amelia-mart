import { CartItem } from "@/types";
import { formatPrice } from "@/utils/helpers";

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
}

export default function OrderSummary({ items, totalPrice }: OrderSummaryProps) {
  const taxes = Math.round(totalPrice * 0.05);
  const shipping = totalPrice > 500 ? 0 : 60;
  const finalTotal = totalPrice + taxes + shipping;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Order Summary</h2>

      {/* Items List */}
      <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm text-gray-700">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span className="font-semibold">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Taxes (5%)</span>
          <span>{formatPrice(taxes)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
            {shipping === 0 ? "Free!" : formatPrice(shipping)}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-gray-800">Total Amount</span>
        <span className="text-2xl font-bold text-green-600">
          {formatPrice(finalTotal)}
        </span>
      </div>

      {/* Info Message */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-gray-700">
          📦 Estimated delivery: 3-5 business days
        </p>
        <p className="text-sm text-gray-700 mt-2">
          💳 All major payment methods accepted
        </p>
      </div>
    </div>
  );
}
