
import { useState } from "react";
import { Search, Plus, Filter, Package, Bed, Droplets, Coffee, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const InventoryManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Items", icon: Package, color: "bg-gray-500" },
    { id: "rooms", name: "Room Amenities", icon: Bed, color: "bg-blue-500" },
    { id: "housekeeping", name: "Housekeeping", icon: Droplets, color: "bg-green-500" },
    { id: "minibar", name: "Minibar & F&B", icon: Coffee, color: "bg-orange-500" },
    { id: "maintenance", name: "Maintenance", icon: Wrench, color: "bg-purple-500" },
  ];

  const inventoryItems = [
    {
      id: 1,
      name: "Premium Bath Towels",
      category: "rooms",
      currentStock: 245,
      minStock: 50,
      unit: "pieces",
      location: "Linen Room A",
      lastUpdated: "2 hours ago"
    },
    {
      id: 2,
      name: "Luxury Shampoo Bottles",
      category: "rooms",
      currentStock: 12,
      minStock: 20,
      unit: "bottles",
      location: "Housekeeping Storage",
      lastUpdated: "4 hours ago"
    },
    {
      id: 3,
      name: "All-Purpose Cleaner",
      category: "housekeeping",
      currentStock: 89,
      minStock: 25,
      unit: "bottles",
      location: "Cleaning Supplies",
      lastUpdated: "1 day ago"
    },
    {
      id: 4,
      name: "Coffee Pods - Premium Blend",
      category: "minibar",
      currentStock: 156,
      minStock: 50,
      unit: "pods",
      location: "Minibar Storage",
      lastUpdated: "6 hours ago"
    },
    {
      id: 5,
      name: "LED Light Bulbs",
      category: "maintenance",
      currentStock: 34,
      minStock: 15,
      unit: "pieces",
      location: "Maintenance Room",
      lastUpdated: "3 days ago"
    },
    {
      id: 6,
      name: "Egyptian Cotton Bed Sheets",
      category: "rooms",
      currentStock: 78,
      minStock: 30,
      unit: "sets",
      location: "Linen Room B",
      lastUpdated: "1 day ago"
    }
  ];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) return { status: "Critical", color: "text-red-600 bg-red-50" };
    if (current <= min * 1.5) return { status: "Low", color: "text-orange-600 bg-orange-50" };
    return { status: "Good", color: "text-green-600 bg-green-50" };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all hotel inventory items</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search inventory items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const stockStatus = getStockStatus(item.currentStock, item.minStock);
          const categoryInfo = categories.find(cat => cat.id === item.category);
          const CategoryIcon = categoryInfo?.icon || Package;

          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 ${categoryInfo?.color} rounded-lg flex items-center justify-center`}>
                      <CategoryIcon className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${stockStatus.color}`}>
                    {stockStatus.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Stock</p>
                    <p className="text-2xl font-bold text-gray-900">{item.currentStock}</p>
                    <p className="text-xs text-gray-400">{item.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Min. Required</p>
                    <p className="text-lg font-semibold text-gray-700">{item.minStock}</p>
                    <p className="text-xs text-gray-400">{item.unit}</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      item.currentStock <= item.minStock ? 'bg-red-500' :
                      item.currentStock <= item.minStock * 1.5 ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((item.currentStock / (item.minStock * 2)) * 100, 100)}%` }}
                  ></div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium text-gray-700">{item.location}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="text-gray-600">{item.lastUpdated}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Update Stock
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
