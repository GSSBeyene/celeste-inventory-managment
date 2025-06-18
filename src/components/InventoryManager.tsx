import { useState, useRef } from "react";
import { Search, Plus, Filter, Package, Bed, Droplets, Coffee, Wrench, Edit, Trash2, Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  location: string;
  lastUpdated: string;
  image?: string;
}

export const InventoryManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "rooms",
    currentStock: 0,
    minStock: 0,
    unit: "pieces",
    location: "",
    image: ""
  });

  const categories = [
    { id: "all", name: "All Items", icon: Package, color: "bg-gray-500" },
    { id: "rooms", name: "Room Amenities", icon: Bed, color: "bg-blue-500" },
    { id: "housekeeping", name: "Housekeeping", icon: Droplets, color: "bg-green-500" },
    { id: "minibar", name: "Minibar & F&B", icon: Coffee, color: "bg-orange-500" },
    { id: "maintenance", name: "Maintenance", icon: Wrench, color: "bg-purple-500" },
  ];

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: 1,
      name: "Premium Bath Towels",
      category: "rooms",
      currentStock: 245,
      minStock: 50,
      unit: "pieces",
      location: "Linen Room A",
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      name: "Luxury Shampoo Bottles",
      category: "rooms",
      currentStock: 12,
      minStock: 20,
      unit: "bottles",
      location: "Housekeeping Storage",
      lastUpdated: "4 hours ago",
    },
    {
      id: 3,
      name: "All-Purpose Cleaner",
      category: "housekeeping",
      currentStock: 89,
      minStock: 25,
      unit: "bottles",
      location: "Cleaning Supplies",
      lastUpdated: "1 day ago",
    },
    {
      id: 4,
      name: "Coffee Pods - Premium Blend",
      category: "minibar",
      currentStock: 156,
      minStock: 50,
      unit: "pods",
      location: "Minibar Storage",
      lastUpdated: "6 hours ago",
    },
    {
      id: 5,
      name: "LED Light Bulbs",
      category: "maintenance",
      currentStock: 34,
      minStock: 15,
      unit: "pieces",
      location: "Maintenance Room",
      lastUpdated: "3 days ago",
    },
    {
      id: 6,
      name: "Egyptian Cotton Bed Sheets",
      category: "rooms",
      currentStock: 78,
      minStock: 30,
      unit: "sets",
      location: "Linen Room B",
      lastUpdated: "1 day ago",
    }
  ]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (isEdit && editingItem) {
          setEditingItem({ ...editingItem, image: imageUrl });
        } else {
          setNewItem({ ...newItem, image: imageUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (isEdit = false) => {
    if (isEdit && editingItem) {
      setEditingItem({ ...editingItem, image: "" });
      if (editFileInputRef.current) {
        editFileInputRef.current.value = "";
      }
    } else {
      setNewItem({ ...newItem, image: "" });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const item: InventoryItem = {
      id: Date.now(),
      ...newItem,
      lastUpdated: "Just now"
    };

    setInventoryItems([...inventoryItems, item]);
    setNewItem({
      name: "",
      category: "rooms",
      currentStock: 0,
      minStock: 0,
      unit: "pieces",
      location: "",
      image: ""
    });
    setIsAddItemOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast({
      title: "Success",
      description: "Item added successfully.",
    });
  };

  const handleUpdateItem = (itemId: number, updates: Partial<InventoryItem>) => {
    setInventoryItems(inventoryItems.map(item => 
      item.id === itemId ? { ...item, ...updates, lastUpdated: "Just now" } : item
    ));
    
    toast({
      title: "Success",
      description: "Item updated successfully.",
    });
  };

  const handleDeleteItem = (itemId: number) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== itemId));
    toast({
      title: "Success",
      description: "Item deleted successfully.",
    });
  };

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
        <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
              <DialogDescription>
                Add a new item to your inventory system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Enter item name"
                />
              </div>
              
              {/* Image Upload Section */}
              <div>
                <Label>Item Image</Label>
                <div className="mt-2">
                  {newItem.image ? (
                    <div className="relative inline-block">
                      <img 
                        src={newItem.image} 
                        alt="Item preview" 
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                        onClick={() => handleRemoveImage(false)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-2">Upload item image</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rooms">Room Amenities</SelectItem>
                    <SelectItem value="housekeeping">Housekeeping</SelectItem>
                    <SelectItem value="minibar">Minibar & F&B</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentStock">Current Stock</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    value={newItem.currentStock}
                    onChange={(e) => setNewItem({...newItem, currentStock: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="minStock">Minimum Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={newItem.minStock}
                    onChange={(e) => setNewItem({...newItem, minStock: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    placeholder="e.g., pieces, bottles, sets"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newItem.location}
                    onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                    placeholder="Storage location"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                {/* Item Image */}
                {item.image && (
                  <div className="w-full h-32 mb-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setEditingItem(item)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
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

      {/* Edit Item Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Inventory Item</DialogTitle>
              <DialogDescription>
                Update item information and stock levels.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Item Name</Label>
                <Input
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                />
              </div>

              {/* Image Upload Section for Edit */}
              <div>
                <Label>Item Image</Label>
                <div className="mt-2">
                  {editingItem.image ? (
                    <div className="relative inline-block">
                      <img 
                        src={editingItem.image} 
                        alt="Item preview" 
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                        onClick={() => handleRemoveImage(true)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-2">Upload item image</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => editFileInputRef.current?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current Stock</Label>
                  <Input
                    type="number"
                    value={editingItem.currentStock}
                    onChange={(e) => setEditingItem({...editingItem, currentStock: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label>Minimum Stock</Label>
                  <Input
                    type="number"
                    value={editingItem.minStock}
                    onChange={(e) => setEditingItem({...editingItem, minStock: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={editingItem.location}
                  onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button onClick={() => {
                handleUpdateItem(editingItem.id, editingItem);
                setEditingItem(null);
              }}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
