
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Package,
  Truck,
  DollarSign,
  ShoppingCart,
  Clock,
  Star,
  Filter,
  ChefHat,
  Utensils
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  preparationTime: string;
  available: boolean;
}

interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  deliveryTime: string;
  orderType: "dine-in" | "takeaway" | "delivery";
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  totalAmount: number;
  notes: string;
  tableNumber?: string;
  deliveryAddress?: string;
}

const menuCategories = ["All", "Appetizers", "Main Course", "Desserts", "Beverages", "Specials"];

const sampleMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Grilled Salmon Teriyaki",
    category: "Main Course",
    price: 24.99,
    description: "Fresh Atlantic salmon glazed with house teriyaki sauce, served with steamed rice and seasonal vegetables",
    image: "/api/placeholder/300/200",
    rating: 4.8,
    preparationTime: "20-25 min",
    available: true
  },
  {
    id: "2",
    name: "Truffle Mushroom Risotto",
    category: "Main Course",
    price: 22.50,
    description: "Creamy arborio rice with wild mushrooms, truffle oil, and aged parmesan cheese",
    image: "/api/placeholder/300/200",
    rating: 4.6,
    preparationTime: "25-30 min",
    available: true
  },
  {
    id: "3",
    name: "Classic Caesar Salad",
    category: "Appetizers",
    price: 12.99,
    description: "Crisp romaine lettuce, house-made croutons, aged parmesan, and classic caesar dressing",
    image: "/api/placeholder/300/200",
    rating: 4.5,
    preparationTime: "5-10 min",
    available: true
  },
  {
    id: "4",
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 9.99,
    description: "Warm chocolate cake with molten center, served with vanilla ice cream and berry compote",
    image: "/api/placeholder/300/200",
    rating: 4.9,
    preparationTime: "15-20 min",
    available: true
  }
];

export const SalesOrders = () => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<"menu" | "orders">("menu");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      customerName: "John Smith",
      customerEmail: "john@example.com",
      customerPhone: "+1234567890",
      orderDate: "2024-01-15",
      deliveryTime: "7:30 PM",
      orderType: "dine-in",
      status: "preparing",
      items: [],
      subtotal: 49.98,
      tax: 5.00,
      deliveryFee: 0,
      totalAmount: 54.98,
      notes: "",
      tableNumber: "Table 5"
    }
  ]);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    orderType: "dine-in" as "dine-in" | "takeaway" | "delivery",
    tableNumber: "",
    deliveryAddress: "",
    notes: ""
  });

  const filteredMenuItems = sampleMenuItems.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find(item => item.menuItem.id === menuItem.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.menuItem.id === menuItem.id 
          ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * menuItem.price }
          : item
      ));
    } else {
      const newItem: OrderItem = {
        id: Date.now().toString(),
        menuItem,
        quantity: 1,
        totalPrice: menuItem.price
      };
      setCart([...cart, newItem]);
    }

    toast({
      title: "Added to cart",
      description: `${menuItem.name} has been added to your order.`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(cart.map(item => 
      item.id === itemId 
        ? { ...item, quantity, totalPrice: quantity * item.menuItem.price }
        : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required customer information.",
        variant: "destructive",
      });
      return;
    }

    const subtotal = getCartTotal();
    const tax = subtotal * 0.1;
    const deliveryFee = customerInfo.orderType === "delivery" ? 3.99 : 0;
    const totalAmount = subtotal + tax + deliveryFee;

    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryTime: new Date(Date.now() + 30 * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      orderType: customerInfo.orderType,
      status: "pending",
      items: cart,
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      notes: customerInfo.notes,
      tableNumber: customerInfo.tableNumber,
      deliveryAddress: customerInfo.deliveryAddress
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setCustomerInfo({
      name: "", email: "", phone: "", orderType: "dine-in",
      tableNumber: "", deliveryAddress: "", notes: ""
    });
    setIsCheckoutOpen(false);

    toast({
      title: "Order Placed Successfully!",
      description: `Order ${newOrder.orderNumber} has been confirmed.`,
    });
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-orange-100 text-orange-800",
      ready: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">Food Order</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant={activeView === "menu" ? "default" : "outline"}
                onClick={() => setActiveView("menu")}
                className="flex items-center space-x-2"
              >
                <Utensils className="w-4 h-4" />
                <span>Menu</span>
              </Button>
              <Button
                variant={activeView === "orders" ? "default" : "outline"}
                onClick={() => setActiveView("orders")}
                className="flex items-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>Orders</span>
              </Button>
              
              {cart.length > 0 && (
                <Button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="relative bg-orange-500 hover:bg-orange-600"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart ({cart.length})
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === "menu" ? (
          <div className="space-y-8">
            {/* Menu Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Delicious Menu</h2>
              <p className="text-gray-600">Fresh ingredients, expertly prepared</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search for dishes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {menuCategories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-orange-500 hover:bg-orange-600" : ""}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='150' y='100' text-anchor='middle' dy='.3em' fill='%236b7280'%3EFood Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-orange-500">${item.price}</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {item.preparationTime}
                      </div>
                    </div>
                    <Button 
                      onClick={() => addToCart(item)}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Orders View
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Preparing</CardTitle>
                  <ChefHat className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.filter(o => o.status === 'preparing').length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-sm text-gray-500">{order.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {order.orderType}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell className="font-medium">${order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsOrderDetailsOpen(true);
                              }}
                            >
                              View
                            </Button>
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
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="preparing">Preparing</SelectItem>
                                <SelectItem value="ready">Ready</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
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
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Cart Items */}
            <div>
              <h3 className="font-semibold mb-4">Your Order</h3>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.menuItem.name}</h4>
                      <p className="text-sm text-gray-600">${item.menuItem.price} each</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <span className="font-medium w-20 text-right">${item.totalPrice.toFixed(2)}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    placeholder="Your phone number"
                  />
                </div>
                <div>
                  <Label>Order Type</Label>
                  <Select value={customerInfo.orderType} onValueChange={(value: "dine-in" | "takeaway" | "delivery") => setCustomerInfo({...customerInfo, orderType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dine-in">Dine In</SelectItem>
                      <SelectItem value="takeaway">Takeaway</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {customerInfo.orderType === "dine-in" && (
                <div>
                  <Label>Table Number</Label>
                  <Input
                    value={customerInfo.tableNumber}
                    onChange={(e) => setCustomerInfo({...customerInfo, tableNumber: e.target.value})}
                    placeholder="Table number"
                  />
                </div>
              )}

              {customerInfo.orderType === "delivery" && (
                <div>
                  <Label>Delivery Address</Label>
                  <Input
                    value={customerInfo.deliveryAddress}
                    onChange={(e) => setCustomerInfo({...customerInfo, deliveryAddress: e.target.value})}
                    placeholder="Full delivery address"
                  />
                </div>
              )}

              <div>
                <Label>Special Instructions</Label>
                <Input
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                  placeholder="Any special requests..."
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                </div>
                {customerInfo.orderType === "delivery" && (
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>$3.99</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${(getCartTotal() + (getCartTotal() * 0.1) + (customerInfo.orderType === "delivery" ? 3.99 : 0)).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCheckout} className="bg-orange-500 hover:bg-orange-600">
                Place Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Number</Label>
                  <p className="font-medium">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <Label>Customer</Label>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <Label>Order Type</Label>
                  <Badge variant="outline" className="capitalize">
                    {selectedOrder.orderType}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Order Items</Label>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <span>${item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
