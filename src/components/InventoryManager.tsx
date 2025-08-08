import { useState, useRef, useEffect } from "react";
import { Search, Plus, Filter, Package, Bed, Droplets, Coffee, Wrench, Edit, Trash2, Upload, X, FileText, Download, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./auth/AuthProvider";
import { parseExcelFile, generateExcelTemplate, ExcelInventoryItem } from "@/utils/excelParser";
import { uploadDocument, UploadedDocument } from "@/utils/documentUpload";
import { supabase } from "@/integrations/supabase/client";
interface InventoryItem {
  id: string;
  name: string;
  itemCode: string;
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
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const excelFileInputRef = useRef<HTMLInputElement>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    itemCode: "",
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

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data: itemsData, error: itemsError } = await supabase
        .from('inventory_items')
        .select('id, name, item_code, category, reorder_level, unit_of_measure, updated_at');
      if (itemsError) throw itemsError;

      const ids = (itemsData || []).map((i: any) => i.id);
      let stockData: any[] = [];
      if (ids.length) {
        const { data: sData, error: sError } = await supabase
          .from('stock_levels')
          .select('item_id, current_quantity, last_updated')
          .in('item_id', ids);
        if (sError) throw sError;
        stockData = sData || [];
      }
      const stockMap = new Map(stockData.map((s: any) => [s.item_id, s]));

      const mapped: InventoryItem[] = (itemsData || []).map((i: any) => ({
        id: i.id,
        name: i.name,
        itemCode: i.item_code,
        category: i.category,
        currentStock: stockMap.get(i.id)?.current_quantity ?? 0,
        minStock: i.reorder_level ?? 0,
        unit: i.unit_of_measure,
        location: "",
        lastUpdated: (stockMap.get(i.id)?.last_updated || i.updated_at || new Date().toISOString())
      }));

      setInventoryItems(mapped);
    } catch (e) {
      console.error('Fetch inventory error', e);
      toast({ title: 'Error', description: 'Failed to load inventory items.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

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

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.itemCode || !newItem.unit) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    try {
      setIsUploading(true);
      const { data: insertedItems, error } = await supabase
        .from('inventory_items')
        .insert({
          name: newItem.name,
          item_code: newItem.itemCode,
          category: newItem.category,
          reorder_level: newItem.minStock,
          unit_of_measure: newItem.unit,
          description: newItem.location || null,
        })
        .select('id, name, item_code, category, reorder_level, unit_of_measure, updated_at')
        .single();
      if (error) throw error;

      const { error: stockErr } = await supabase
        .from('stock_levels')
        .insert({ item_id: insertedItems.id, current_quantity: newItem.currentStock });
      if (stockErr) throw stockErr;

      const item: InventoryItem = {
        id: insertedItems.id,
        name: insertedItems.name,
        itemCode: insertedItems.item_code,
        category: insertedItems.category,
        currentStock: newItem.currentStock,
        minStock: insertedItems.reorder_level ?? 0,
        unit: insertedItems.unit_of_measure,
        location: newItem.location,
        lastUpdated: new Date(insertedItems.updated_at || Date.now()).toString(),
      };

      setInventoryItems([...inventoryItems, item]);
      setNewItem({ name: "", itemCode: "", category: "rooms", currentStock: 0, minStock: 0, unit: "pieces", location: "", image: "" });
      setIsAddItemOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast({ title: "Success", description: "Item added successfully." });
    } catch (e) {
      console.error('Add item error', e);
      toast({ title: 'Error', description: 'Failed to add item.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateItem = async (itemId: string, updates: Partial<InventoryItem>) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({
          name: updates.name,
          item_code: updates.itemCode,
          category: updates.category,
          reorder_level: updates.minStock,
          unit_of_measure: updates.unit,
          description: updates.location,
        })
        .eq('id', itemId);
      if (error) throw error;

      if (typeof updates.currentStock === 'number') {
        const { error: stockErr } = await supabase
          .from('stock_levels')
          .update({ current_quantity: updates.currentStock })
          .eq('item_id', itemId);
        if (stockErr) throw stockErr;
      }

      setInventoryItems(inventoryItems.map(item => 
        item.id === itemId ? { ...item, ...updates, lastUpdated: "Just now" } : item
      ));
      toast({ title: "Success", description: "Item updated successfully." });
    } catch (e) {
      console.error('Update item error', e);
      toast({ title: 'Error', description: 'Failed to update item.', variant: 'destructive' });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await supabase.from('stock_levels').delete().eq('item_id', itemId);
      const { error } = await supabase.from('inventory_items').delete().eq('id', itemId);
      if (error) throw error;
      setInventoryItems(inventoryItems.filter(item => item.id !== itemId));
      toast({ title: "Success", description: "Item deleted successfully." });
    } catch (e) {
      console.error('Delete item error', e);
      toast({ title: 'Error', description: 'Failed to delete item.', variant: 'destructive' });
    }
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

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const excelItems = await parseExcelFile(file);
      if (excelItems.length === 0) {
        toast({ title: "Error", description: "No valid items found in the Excel file.", variant: "destructive" });
        return;
      }

      // Upload source document to storage
      const uploadedDoc = await uploadDocument(file, user.id);
      setUploadedDocuments(prev => [...prev, uploadedDoc]);

      // Insert inventory items
      const itemsToInsert = excelItems.map(i => ({
        name: i.name,
        item_code: i.itemCode,
        category: i.category,
        reorder_level: i.minStock,
        unit_of_measure: i.unit,
        description: i.location || i.description || null,
      }));
      const { data: insertedItems, error: insertErr } = await supabase
        .from('inventory_items')
        .insert(itemsToInsert)
        .select('id, name, item_code, category, reorder_level, unit_of_measure, updated_at');
      if (insertErr) throw insertErr;

      // Create stock levels for inserted items
      const stockInserts = insertedItems.map((ins: any, idx: number) => ({
        item_id: ins.id,
        current_quantity: excelItems[idx].currentStock,
      }));
      if (stockInserts.length) {
        const { error: stockErr } = await supabase.from('stock_levels').insert(stockInserts);
        if (stockErr) throw stockErr;
      }

      // Update UI state
      const newItems: InventoryItem[] = insertedItems.map((ins: any, idx: number) => ({
        id: ins.id,
        name: ins.name,
        itemCode: ins.item_code,
        category: ins.category,
        currentStock: excelItems[idx].currentStock,
        minStock: ins.reorder_level ?? 0,
        unit: ins.unit_of_measure,
        location: excelItems[idx].location,
        lastUpdated: new Date(ins.updated_at || Date.now()).toString()
      }));

      setInventoryItems(prev => [...prev, ...newItems]);
      setIsExcelUploadOpen(false);
      toast({ title: "Success", description: `Successfully imported ${newItems.length} items from Excel file.` });
      if (excelFileInputRef.current) excelFileInputRef.current.value = "";
    } catch (error) {
      console.error('Excel upload error:', error);
      toast({ title: "Error", description: "Failed to process Excel file. Please check the format and try again.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    generateExcelTemplate();
    toast({
      title: "Template Downloaded",
      description: "Excel template has been downloaded to your computer.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all hotel inventory items</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Template
          </Button>
          <Dialog open={isExcelUploadOpen} onOpenChange={setIsExcelUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Import Excel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import Inventory from Excel</DialogTitle>
                <DialogDescription>
                  Upload an Excel file to import multiple inventory items at once.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Excel File</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports .xlsx, .xls files. Make sure your file follows the template format.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => excelFileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Choose Excel File"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDownloadTemplate}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                  <input
                    ref={excelFileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelUpload}
                    className="hidden"
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Required Columns:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Name - Item name</li>
                    <li>• Item Code - Unique identifier</li>
                    <li>• Category - rooms, housekeeping, minibar, or maintenance</li>
                    <li>• Current Stock - Number in stock</li>
                    <li>• Min Stock - Minimum required</li>
                    <li>• Unit - Unit of measure (pieces, bottles, etc.)</li>
                    <li>• Location - Storage location</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExcelUploadOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <Label htmlFor="itemCode">Item Code</Label>
                  <Input
                    id="itemCode"
                    value={newItem.itemCode}
                    onChange={(e) => setNewItem({...newItem, itemCode: e.target.value})}
                    placeholder="Enter item code (e.g., BTW-001)"
                  />
                </div>
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
