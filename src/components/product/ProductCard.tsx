"use client";

import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/useCart";
import { ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/utils/helpers";
import { getOptimizedImageUrl, isEmoji } from "@/utils/cloudinary";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addItem(product, 1);
      toast.success(`${product.name} added to cart!`);
      setIsAdding(false);
    }, 300);
  };

  const stockStatus = product.stock > 10 ? "in-stock" : product.stock > 0 ? "low-stock" : "out-of-stock";

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <Link href={`/product/${product.id}`} className="relative overflow-hidden bg-gray-100 h-48 sm:h-56">
        <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          {isEmoji(product.image) ? (
            <span className="text-5xl">{product.image}</span>
          ) : (
            <img
              src={getOptimizedImageUrl(product.image, 400, 400)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {stockStatus === "out-of-stock" && (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
              Out of Stock
            </span>
          )}
          {stockStatus === "low-stock" && (
            <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
              Only {product.stock} left
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/product/${product.id}`} className="hover:text-green-600 transition-colors">
          <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
            <span>⭐ {product.rating}</span>
            {product.reviews && <span>({product.reviews})</span>}
          </div>
        )}

        <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
          {product.description}
        </p>

        {/* Price and Unit */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-green-600">
            {formatPrice(product.price)}
          </p>
          <p className="text-sm text-gray-500">per {product.unit}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
            size="sm"
          >
            <ShoppingCart size={16} />
            {isAdding ? "Adding..." : "Add"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFavorited(!isFavorited)}
            className={isFavorited ? "text-red-500 border-red-200" : ""}
          >
            <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function getProductEmoji(category: string): string {
  const emojiMap: { [key: string]: string } = {
    groceries: "🌾",
    vegetables: "🥕",
    fruits: "🍎",
    beverages: "🥤",
    snacks: "🍿",
    household: "🧼",
  };
  return emojiMap[category] || "🛒";
}
