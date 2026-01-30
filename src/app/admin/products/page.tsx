"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types";
import { Plus, Edit, Trash2, Search, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { uploadToCloudinary, isEmoji } from "@/utils/cloudinary";
import { useSettings } from "@/hooks/useSettings";

export default function ProductsManagement() {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "instock" | "lowstock" | "outofstock">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (stockFilter === "instock") {
      return matchesSearch && product.stock > 10;
    }
    if (stockFilter === "lowstock") {
      return matchesSearch && product.stock > 0 && product.stock <= 10;
    }
    if (stockFilter === "outofstock") {
      return matchesSearch && product.stock === 0;
    }
    return matchesSearch;
  });

  const stats = {
    total: products.length,
    instock: products.filter((p) => p.stock > 10).length,
    lowstock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    outofstock: products.filter((p) => p.stock === 0).length,
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Failed to delete product");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setImagePreview(product.image);
    setShowAddModal(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      setUploadingImage(true);
      toast.loading("Uploading image...");
      const imageUrl = await uploadToCloudinary(file);
      setImagePreview(imageUrl);
      toast.dismiss();
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.dismiss();
      // If Cloudinary fails, keep the base64 preview
      if (error instanceof Error) {
        if (error.message.includes("configuration missing")) {
          toast.error("Cloudinary not configured. Check .env file.");
        } else {
          toast.error(`Upload failed: ${error.message}`);
        }
      } else {
        toast.error("Failed to upload image. Using local preview.");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const clearImage = () => {
    setImagePreview("");
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      category: formData.get("category") as string,
      image: imagePreview || editingProduct?.image || "📦",
      stock: formData.get("stock") as string,
      unit: formData.get("unit") as string,
      rating: editingProduct?.rating || 4.5,
      reviews: editingProduct?.reviews || 0,
    };

    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to save product');

      const savedProduct = await response.json();

      if (editingProduct) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? savedProduct : p)));
        toast.success("Product updated successfully");
      } else {
        setProducts([...products, savedProduct]);
        toast.success("Product added successfully");
      }

      setShowAddModal(false);
      setEditingProduct(null);
      setImagePreview("");
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error("Failed to save product");
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-600 bg-red-100" };
    if (stock < 10) return { text: "Low Stock", color: "text-orange-600 bg-orange-100" };
    if (stock < 30) return { text: "Medium", color: "text-yellow-600 bg-yellow-100" };
    return { text: "In Stock", color: "text-green-600 bg-green-100" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-1">{products.length} total products</p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setShowAddModal(true);
          }}
          className="text-white"
          style={{ backgroundColor: settings?.primaryColor }}
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setStockFilter("all")}
          className="rounded-lg shadow p-6 transition-all border-2"
          style={{
            backgroundColor: stockFilter === "all" ? `${settings?.primaryColor}10` : '#ffffff',
            borderColor: stockFilter === "all" ? settings?.primaryColor : 'transparent',
          }}
        >
          <div className="text-left">
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-3xl font-bold text-gray-900 mt-2" style={{ color: settings?.primaryColor }}>{stats.total}</p>
          </div>
        </button>

        <button
          onClick={() => setStockFilter("instock")}
          className="rounded-lg shadow p-6 transition-all border-2"
          style={{
            backgroundColor: stockFilter === "instock" ? `${settings?.primaryColor}10` : '#ffffff',
            borderColor: stockFilter === "instock" ? settings?.primaryColor : 'transparent',
          }}
        >
          <div className="text-left">
            <p className="text-sm text-gray-600">In Stock</p>
            <p className="text-3xl font-bold mt-2" style={{ color: settings?.primaryColor }}>{stats.instock}</p>
          </div>
        </button>

        <button
          onClick={() => setStockFilter("lowstock")}
          className="rounded-lg shadow p-6 transition-all border-2"
          style={{
            backgroundColor: stockFilter === "lowstock" ? `${settings?.secondaryColor}10` : '#ffffff',
            borderColor: stockFilter === "lowstock" ? settings?.secondaryColor : 'transparent',
          }}
        >
          <div className="text-left">
            <p className="text-sm text-gray-600">Low Stock</p>
            <p className="text-3xl font-bold mt-2" style={{ color: settings?.secondaryColor }}>{stats.lowstock}</p>
          </div>
        </button>

        <button
          onClick={() => setStockFilter("outofstock")}
          className="rounded-lg shadow p-6 transition-all border-2"
          style={{
            backgroundColor: stockFilter === "outofstock" ? `${settings?.accentColor}10` : '#ffffff',
            borderColor: stockFilter === "outofstock" ? settings?.accentColor : 'transparent',
          }}
        >
          <div className="text-left">
            <p className="text-sm text-gray-600">Out of Stock</p>
            <p className="text-3xl font-bold mt-2 text-red-600">{stats.outofstock}</p>
          </div>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2">
          <Search size={20} style={{ color: settings?.primaryColor }} />
          <Input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            style={{
              borderColor: settings?.primaryColor,
              outlineColor: settings?.secondaryColor,
            }}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: `${settings?.primaryColor}10`, borderBottomColor: settings?.primaryColor, borderBottomWidth: '2px' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: settings?.primaryColor }}>
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: settings?.primaryColor }}>
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: settings?.primaryColor }}>
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: settings?.primaryColor }}>
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: settings?.primaryColor }}>
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: settings?.primaryColor }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <tr 
                    key={product.id}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${settings?.primaryColor}10`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 cursor-pointer transition-opacity"
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                          {isEmoji(product.image) ? (
                            <span className="text-2xl">{product.image}</span>
                          ) : (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700 capitalize">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">GHS {product.price.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{product.stock}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          style={{ color: settings?.primaryColor }}
                          className="hover:bg-opacity-10"
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${settings?.primaryColor}20`}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:bg-red-50"
                          style={{ color: '#dc2626' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b" style={{ borderColor: settings?.primaryColor }}>
              <h2 className="text-2xl font-bold" style={{ color: settings?.primaryColor }}>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingProduct?.name}
                    required
                    placeholder="e.g., Fresh Tomatoes"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={editingProduct?.category}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select category</option>
                    <option value="groceries">Groceries</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="beverages">Beverages</option>
                    <option value="snacks">Snacks</option>
                    <option value="household">Household</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="price">Price (GHS)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct?.price}
                    required
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    defaultValue={editingProduct?.stock}
                    required
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    name="unit"
                    defaultValue={editingProduct?.unit}
                    required
                    placeholder="e.g., kg, pieces, liters"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="image">Product Image</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors"
                      style={{
                        borderColor: `${settings?.primaryColor}40`,
                        backgroundColor: `${settings?.primaryColor}05`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = settings?.primaryColor || '#16a34a';
                        e.currentTarget.style.backgroundColor = `${settings?.primaryColor}10`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${settings?.primaryColor}40`;
                        e.currentTarget.style.backgroundColor = `${settings?.primaryColor}05`;
                      }}
                    >
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          {isEmoji(imagePreview) ? (
                            <div className="w-full h-full flex items-center justify-center text-6xl">
                              {imagePreview}
                            </div>
                          ) : (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-contain rounded-lg p-2"
                            />
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              clearImage();
                            }}
                            style={{ backgroundColor: '#dc2626' }}
                            className="absolute top-2 right-2 p-1 text-white rounded-full transition-opacity"
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                        </div>
                      )}
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload a product image. Images will be stored in Cloudinary (configure in .env).
                  </p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={editingProduct?.description}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter product description..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  style={{ backgroundColor: settings?.primaryColor, color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1"
                  style={{ borderColor: settings?.primaryColor, color: settings?.primaryColor }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
