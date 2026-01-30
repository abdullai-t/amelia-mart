"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";
import { formatDate, formatPrice } from "@/utils/helpers";
import { toast } from "sonner";

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string | Date;
  customer: {
    name: string;
  };
}

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  image: string;
}

interface Customer {
  id: string;
}

export default function AdminDashboard() {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, productsResponse, customersResponse] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
        fetch("/api/customers"),
      ]);

      if (!ordersResponse.ok || !productsResponse.ok || !customersResponse.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const [ordersData, productsData, customersData] = await Promise.all([
        ordersResponse.json(),
        productsResponse.json(),
        customersResponse.json(),
      ]);

      setOrders(ordersData);
      setProducts(productsData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCustomers: customers.length,
  };

  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products.filter((product) => product.stock < 20).slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to {settings?.storeName || "Amelia Mart"} Admin Portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Users className="text-amber-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
                  <p className="text-gray-600 text-sm">Loading orders...</p>
                </div>
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-sm text-gray-600">No recent orders yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.customer?.name || "Guest"}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Low Stock Alert</h2>
              <Link href="/admin/products">
                <Button variant="ghost" size="sm">Manage Stock</Button>
              </Link>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
                  <p className="text-gray-600 text-sm">Loading products...</p>
                </div>
              </div>
            ) : lowStockProducts.length === 0 ? (
              <p className="text-sm text-gray-600">No low stock items.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{product.image}</div>
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${product.stock < 10 ? "text-red-600" : "text-orange-600"}`}>
                        {product.stock} left
                      </p>
                      <p className="text-xs text-gray-500">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
