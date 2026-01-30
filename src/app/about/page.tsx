"use client";

import { Button } from "@/components/ui/button";
import { Heart, Users, Award, Globe } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";

export default function AboutPage() {
  const { settings } = useSettings();
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{settings?.storeName?.[0] || "A"}</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About {settings?.storeName || "Amelia Mart"}</h1>
          <p className="text-xl text-green-50 max-w-2xl mx-auto">
            Ghana's trusted online grocery store - Connecting you with fresh, quality products
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                {settings?.storeName || "Amelia Mart"} was founded with a simple mission: to make fresh, quality groceries accessible to everyone across Ghana. We believe that everyone deserves access to fresh produce and household items without compromising on quality or price.
              </p>
              <p className="text-gray-600 text-lg mb-4">
                Starting as a small neighborhood shop in Accra, we've grown into a trusted online platform that serves hundreds of families every month across Ghana. We work directly with local farmers and trusted suppliers to bring you the best products at competitive prices.
              </p>
              <p className="text-gray-600 text-lg">
                Today, we're proud to say that {settings?.storeName || "Amelia Mart"} is more than just a shop - it's a community of people who care about quality, freshness, and supporting local Ghanaian businesses.
              </p>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-100 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-2">🥬</div>
                  <div className="text-sm font-semibold text-gray-700">Fresh Produce</div>
                </div>
                <div className="bg-amber-100 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-2">🛒</div>
                  <div className="text-sm font-semibold text-gray-700">Easy Shopping</div>
                </div>
                <div className="bg-blue-100 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-2">🚚</div>
                  <div className="text-sm font-semibold text-gray-700">Fast Delivery</div>
                </div>
                <div className="bg-purple-100 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-2">💝</div>
                  <div className="text-sm font-semibold text-gray-700">Quality Service</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Care</h3>
              <p className="text-gray-600">
                We care about the quality of every product we deliver to your home
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600">
                We support local farmers and suppliers, strengthening our community
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Quality</h3>
              <p className="text-gray-600">
                Highest quality products at competitive prices
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Globe className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Committed to sustainable practices and eco-friendly operations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-green-600 mb-2">500+</p>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600 mb-2">30+</p>
              <p className="text-gray-600">Product Categories</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600 mb-2">100%</p>
              <p className="text-gray-600">Fresh Products</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600 mb-2">5 Days</p>
              <p className="text-gray-600">Average Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Rahul Singh", role: "Founder & CEO", emoji: "👨‍💼" },
              { name: "Priya Sharma", role: "Operations Manager", emoji: "👩‍💼" },
              { name: "Amit Patel", role: "Supply Chain Lead", emoji: "👨‍🔧" },
            ].map((member) => (
              <div key={member.name} className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-green-600 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Have questions or suggestions? We'd love to hear from you!
          </p>

          <div className="space-y-4 mb-8 text-green-50">
            <p>📍 Main Street, Local Market, City</p>
            <p>📱 +1 (555) 123-4567</p>
            <p>✉️ info@localmarket.com</p>
            <p>⏰ Mon-Sat: 8AM - 8PM</p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products">
              <Button className="bg-white text-green-600 hover:bg-gray-100">
                Shop Now
              </Button>
            </Link>
            <a href="https://wa.me/9876543210" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
