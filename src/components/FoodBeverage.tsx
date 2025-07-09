import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User } from "./UserManagement";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Utensils,
  Wine,
  Coffee,
  TrendingUp,
  Users,
  DollarSign,
  ChefHat,
  Lock,
  Loader2
} from "lucide-react";

// Import food images
import chickenSoupImg from "@/assets/chicken-soup.jpg";
import mixedSaladImg from "@/assets/mixed-salad.jpg";
import spaghettiTomatoImg from "@/assets/spaghetti-tomato.jpg";
import grilledChickenImg from "@/assets/grilled-chicken.jpg";
import orangeJuiceImg from "@/assets/orange-juice.jpg";
import strawberryJuiceImg from "@/assets/strawberry-juice.jpg";

// Additional images for all menu items
import mushroomSoupImg from "@/assets/mushroom-soup.jpg";
import tomatoSoupImg from "@/assets/tomato-soup.jpg";
import potatoSoupImg from "@/assets/potato-soup.jpg";
import vegetableSoupImg from "@/assets/vegetable-soup.jpg";
import specialSaladImg from "@/assets/special-salad.jpg";
import chickenSaladImg from "@/assets/chicken-salad.jpg";
import tunaSaladImg from "@/assets/tuna-salad.jpg";
import fruitSaladImg from "@/assets/fruit-salad.jpg";
import tomatoSaladImg from "@/assets/tomato-salad.jpg";
import spaghettiVegetableImg from "@/assets/spaghetti-vegetable.jpg";
import spaghettiTunaImg from "@/assets/spaghetti-tuna.jpg";
import spaghettiMeatImg from "@/assets/spaghetti-meat.jpg";
import stirFriedChickenImg from "@/assets/stir-fried-chicken.jpg";
import roastedChickenImg from "@/assets/roasted-chicken.jpg";
import friedChickenImg from "@/assets/fried-chicken.jpg";
import roastedLambImg from "@/assets/roasted-lamb.jpg";
import panFlakeImg from "@/assets/pan-flake.jpg";
import vegetableSandwichImg from "@/assets/vegetable-sandwich.jpg";
import tunaSandwichImg from "@/assets/tuna-sandwich.jpg";
import chickenSandwichImg from "@/assets/chicken-sandwich.jpg";
import frenchToastImg from "@/assets/french-toast.jpg";
import milkshakeImg from "@/assets/milkshake.jpg";
import papayaJuiceImg from "@/assets/papaya-juice.jpg";
import mangoJuiceImg from "@/assets/mango-juice.jpg";
import watermelonJuiceImg from "@/assets/watermelon-juice.jpg";
import avocadoJuiceImg from "@/assets/avocado-juice.jpg";
import specialJuiceMixImg from "@/assets/special-juice-mix.jpg";

interface MenuItem {
  id: string;
  name: string;
  category: "appetizer" | "main" | "dessert" | "beverage" | "special";
  price: number;
  cost: number;
  description: string;
  available: boolean;
  ingredients: string[];
  allergens: string[];
  preparation_time: number; // in minutes
  image_url?: string; // Optional image for the menu item
}

interface Order {
  id: string;
  tableNumber: string;
  items: { menuItem: MenuItem; quantity: number; notes?: string }[];
  status: "pending" | "preparing" | "ready" | "served" | "cancelled";
  totalAmount: number;
  orderTime: string;
  customerName?: string;
}

interface FoodBeverageProps {
  currentUser?: User;
}

// Image mapping for existing menu items
const imageMap: Record<string, string> = {
  "Chicken Soup": chickenSoupImg,
  "Mushroom Soup": mushroomSoupImg,
  "Tomato Soup": tomatoSoupImg,
  "Potato Soup": potatoSoupImg,
  "Vegetable Soup": vegetableSoupImg,
  "Special Salad": specialSaladImg,
  "Chicken Salad": chickenSaladImg,
  "Mixed Salad": mixedSaladImg,
  "Tuna Salad": tunaSaladImg,
  "Fruit Salad": fruitSaladImg,
  "Tomato Salad": tomatoSaladImg,
  "Spaghetti with Tomato Sauce": spaghettiTomatoImg,
  "Spaghetti with Vegetable Sauce": spaghettiVegetableImg,
  "Spaghetti with Tuna Sauce": spaghettiTunaImg,
  "Spaghetti with Meat Sauce": spaghettiMeatImg,
  "Grilled Chicken": grilledChickenImg,
  "Stir Fried Chicken": stirFriedChickenImg,
  "Roasted Chicken": roastedChickenImg,
  "Fried Chicken": friedChickenImg,
  "Roasted Lamb": roastedLambImg,
  "Pan Flake": panFlakeImg,
  "Vegetable Sandwich": vegetableSandwichImg,
  "Tuna Sandwich": tunaSandwichImg,
  "Chicken Sandwich": chickenSandwichImg,
  "French Toast": frenchToastImg,
  "Milk Shake Juice": milkshakeImg,
  "Fresh Orange Juice": orangeJuiceImg,
  "Fresh Strawberry Juice": strawberryJuiceImg,
  "Fresh Papaya Juice": papayaJuiceImg,
  "Fresh Mango Juice": mangoJuiceImg,
  "Fresh Watermelon Juice": watermelonJuiceImg,
  "Fresh Avocado Juice": avocadoJuiceImg,
  "Special Juice Mix": specialJuiceMixImg,
};

export const FoodBeverage = ({ currentUser }: FoodBeverageProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("menu");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample orders with ETB amounts
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      tableNumber: "Table 5",
      items: [],
      status: "preparing",
      totalAmount: 3250.00,
      orderTime: "2024-01-15 19:30",
      customerName: "Smith Family"
    },
    {
      id: "ORD002",
      tableNumber: "Table 12",
      items: [],
      status: "ready",
      totalAmount: 1900.00,
      orderTime: "2024-01-15 20:15"
    }
  ]);

  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    category: "main",
    price: 0,
    cost: 0,
    description: "",
    available: true,
    ingredients: [],
    allergens: [],
    preparation_time: 15
  });

  // Load menu items from database
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error loading menu items:', error);
          toast({
            title: "Error",
            description: "Failed to load menu items.",
            variant: "destructive",
          });
          return;
        }

        setMenuItems((data || []) as MenuItem[]);
      } catch (err) {
        console.error('Error:', err);
        toast({
          title: "Error",
          description: "Failed to load menu items.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = async () => {
    if (!currentUser?.permissions.canEditMenu) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to add menu items.",
        variant: "destructive",
      });
      return;
    }

    if (!newItem.name || !newItem.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([{
          name: newItem.name!,
          category: newItem.category as MenuItem['category'],
          price: newItem.price!,
          cost: newItem.cost || 0,
          description: newItem.description || "",
          available: newItem.available ?? true,
          ingredients: newItem.ingredients || [],
          allergens: newItem.allergens || [],
          preparation_time: newItem.preparation_time || 15
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding menu item:', error);
        toast({
          title: "Error",
          description: "Failed to add menu item.",
          variant: "destructive",
        });
        return;
      }

      setMenuItems([...menuItems, data as MenuItem]);
      setNewItem({
        name: "",
        category: "main",
        price: 0,
        cost: 0,
        description: "",
        available: true,
        ingredients: [],
        allergens: [],
        preparation_time: 15
      });
      setIsAddItemDialogOpen(false);

      toast({
        title: "Success",
        description: "Menu item added successfully.",
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to add menu item.",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = async () => {
    if (!currentUser?.permissions.canUpdateMenu) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to update menu items.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedItem) return;

    try {
      const { error } = await supabase
        .from('menu_items')
        .update({
          name: selectedItem.name,
          category: selectedItem.category,
          price: selectedItem.price,
          cost: selectedItem.cost,
          description: selectedItem.description,
          available: selectedItem.available,
          ingredients: selectedItem.ingredients,
          allergens: selectedItem.allergens,
          preparation_time: selectedItem.preparation_time
        })
        .eq('id', selectedItem.id);

      if (error) {
        console.error('Error updating menu item:', error);
        toast({
          title: "Error",
          description: "Failed to update menu item.",
          variant: "destructive",
        });
        return;
      }

      const updatedItems = menuItems.map(item => 
        item.id === selectedItem.id ? selectedItem : item
      );
      setMenuItems(updatedItems);
      setSelectedItem(null);
      setIsEditItemDialogOpen(false);

      toast({
        title: "Success",
        description: "Menu item updated successfully.",
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to update menu item.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!currentUser?.permissions.canDeleteMenu) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete menu items.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting menu item:', error);
        toast({
          title: "Error",
          description: "Failed to delete menu item.",
          variant: "destructive",
        });
        return;
      }

      setMenuItems(menuItems.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Menu item deleted successfully.",
      });
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to delete menu item.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      preparing: "bg-blue-100 text-blue-800",
      ready: "bg-green-100 text-green-800",
      served: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return <Badge className={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const getCategoryIcon = (category: MenuItem['category']) => {
    const icons = {
      appetizer: <Utensils className="w-4 h-4" />,
      main: <ChefHat className="w-4 h-4" />,
      dessert: <Coffee className="w-4 h-4" />,
      beverage: <Wine className="w-4 h-4" />,
      special: <TrendingUp className="w-4 h-4" />
    };
    return icons[category];
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const activeOrders = orders.filter(order => order.status !== "served" && order.status !== "cancelled").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Food & Beverage</h1>
          <p className="text-gray-600 mt-2">Manage menu items, orders, and restaurant operations</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Today's sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
            <p className="text-xs text-muted-foreground">Currently processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItems.length}</div>
            <p className="text-xs text-muted-foreground">Available items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB {averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab("menu")}
          className={`pb-2 px-1 font-medium ${
            activeTab === "menu" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Menu Management
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-2 px-1 font-medium ${
            activeTab === "orders" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Order Management
        </button>
      </div>

      {/* Menu Management Tab */}
      {activeTab === "menu" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Menu Items</CardTitle>
                  <CardDescription>Manage your restaurant menu and pricing</CardDescription>
                </div>
                {currentUser?.permissions.canEditMenu && (
                  <Button onClick={() => setIsAddItemDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="appetizer">Appetizers</SelectItem>
                    <SelectItem value="main">Main Courses</SelectItem>
                    <SelectItem value="dessert">Desserts</SelectItem>
                    <SelectItem value="beverage">Beverages</SelectItem>
                    <SelectItem value="special">Specials</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading menu items...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead>Prep Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMenuItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.image_url || imageMap[item.name] ? (
                            <img 
                              src={item.image_url || imageMap[item.name]} 
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg shadow-sm"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Utensils className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {item.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(item.category)}
                            <span className="capitalize">{item.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>ETB {item.price.toFixed(2)}</TableCell>
                        <TableCell>ETB {item.cost.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            ETB {(item.price - item.cost).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>{item.preparation_time} min</TableCell>
                        <TableCell>
                          <Badge variant={item.available ? "default" : "secondary"}>
                            {item.available ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {currentUser?.permissions.canUpdateMenu ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsEditItemDialogOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                <Lock className="w-4 h-4" />
                              </Button>
                            )}
                            {currentUser?.permissions.canDeleteMenu ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                <Lock className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Order Management Tab */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Orders</CardTitle>
                  <CardDescription>Track and manage restaurant orders</CardDescription>
                </div>
                <Button onClick={() => setIsAddOrderDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Order
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Table/Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.tableNumber}</div>
                          {order.customerName && (
                            <div className="text-sm text-gray-500">{order.customerName}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items.map((item, index) => (
                            <div key={index}>
                              {item.quantity}x {item.menuItem.name}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>ETB {order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.orderTime}</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value: Order['status']) => {
                            setOrders(orders.map(o => 
                              o.id === order.id ? { ...o, status: value } : o
                            ));
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="served">Served</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
            <DialogDescription>
              Create a new item for your restaurant menu.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value: MenuItem['category']) => 
                    setNewItem({ ...newItem, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appetizer">Appetizer</SelectItem>
                    <SelectItem value="main">Main Course</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                    <SelectItem value="beverage">Beverage</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (ETB)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (ETB)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={newItem.cost}
                  onChange={(e) => setNewItem({ ...newItem, cost: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prepTime">Prep Time (min)</Label>
                <Input
                  id="prepTime"
                  type="number"
                  value={newItem.preparation_time}
                  onChange={(e) => setNewItem({ ...newItem, preparation_time: parseInt(e.target.value) })}
                  placeholder="15"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Describe the menu item..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the details of this menu item.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Item Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedItem.name}
                    onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={selectedItem.category}
                    onValueChange={(value: MenuItem['category']) => 
                      setSelectedItem({ ...selectedItem, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appetizer">Appetizer</SelectItem>
                      <SelectItem value="main">Main Course</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                      <SelectItem value="beverage">Beverage</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (ETB)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={selectedItem.price}
                    onChange={(e) => setSelectedItem({ ...selectedItem, price: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cost">Cost (ETB)</Label>
                  <Input
                    id="edit-cost"
                    type="number"
                    step="0.01"
                    value={selectedItem.cost}
                    onChange={(e) => setSelectedItem({ ...selectedItem, cost: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-prepTime">Prep Time (min)</Label>
                  <Input
                    id="edit-prepTime"
                    type="number"
                    value={selectedItem.preparation_time}
                    onChange={(e) => setSelectedItem({ ...selectedItem, preparation_time: parseInt(e.target.value) })}
                    placeholder="15"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedItem.description}
                  onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                  placeholder="Describe the menu item..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditItem}>Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};