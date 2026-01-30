"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Store, CreditCard, Truck, Bell } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: "Amelia Mart",
    storeEmail: "info@ameliamart.com",
    storePhone: "0201234567",
    storeAddress: "123 Oxford Street, Accra, Ghana",
    
    // Payment Settings
    paystackPublicKey: "",
    paystackSecretKey: "",
    
    // Shipping Settings
    freeShippingThreshold: 100,
    shippingFee: 10,
    deliveryTime: "3-5",
    
    // Tax Settings
    taxRate: 2.5,
    
    // Notification Settings
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
  });

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      
      setSettings({
        storeName: data.storeName,
        storeEmail: data.storeEmail,
        storePhone: data.storePhone,
        storeAddress: data.storeAddress,
        paystackPublicKey: data.paystackPublicKey || "",
        paystackSecretKey: "",
        freeShippingThreshold: data.freeShippingThreshold,
        shippingFee: data.shippingFee,
        deliveryTime: data.deliveryTime.replace(' days', ''),
        taxRate: data.taxRate,
        emailNotifications: data.emailNotifications,
        orderNotifications: data.orderNotifications,
        lowStockAlerts: data.lowStockAlerts,
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: settings.storeName,
          storeEmail: settings.storeEmail,
          storePhone: settings.storePhone,
          storeAddress: settings.storeAddress,
          paystackPublicKey: settings.paystackPublicKey,
          paystackSecretKey: settings.paystackSecretKey,
          freeShippingThreshold: settings.freeShippingThreshold,
          shippingFee: settings.shippingFee,
          deliveryTime: `${settings.deliveryTime} days`,
          taxRate: settings.taxRate,
          emailNotifications: settings.emailNotifications,
          orderNotifications: settings.orderNotifications,
          lowStockAlerts: settings.lowStockAlerts,
        }),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your store configuration</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Store Information */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Store className="text-gray-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Store Information</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="storePhone">Store Phone</Label>
                <Input
                  id="storePhone"
                  value={settings.storePhone}
                  onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="storeAddress">Store Address</Label>
                <Input
                  id="storeAddress"
                  value={settings.storeAddress}
                  onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <CreditCard className="text-gray-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Payment Settings (Paystack)</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Get your Paystack API keys from{" "}
                <a
                  href="https://dashboard.paystack.com/#/settings/developer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  Paystack Dashboard
                </a>
              </p>
            </div>
            <div>
              <Label htmlFor="paystackPublicKey">Public Key</Label>
              <Input
                id="paystackPublicKey"
                type="password"
                placeholder="pk_test_xxxxxxxxxxxxx or pk_live_xxxxxxxxxxxxx"
                value={settings.paystackPublicKey}
                onChange={(e) => setSettings({ ...settings, paystackPublicKey: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="paystackSecretKey">Secret Key</Label>
              <Input
                id="paystackSecretKey"
                type="password"
                placeholder="sk_test_xxxxxxxxxxxxx or sk_live_xxxxxxxxxxxxx"
                value={settings.paystackSecretKey}
                onChange={(e) => setSettings({ ...settings, paystackSecretKey: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Shipping & Tax Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Truck className="text-gray-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Shipping & Tax</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (GHS)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  step="0.01"
                  value={settings.freeShippingThreshold}
                  onChange={(e) =>
                    setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Orders above this amount get free shipping
                </p>
              </div>
              <div>
                <Label htmlFor="shippingFee">Standard Shipping Fee (GHS)</Label>
                <Input
                  id="shippingFee"
                  type="number"
                  step="0.01"
                  value={settings.shippingFee}
                  onChange={(e) => setSettings({ ...settings, shippingFee: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="deliveryTime">Estimated Delivery Time (days)</Label>
                <Input
                  id="deliveryTime"
                  value={settings.deliveryTime}
                  onChange={(e) => setSettings({ ...settings, deliveryTime: e.target.value })}
                  placeholder="e.g., 3-5"
                />
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
                />
                <p className="text-xs text-gray-500 mt-1">Ghana standard: 2.5%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Bell className="text-gray-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email updates about your store</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    setSettings({ ...settings, emailNotifications: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Order Notifications</p>
                <p className="text-sm text-gray-600">Get notified when new orders are placed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.orderNotifications}
                  onChange={(e) =>
                    setSettings({ ...settings, orderNotifications: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Low Stock Alerts</p>
                <p className="text-sm text-gray-600">Alerts when products are running low</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.lowStockAlerts}
                  onChange={(e) => setSettings({ ...settings, lowStockAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700"
            disabled={saving}
          >
            <Save size={20} className="mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
