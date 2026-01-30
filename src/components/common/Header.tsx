"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/useCart";
import { useSettings } from "@/hooks/useSettings";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const { getTotalItems } = useCartStore();
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Avoid hydration mismatch by only showing cart count after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm" style={{ borderColor: `${settings?.primaryColor}20` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
                style={{ backgroundColor: settings?.primaryColor }}
              >
                <span className="text-2xl font-bold text-white">A</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                <span className="text-xs">🛒</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: settings?.primaryColor }}>
                {settings?.storeName || "Amelia Mart"}
              </h1>
              <p className="text-xs text-gray-600 font-medium">Fresh & Quality Products</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`transition-colors ${
                isActive("/")
                  ? "font-semibold"
                  : "text-gray-700"
              }`}
              style={{
                color: isActive("/") ? settings?.primaryColor : undefined,
              }}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`transition-colors ${
                isActive("/products")
                  ? "font-semibold"
                  : "text-gray-700"
              }`}
              style={{
                color: isActive("/products") ? settings?.primaryColor : undefined,
              }}
            >
              Products
            </Link>
            <Link
              href="/about"
              className={`transition-colors ${
                isActive("/about")
                  ? "font-semibold"
                  : "text-gray-700"
              }`}
              style={{
                color: isActive("/about") ? settings?.primaryColor : undefined,
              }}
            >
              About
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-xs mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                style={{
                  borderColor: settings?.primaryColor,
                }}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:opacity-70 transition-opacity"
                style={{
                  color: settings?.primaryColor,
                }}
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Cart Button */}
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4" style={{ borderColor: `${settings?.primaryColor}20` }}>
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                  style={{
                    borderColor: settings?.primaryColor,
                  }}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  style={{
                    color: settings?.primaryColor,
                  }}
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className={`transition-colors ${
                  isActive("/")
                    ? "font-semibold"
                    : "text-gray-700"
                }`}
                style={{
                  color: isActive("/") ? settings?.primaryColor : undefined,
                }}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`transition-colors ${
                  isActive("/products")
                    ? "font-semibold"
                    : "text-gray-700"
                }`}
                style={{
                  color: isActive("/products") ? settings?.primaryColor : undefined,
                }}
              >
                Products
              </Link>
              <Link
                href="/about"
                className={`transition-colors ${
                  isActive("/about")
                    ? "font-semibold"
                    : "text-gray-700"
                }`}
                style={{
                  color: isActive("/about") ? settings?.primaryColor : undefined,
                }}
              >
                About
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
