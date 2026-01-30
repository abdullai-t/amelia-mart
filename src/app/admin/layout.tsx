"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Tag,
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { settings } = useSettings();
  const { logout, isAuthenticated, loading } = useAuth();

  // Don't show admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (AuthContext will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Tag },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Top Navigation */}
      <header 
        className="shadow-sm border-b sticky top-0 z-50"
        style={{ backgroundColor: '#ffffff', borderColor: `${settings?.primaryColor}20` }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ color: settings?.primaryColor }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              className="lg:hidden"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: settings?.primaryColor }}
              >
                {settings?.storeName?.[0] || "A"}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">{settings?.storeName || "Amelia Mart"}</h1>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                View Store
              </Button>
            </Link>
            <Button 
              onClick={logout}
              variant="ghost" 
              size="sm"
              style={{ color: '#dc2626' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fee2e2';
                e.currentTarget.style.color = '#991b1b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#dc2626';
              }}
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out mt-[57px] lg:mt-0`}
        >
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                      active
                        ? "text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    style={{
                      backgroundColor: active ? settings?.primaryColor : 'transparent',
                      color: active ? 'white' : '#374151',
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/10 backdrop-blur-sm z-30 mt-[57px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
