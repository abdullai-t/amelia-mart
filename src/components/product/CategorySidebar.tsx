"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { categories } from "@/data/products";
import { useSettings } from "@/hooks/useSettings";

interface CategorySidebarProps {
  onCategoryChange?: (category: string) => void;
}

export default function CategorySidebar({
  onCategoryChange,
}: CategorySidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { settings } = useSettings();
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
        className="block px-4 py-2 rounded-lg mb-2 transition-colors text-white font-semibold"
        style={{
          backgroundColor: pathname === "/products" && !category 
            ? (settings?.primaryColor || '#16a34a') 
            : 'transparent',
          color: pathname === "/products" && !category ? 'white' : '#374151',
        }}
        onMouseEnter={(e) => {
          if (pathname !== "/products" || category) {
            e.currentTarget.style.backgroundColor = `${settings?.primaryColor || '#16a34a'}20`;
          }
        }}
        onMouseLeave={(e) => {
          if (pathname !== "/products" || category) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
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
            className="block px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: isActive(cat.id) 
                ? (settings?.primaryColor || '#16a34a') 
                : 'transparent',
              color: isActive(cat.id) ? 'white' : '#374151',
            }}
            onMouseEnter={(e) => {
              if (!isActive(cat.id)) {
                e.currentTarget.style.backgroundColor = `${settings?.primaryColor || '#16a34a'}20`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(cat.id)) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
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
