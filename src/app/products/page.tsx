"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CategorySidebar from "@/components/product/CategorySidebar";
import ProductGrid from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { useSettings } from "@/hooks/useSettings";
import { Search } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high" | "newest">("name");
  const [searchInput, setSearchInput] = useState(search);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
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

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (searchInput) {
      const query = searchInput.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (category) {
      result = result.filter((p) => p.category === category);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.reverse();
        break;
      case "name":
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchInput, category, sortBy, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useMemo above
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Shop All Products
        </h1>
        <p className="text-gray-600">
          Browse our complete selection of fresh groceries and household items
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors"
            style={{
              borderColor: settings?.primaryColor || '#16a34a',
            }}
            onFocus={(e) => e.target.style.borderColor = settings?.secondaryColor || '#059669'}
            onBlur={(e) => e.target.style.borderColor = settings?.primaryColor || '#16a34a'}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: settings?.primaryColor || '#16a34a' }}
          >
            <Search size={20} />
          </button>
        </div>
      </form>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <CategorySidebar />
        </aside>

        {/* Products */}
        <main className="md:col-span-3">
          {/* Sort Options */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Found <span className="font-bold text-gray-800">{filteredProducts.length}</span> products
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-lg border focus:outline-none transition-colors"
              style={{ borderColor: settings?.primaryColor || '#16a34a' }}
            >
              <option value="name">Sort: A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} isLoading={loading} />
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div className="text-center">Loading products...</div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
