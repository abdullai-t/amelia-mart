"use client";

import { useState } from "react";
import { getProductById, getProductsByCategory } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/useCart";
import { formatPrice } from "@/utils/helpers";
import ProductCard from "@/components/product/ProductCard";
import { Heart, ShoppingCart, Minus, Plus, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getOptimizedImageUrl, isEmoji } from "@/utils/cloudinary";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
        <a href="/products" className="text-green-600 hover:underline">
          Back to products →
        </a>
      </div>
    );
  }

  const relatedProducts = getProductsByCategory(product.category).filter(
    (p) => p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <a href="/" className="hover:text-green-600">Home</a>
        <ChevronRight size={16} />
        <a href="/products" className="hover:text-green-600">Products</a>
        <ChevronRight size={16} />
        <span className="text-gray-800 font-semibold">{product.name}</span>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center h-96">
          {isEmoji(product.image) ? (
            <span className="text-8xl">{product.image}</span>
          ) : (
            <img
              src={getOptimizedImageUrl(product.image, 600, 600)}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {product.category}
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <span className="text-lg">⭐</span>
                  <span className="font-semibold text-gray-800">{product.rating}</span>
                  {product.reviews && (
                    <span className="text-gray-600">({product.reviews} reviews)</span>
                  )}
                </div>
              </div>
            )}

            <p className="text-gray-600 text-lg mb-6">
              {product.description}
            </p>
          </div>

          {/* Price and Stock */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Price per {product.unit}</p>
                <p className="text-4xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-2">Stock Available</p>
                <p className={`text-2xl font-bold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} units` : "Out of Stock"}
                </p>
              </div>
            </div>

            {product.stock > 10 && (
              <p className="text-sm text-green-600 font-semibold">✓ In stock - Free delivery above ₹500</p>
            )}
            {product.stock > 0 && product.stock <= 10 && (
              <p className="text-sm text-orange-600 font-semibold">⚠ Only {product.stock} units left</p>
            )}
          </div>

          {/* Quantity Selector and Add to Cart */}
          {product.stock > 0 && <ProductActions product={product} />}

          {/* Features */}
          <div className="mt-8 space-y-3">
            <h3 className="text-lg font-bold text-gray-800">Product Details</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Fresh and high quality</li>
              <li>✓ Sourced from trusted suppliers</li>
              <li>✓ Delivered in 3-5 business days</li>
              <li>✓ 100% satisfaction guaranteed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductActions({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addItem(product, quantity);
      toast.success(`${product.name} added to cart!`);
      setIsAdding(false);
      setQuantity(1);
    }, 300);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-gray-700 font-semibold">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-gray-100"
          >
            <Minus size={18} />
          </button>
          <span className="px-4 py-2 font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 hover:bg-gray-100"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-lg py-6 gap-2"
        >
          <ShoppingCart size={20} />
          {isAdding ? "Adding..." : "Add to Cart"}
        </Button>
        <Button variant="outline" size="lg" className="px-6">
          <Heart size={20} />
        </Button>
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
