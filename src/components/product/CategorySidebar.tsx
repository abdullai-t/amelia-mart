"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { categories } from "@/data/products";

interface CategorySidebarProps {
  onCategoryChange?: (category: string) => void;
}

export default function CategorySidebar({
  onCategoryChange,
}: CategorySidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const isActive = (catId: string) => {
    if (pathname === `/products/${catId}`) return true;
    if (pathname === "/products" && category === catId) return true;
    return false;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Categories</h2>

      {/* All Products Link */}
      <Link
        href="/products"
        className={`block px-4 py-2 rounded-lg mb-2 transition-colors ${
          pathname === "/products" && !category
            ? "bg-green-600 text-white font-semibold"
            : "text-gray-700 hover:bg-green-50"
        }`}
      >
        All Products
      </Link>

      {/* Category Links */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products/${cat.id}`}
            onClick={() => onCategoryChange?.(cat.id)}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              isActive(cat.id)
                ? "bg-green-600 text-white font-semibold"
                : "text-gray-700 hover:bg-green-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCategoryEmoji(cat.id)}</span>
              <span>{cat.name}</span>
            </div>
          </Link>
        ))}
      </div>
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
