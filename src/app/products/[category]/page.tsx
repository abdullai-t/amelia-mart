"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CategorySidebar from "@/components/product/CategorySidebar";
import ProductGrid from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/products";
import { Product } from "@/types";
import { ChevronRight } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categoryData = categories.find((c) => c.id === category);

  useEffect(() => {
    if (category) {
      fetchCategoryProducts();
    }
  }, [category]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?category=${category}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!categoryData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Category not found</h1>
        <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
        <a href="/products" className="text-green-600 hover:underline">
          Back to all products →
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <a href="/" className="hover:text-green-600">Home</a>
        <ChevronRight size={16} />
        <a href="/products" className="hover:text-green-600">Products</a>
        <ChevronRight size={16} />
        <span className="text-gray-800 font-semibold">{categoryData.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {categoryData.name}
        </h1>
        <p className="text-gray-600 text-lg">
          {categoryData.description}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <CategorySidebar />
        </aside>

        {/* Products */}
        <main className="md:col-span-3">
          <div className="mb-6">
            <p className="text-gray-600">
              Found <span className="font-bold text-gray-800">{products.length}</span> products
            </p>
          </div>
          <ProductGrid products={products} isLoading={loading} />
        </main>
      </div>
    </div>
  );
}
