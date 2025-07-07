import { useState } from "react";
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
  Lock
} from "lucide-react";

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
  preparationTime: number; // in minutes
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

export const FoodBeverage = ({ currentUser }: FoodBeverageProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("menu");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Celeste Ethiopia Hotel menu items with ETB prices
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    // Soups
    {
      id: "1",
      name: "Chicken Soup",
      category: "appetizer",
      price: 350.00,
      cost: 120.00,
      description: "Chicken, butter, cream served with bread",
      available: true,
      ingredients: ["chicken", "butter", "cream", "bread"],
      allergens: ["dairy", "gluten"],
      preparationTime: 20
    },
    {
      id: "2",
      name: "Mushroom Soup",
      category: "appetizer",
      price: 320.00,
      cost: 110.00,
      description: "Mushroom butter cream served with bread",
      available: true,
      ingredients: ["mushroom", "butter", "cream", "bread"],
      allergens: ["dairy", "gluten"],
      preparationTime: 18
    },
    {
      id: "3",
      name: "Tomato Soup",
      category: "appetizer",
      price: 300.00,
      cost: 100.00,
      description: "Fresh tomato butter cream served with bread",
      available: true,
      ingredients: ["tomato", "butter", "cream", "bread"],
      allergens: ["dairy", "gluten"],
      preparationTime: 15
    },
    {
      id: "4",
      name: "Potato Soup",
      category: "appetizer",
      price: 280.00,
      cost: 95.00,
      description: "Fresh potato, onion, butter cream served with bread",
      available: true,
      ingredients: ["potato", "onion", "butter", "cream", "bread"],
      allergens: ["dairy", "gluten"],
      preparationTime: 25
    },
    {
      id: "5",
      name: "Vegetable Soup",
      category: "appetizer",
      price: 320.00,
      cost: 105.00,
      description: "Fresh diced potato, carrots, green beans & corn simmered in tomato juice with bread",
      available: true,
      ingredients: ["potato", "carrots", "green beans", "corn", "tomato", "bread"],
      allergens: ["gluten"],
      preparationTime: 30
    },
    // Salads
    {
      id: "6",
      name: "Special Salad",
      category: "appetizer",
      price: 450.00,
      cost: 180.00,
      description: "Lettuce, chicken, onion, chili, tomato, cucumber, tuna, egg, mixed mayonnaise vinegar with bread",
      available: true,
      ingredients: ["lettuce", "chicken", "onion", "chili", "tomato", "cucumber", "tuna", "egg", "mayonnaise", "bread"],
      allergens: ["eggs", "gluten"],
      preparationTime: 12
    },
    {
      id: "7",
      name: "Chicken Salad",
      category: "appetizer",
      price: 380.00,
      cost: 150.00,
      description: "Chicken, lettuce, onion, tomato, chili, cucumber with bread",
      available: true,
      ingredients: ["chicken", "lettuce", "onion", "tomato", "chili", "cucumber", "bread"],
      allergens: ["gluten"],
      preparationTime: 10
    },
    {
      id: "8",
      name: "Mixed Salad",
      category: "appetizer",
      price: 320.00,
      cost: 120.00,
      description: "Lettuce, onion, tomato, cucumber, carrot, chili with bread",
      available: true,
      ingredients: ["lettuce", "onion", "tomato", "cucumber", "carrot", "chili", "bread"],
      allergens: ["gluten"],
      preparationTime: 8
    },
    {
      id: "9",
      name: "Tuna Salad",
      category: "appetizer",
      price: 420.00,
      cost: 160.00,
      description: "Lettuce, tuna, onion, tomato, cucumber with bread",
      available: true,
      ingredients: ["lettuce", "tuna", "onion", "tomato", "cucumber", "bread"],
      allergens: ["fish", "gluten"],
      preparationTime: 10
    },
    {
      id: "10",
      name: "Fruit Salad",
      category: "appetizer",
      price: 350.00,
      cost: 140.00,
      description: "Fresh strawberry, orange, apple, mango, papaya with syrup",
      available: true,
      ingredients: ["strawberry", "orange", "apple", "mango", "papaya", "syrup"],
      allergens: [],
      preparationTime: 8
    },
    {
      id: "11",
      name: "Tomato Salad",
      category: "appetizer",
      price: 280.00,
      cost: 110.00,
      description: "Fresh tomato, onion, chili, black olive with bread",
      available: true,
      ingredients: ["tomato", "onion", "chili", "black olive", "bread"],
      allergens: ["gluten"],
      preparationTime: 5
    },
    // Main Courses - Pasta/Spaghetti
    {
      id: "12",
      name: "Spaghetti with Tomato Sauce",
      category: "main",
      price: 450.00,
      cost: 180.00,
      description: "Spaghetti served with rich tomato sauce",
      available: true,
      ingredients: ["spaghetti", "tomato sauce"],
      allergens: ["gluten"],
      preparationTime: 20
    },
    {
      id: "13",
      name: "Spaghetti with Vegetable Sauce",
      category: "main",
      price: 480.00,
      cost: 200.00,
      description: "Spaghetti served with mixed vegetable sauce",
      available: true,
      ingredients: ["spaghetti", "mixed vegetables"],
      allergens: ["gluten"],
      preparationTime: 25
    },
    {
      id: "14",
      name: "Spaghetti with Tuna Sauce",
      category: "main",
      price: 520.00,
      cost: 220.00,
      description: "Spaghetti served with tuna sauce",
      available: true,
      ingredients: ["spaghetti", "tuna", "sauce"],
      allergens: ["gluten", "fish"],
      preparationTime: 22
    },
    {
      id: "15",
      name: "Spaghetti with Meat Sauce",
      category: "main",
      price: 580.00,
      cost: 250.00,
      description: "Spaghetti served with meat sauce",
      available: true,
      ingredients: ["spaghetti", "meat", "sauce"],
      allergens: ["gluten"],
      preparationTime: 30
    },
    // Main Courses - Grilled/Fried
    {
      id: "16",
      name: "Grilled Chicken",
      category: "main",
      price: 650.00,
      cost: 280.00,
      description: "Well marinated chicken thigh grilled & served with rice",
      available: true,
      ingredients: ["chicken", "rice", "marinade"],
      allergens: [],
      preparationTime: 35
    },
    {
      id: "17",
      name: "Stir Fried Chicken",
      category: "main",
      price: 620.00,
      cost: 260.00,
      description: "Fried cubes of chicken & cooked vegetable served with rice & prime",
      available: true,
      ingredients: ["chicken", "vegetables", "rice"],
      allergens: [],
      preparationTime: 25
    },
    {
      id: "18",
      name: "Roasted Chicken",
      category: "main",
      price: 680.00,
      cost: 300.00,
      description: "Well marinated chicken & served with rice & prime",
      available: true,
      ingredients: ["chicken", "rice", "marinade"],
      allergens: [],
      preparationTime: 40
    },
    {
      id: "19",
      name: "Fried Chicken",
      category: "main",
      price: 600.00,
      cost: 250.00,
      description: "Warmed chicken & served rice with vegetable",
      available: true,
      ingredients: ["chicken", "rice", "vegetables"],
      allergens: [],
      preparationTime: 30
    },
    {
      id: "20",
      name: "Roasted Lamb",
      category: "main",
      price: 750.00,
      cost: 350.00,
      description: "Well marinated lamb served with brown sauce rice with vegetable",
      available: true,
      ingredients: ["lamb", "rice", "vegetables", "brown sauce"],
      allergens: [],
      preparationTime: 45
    },
    {
      id: "21",
      name: "Pan Flake",
      category: "main",
      price: 720.00,
      cost: 320.00,
      description: "Well marinated beef fried",
      available: true,
      ingredients: ["beef", "marinade"],
      allergens: [],
      preparationTime: 35
    },
    // Sandwiches
    {
      id: "22",
      name: "Vegetable Sandwich",
      category: "appetizer",
      price: 280.00,
      cost: 100.00,
      description: "Bread stuffed with sliced cucumber, tomato & carrot",
      available: true,
      ingredients: ["bread", "cucumber", "tomato", "carrot"],
      allergens: ["gluten"],
      preparationTime: 8
    },
    {
      id: "23",
      name: "Tuna Sandwich",
      category: "appetizer",
      price: 350.00,
      cost: 140.00,
      description: "Tuna sandwich with fresh vegetables",
      available: true,
      ingredients: ["bread", "tuna", "vegetables"],
      allergens: ["gluten", "fish"],
      preparationTime: 10
    },
    {
      id: "24",
      name: "Chicken Sandwich",
      category: "appetizer",
      price: 380.00,
      cost: 160.00,
      description: "Chicken sandwich with fresh vegetables",
      available: true,
      ingredients: ["bread", "chicken", "vegetables"],
      allergens: ["gluten"],
      preparationTime: 12
    },
    // French Toast & Breakfast
    {
      id: "25",
      name: "French Toast",
      category: "special",
      price: 320.00,
      cost: 120.00,
      description: "French toast with honey, chocolate or strawberry syrup",
      available: true,
      ingredients: ["bread", "eggs", "syrup"],
      allergens: ["gluten", "eggs", "dairy"],
      preparationTime: 15
    },
    // Juices
    {
      id: "26",
      name: "Milk Shake Juice",
      category: "beverage",
      price: 180.00,
      cost: 60.00,
      description: "Strawberry, honey, milk mix",
      available: true,
      ingredients: ["strawberry", "honey", "milk"],
      allergens: ["dairy"],
      preparationTime: 5
    },
    {
      id: "27",
      name: "Fresh Orange Juice",
      category: "beverage",
      price: 150.00,
      cost: 50.00,
      description: "Fresh squeezed orange juice",
      available: true,
      ingredients: ["orange"],
      allergens: [],
      preparationTime: 3
    },
    {
      id: "28",
      name: "Fresh Strawberry Juice",
      category: "beverage",
      price: 160.00,
      cost: 55.00,
      description: "Fresh strawberry juice",
      available: true,
      ingredients: ["strawberry"],
      allergens: [],
      preparationTime: 5
    },
    {
      id: "29",
      name: "Fresh Papaya Juice",
      category: "beverage",
      price: 140.00,
      cost: 45.00,
      description: "Fresh papaya juice",
      available: true,
      ingredients: ["papaya"],
      allergens: [],
      preparationTime: 4
    },
    {
      id: "30",
      name: "Fresh Mango Juice",
      category: "beverage",
      price: 170.00,
      cost: 60.00,
      description: "Fresh mango juice",
      available: true,
      ingredients: ["mango"],
      allergens: [],
      preparationTime: 5
    },
    {
      id: "31",
      name: "Fresh Watermelon Juice",
      category: "beverage",
      price: 130.00,
      cost: 40.00,
      description: "Fresh watermelon juice",
      available: true,
      ingredients: ["watermelon"],
      allergens: [],
      preparationTime: 3
    },
    {
      id: "32",
      name: "Fresh Avocado Juice",
      category: "beverage",
      price: 180.00,
      cost: 65.00,
      description: "Fresh avocado juice",
      available: true,
      ingredients: ["avocado"],
      allergens: [],
      preparationTime: 5
    },
    {
      id: "33",
      name: "Special Juice Mix",
      category: "beverage",
      price: 200.00,
      cost: 75.00,
      description: "Fresh strawberry, avocado, mango and papaya mix",
      available: true,
      ingredients: ["strawberry", "avocado", "mango", "papaya"],
      allergens: [],
      preparationTime: 8
    }
  ]);

  // Sample orders with ETB amounts
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      tableNumber: "Table 5",
      items: [
        { menuItem: menuItems[0], quantity: 2 },
        { menuItem: menuItems[3], quantity: 1 }
      ],
      status: "preparing",
      totalAmount: 3250.00,
      orderTime: "2024-01-15 19:30",
      customerName: "Smith Family"
    },
    {
      id: "ORD002",
      tableNumber: "Table 12",
      items: [
        { menuItem: menuItems[1], quantity: 1 },
        { menuItem: menuItems[2], quantity: 2 }
      ],
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
    preparationTime: 15
  });

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
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

    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name!,
      category: newItem.category as MenuItem['category'],
      price: newItem.price!,
      cost: newItem.cost || 0,
      description: newItem.description || "",
      available: newItem.available ?? true,
      ingredients: newItem.ingredients || [],
      allergens: newItem.allergens || [],
      preparationTime: newItem.preparationTime || 15
    };

    setMenuItems([...menuItems, item]);
    setNewItem({
      name: "",
      category: "main",
      price: 0,
      cost: 0,
      description: "",
      available: true,
      ingredients: [],
      allergens: [],
      preparationTime: 15
    });
    setIsAddItemDialogOpen(false);

    toast({
      title: "Success",
      description: "Menu item added successfully.",
    });
  };

  const handleDeleteItem = (id: string) => {
    if (!currentUser?.permissions.canDeleteMenu) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete menu items.",
        variant: "destructive",
      });
      return;
    }

    setMenuItems(menuItems.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Menu item deleted successfully.",
    });
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

              <Table>
                <TableHeader>
                  <TableRow>
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
                      <TableCell>{item.preparationTime} min</TableCell>
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
                  value={newItem.preparationTime}
                  onChange={(e) => setNewItem({ ...newItem, preparationTime: parseInt(e.target.value) })}
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
    </div>
  );
};
