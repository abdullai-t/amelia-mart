"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/product/ProductGrid";
import { categories } from "@/data/products";
import { ArrowRight, Truck, Leaf, Award } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useState, useEffect } from "react";
import { Product } from "@/types";

export default function Home() {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredProducts = products.slice(0, 9);

  return (
    <div className="w-full">
      {/* Hero Section with Banner */}
      <section 
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, ${settings?.primaryColor} 0%, ${settings?.secondaryColor} 50%, ${settings?.accentColor} 100%)`
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 text-8xl opacity-20 animate-bounce">🥕</div>
        <div className="absolute bottom-20 left-20 text-6xl opacity-20 animate-pulse">🍎</div>
        <div className="absolute top-1/2 right-1/4 text-7xl opacity-10">🥬</div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-amber-400 text-white px-4 py-2 rounded-full text-sm font-bold">
                  🎉 Welcome to {settings?.storeName || "Amelia Mart"}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Fresh Groceries
                <span className="block text-amber-300">Delivered to You</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Shop the finest selection of fresh vegetables, fruits, groceries, and household items. Quality products, unbeatable prices, and fast delivery across Ghana.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/products">
                  <Button size="lg" className="bg-white text-white hover:opacity-90 font-bold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all" style={{ backgroundColor: settings?.accentColor }}>
                    🛒 Start Shopping
                    <ArrowRight className="ml-2" size={24} />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 font-semibold text-lg px-8 py-6">
                    Learn More About Us
                  </Button>
                </Link>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold text-amber-300">500+</div>
                  <div className="text-sm text-white/80">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-300">36+</div>
                  <div className="text-sm text-white/80">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-300">24/7</div>
                  <div className="text-sm text-white/80">Support</div>
                </div>
              </div>
            </div>
            
            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center hover:bg-white/30 transition-all cursor-pointer">
                    <div className="text-6xl mb-2">🥗</div>
                    <div className="text-sm font-semibold">Fresh Veggies</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center hover:bg-white/30 transition-all cursor-pointer">
                    <div className="text-6xl mb-2">🍇</div>
                    <div className="text-sm font-semibold">Juicy Fruits</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center hover:bg-white/30 transition-all cursor-pointer">
                    <div className="text-6xl mb-2">🍞</div>
                    <div className="text-sm font-semibold">Daily Groceries</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center hover:bg-white/30 transition-all cursor-pointer">
                    <div className="text-6xl mb-2">🧃</div>
                    <div className="text-sm font-semibold">Beverages</div>
                  </div>
                </div>
                
                {/* Special Offer Badge */}
                <div className="absolute -top-4 -right-4 text-white rounded-full w-24 h-24 flex items-center justify-center shadow-lg transform rotate-12 animate-pulse" style={{ backgroundColor: settings?.accentColor }}>
                  <div className="text-center">
                    <div className="text-xs font-bold">SAVE UP TO</div>
                    <div className="text-2xl font-extrabold">20%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white"
                style={{ backgroundColor: `${settings?.primaryColor}20` }}
              >
                <Leaf style={{ color: settings?.primaryColor }} size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">100% Fresh</h3>
              <p className="text-gray-600">
                All our products are handpicked and delivered fresh to your door
              </p>
            </div>
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white"
                style={{ backgroundColor: `${settings?.secondaryColor}20` }}
              >
                <Truck style={{ color: settings?.secondaryColor }} size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick delivery within 3-5 business days to your location
              </p>
            </div>
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white"
                style={{ backgroundColor: `${settings?.accentColor}20` }}
              >
                <Award style={{ color: settings?.accentColor }} size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Competitive prices with quality guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 max-w-2xl">
                Check out our best-selling items this week
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>

          <ProductGrid products={featuredProducts} isLoading={loading} />
        </div>
      </section>

    </div>
  );
}

function getCategoryEmoji(categoryId: string): string {
  const emojiMap: { [key: string]: string } = {
    groceries: "🌾",
    vegetables: "🥕",
    fruits: "🍎",
    beverages: "🥤",
    snacks: "🍿",
    household: "🧼",
  };
  return emojiMap[categoryId] || "🛒";
}
