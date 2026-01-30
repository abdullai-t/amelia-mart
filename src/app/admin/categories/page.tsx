"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, Edit2, X } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function CategoriesPage() {
  const { settings } = useSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    // Get categories from products data
    const defaultCategories = [
      {
        id: "groceries",
        name: "Groceries",
        description: "Fresh grains, pulses, and staples",
      },
      {
        id: "vegetables",
        name: "Vegetables",
        description: "Fresh organic vegetables",
      },
      {
        id: "fruits",
        name: "Fruits",
        description: "Fresh seasonal fruits",
      },
      {
        id: "beverages",
        name: "Beverages",
        description: "Drinks and juices",
      },
      {
        id: "snacks",
        name: "Snacks",
        description: "Tasty snacks and treats",
      },
      {
        id: "household",
        name: "Household Items",
        description: "Cleaning and household essentials",
      },
    ];
    setCategories(defaultCategories);
    setLoading(false);
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Category description is required");
      return;
    }

    if (editingId) {
      // Update existing category
      setCategories(
        categories.map((cat) =>
          cat.id === editingId
            ? {
                ...cat,
                name: formData.name,
                description: formData.description,
              }
            : cat
        )
      );
      toast.success("Category updated successfully");
      setEditingId(null);
    } else {
      // Add new category
      const newCategory = {
        id: formData.name.toLowerCase().replace(/\s+/g, "-"),
        name: formData.name,
        description: formData.description,
      };
      setCategories([...categories, newCategory]);
      toast.success("Category added successfully");
    }

    setFormData({ name: "", description: "" });
    setShowForm(false);
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description,
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
      toast.success("Category deleted successfully");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage product categories</p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            style={{ backgroundColor: settings?.primaryColor, color: 'white' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={18} className="mr-2" />
            Add Category
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>
            <button
              onClick={handleCancel}
              style={{ color: settings?.primaryColor }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Fresh Produce"
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="e.g., Fresh fruits and vegetables"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                style={{ backgroundColor: settings?.primaryColor, color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {editingId ? "Update" : "Create"} Category
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2">
          <Search className="text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-600">
                    No categories found
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${settings?.primaryColor}10`}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {category.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        style={{ color: settings?.primaryColor }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${settings?.primaryColor}20`}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        style={{ color: '#dc2626' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
