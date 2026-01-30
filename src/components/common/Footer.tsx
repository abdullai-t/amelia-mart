"use client";

import { useSettings } from "@/hooks/useSettings";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-900 text-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">{settings?.storeName?.[0] || "A"}</span>
              </div>
              <h3 className="text-white font-bold text-lg">{settings?.storeName || "Amelia Mart"}</h3>
            </div>
            <p className="text-sm text-gray-400">
              Ghana's trusted online grocery store. Fresh products, quality service, and fast delivery across Ghana.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="/" className="hover:text-green-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-green-400 transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-green-400 transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-4">Categories</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a
                  href="/products/groceries"
                  className="hover:text-green-400 transition-colors"
                >
                  Groceries
                </a>
              </li>
              <li>
                <a
                  href="/products/vegetables"
                  className="hover:text-green-400 transition-colors"
                >
                  Vegetables
                </a>
              </li>
              <li>
                <a
                  href="/products/fruits"
                  className="hover:text-green-400 transition-colors"
                >
                  Fruits
                </a>
              </li>
              <li>
                <a
                  href="/products/beverages"
                  className="hover:text-green-400 transition-colors"
                >
                  Beverages
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="text-sm space-y-2 text-gray-400">
              <li>📍 {settings?.storeAddress || "Main Street, Local Market, City"}</li>
              <li>📱 {settings?.storePhone || "+1 (555) 123-4567"}</li>
              <li>✉️ {settings?.storeEmail || "info@localmarket.com"}</li>
              <li>⏰ Mon-Sat: 8AM - 8PM</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="hover:text-green-400 transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-green-400 transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-green-400 transition-colors">
              WhatsApp
            </a>
            <a href="#" className="hover:text-green-400 transition-colors">
              Twitter
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-400">
            <p>
              &copy; {currentYear} {settings?.storeName || "Local Market"}. All rights reserved.
            </p>
            <p className="mt-2">
              Designed with ❤️ for our community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
