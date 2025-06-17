import { 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Package,
  Users,
  Plus,
  Filter,
  Download,
  Search,
  Edit,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface SaleItem {
  name: string;
  qty: number;
  price: number;
}

interface Sale {
  id: string;
  customer: string;
  items: SaleItem[];
  total: number;
  status: "completed" | "pending" | "cancelled";
  date: string;
  time: string;
}

export const Sales = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [newSale, setNewSale] = useState({
    customer: "",
    items: [{ name: "", qty: 1, price: 0 }],
    status: "pending" as "completed" | "pending" | "cancelled"
  });

  const salesStats = [
    {
      title: "Total Revenue",
      value: "$89,450",
      change: "+23%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Today's Sales",
      value: "$3,240",
      change: "+8%",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Items Sold",
      value: "1,247",
      change: "+15%",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Active Customers",
      value: "156",
      change: "+12%",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const [recentSales, setRecentSales] = useState<Sale[]>([
    {
      id: "S001",
      customer: "Room 301",
      items: [
        { name: "Premium Bath Towels", qty: 2, price: 45.00 },
        { name: "Minibar Snacks", qty: 5, price: 25.00 }
      ],
      total: 70.00,
      status: "completed",
      date: "2024-06-16",
      time: "14:30"
    },
    {
      id: "S002",
      customer: "Room 205",
      items: [
        { name: "Coffee Pods", qty: 10, price: 15.00 },
        { name: "Bed Sheets (King)", qty: 1, price: 85.00 }
      ],
      total: 100.00,
      status: "completed",
      date: "2024-06-16",
      time: "13:15"
    },
    {
      id: "S003",
      customer: "Housekeeping Dept",
      items: [
        { name: "Cleaning Supplies", qty: 20, price: 120.00 },
        { name: "Vacuum Bags", qty: 8, price: 24.00 }
      ],
      total: 144.00,
      status: "pending",
      date: "2024-06-16",
      time: "12:45"
    },
    {
      id: "S004",
      customer: "Room 412",
      items: [
        { name: "Room Amenities Kit", qty: 3, price: 35.00 }
      ],
      total: 105.00,
      status: "completed",
      date: "2024-06-16",
      time: "11:20"
    }
  ]);

  const topSellingItems = [
    { name: "Coffee Pods", sold: 156, revenue: 468.00, trend: "+12%" },
    { name: "Bath Towels", sold: 89, revenue: 2001.00, trend: "+8%" },
    { name: "Minibar Snacks", sold: 134, revenue: 670.00, trend: "+15%" },
    { name: "Bed Sheets", sold: 45, revenue: 3825.00, trend: "+5%" },
    { name: "Cleaning Supplies", sold: 78, revenue: 936.00, trend: "+18%" }
  ];

  const handleExportSales = () => {
    try {
      // Create CSV content
      const headers = ['Sale ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Time'];
      const csvContent = [
        headers.join(','),
        ...recentSales.map(sale => [
          sale.id,
          `"${sale.customer}"`,
          `"${sale.items.map(item => `${item.name} (${item.qty}x$${item.price})`).join('; ')}"`,
          sale.total.toFixed(2),
          sale.status,
          sale.date,
          sale.time
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `sales_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Sales data exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export sales data.",
        variant: "destructive",
      });
    }
  };

  const handleAddSale = () => {
    if (!newSale.customer || newSale.items.some(item => !item.name || item.qty === 0)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const total = newSale.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const sale: Sale = {
      id: `S${String(Date.now()).slice(-3)}`,
      customer: newSale.customer,
      items: newSale.items,
      total,
      status: newSale.status,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    };

    setRecentSales([sale, ...recentSales]);
    setNewSale({
      customer: "",
      items: [{ name: "", qty: 1, price: 0 }],
      status: "pending" as "completed" | "pending" | "cancelled"
    });
    setIsAddSaleOpen(false);

    toast({
      title: "Success",
      description: "Sale added successfully.",
    });
  };

  const handleUpdateSale = (saleId: string, updates: Partial<Sale>) => {
    setRecentSales(recentSales.map(sale => 
      sale.id === saleId ? { ...sale, ...updates } : sale
    ));
    
    toast({
      title: "Success",
      description: "Sale updated successfully.",
    });
  };

  const handleDeleteSale = (saleId: string) => {
    setRecentSales(recentSales.filter(sale => sale.id !== saleId));
    toast({
      title: "Success",
      description: "Sale deleted successfully.",
    });
  };

  const addItemToSale = () => {
    setNewSale({
      ...newSale,
      items: [...newSale.items, { name: "", qty: 1, price: 0 }]
    });
  };

  const removeItemFromSale = (index: number) => {
    setNewSale({
      ...newSale,
      items: newSale.items.filter((_, i) => i !== index)
    });
  };

  const updateSaleItem = (index: number, field: string, value: any) => {
    const updatedItems = newSale.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setNewSale({ ...newSale, items: updatedItems });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-600 mt-2">Track sales and revenue for Hotel Celeste</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleExportSales}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Sale</DialogTitle>
                <DialogDescription>
                  Create a new sale record for a customer.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer">Customer</Label>
                  <Input
                    id="customer"
                    value={newSale.customer}
                    onChange={(e) => setNewSale({...newSale, customer: e.target.value})}
                    placeholder="e.g., Room 301, Guest Name"
                  />
                </div>
                <div>
                  <Label>Items</Label>
                  <div className="space-y-3">
                    {newSale.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5">
                          <Input
                            placeholder="Item name"
                            value={item.name}
                            onChange={(e) => updateSaleItem(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={item.qty}
                            onChange={(e) => updateSaleItem(index, 'qty', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) => updateSaleItem(index, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          {newSale.items.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItemFromSale(index)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addItemToSale}
                    className="mt-2"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Item
                  </Button>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={newSale.status} onValueChange={(value) => setNewSale({...newSale, status: value as "completed" | "pending" | "cancelled"})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddSaleOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSale}>Add Sale</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <span>Recent Sales</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search sales..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSales.map((sale) => (
              <div key={sale.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">#{sale.id}</span>
                    <Badge className={getStatusColor(sale.status)}>
                      {sale.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">${sale.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{sale.date} {sale.time}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSale(sale)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSale(sale.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-sm text-gray-600 mb-1">Customer: <span className="font-medium">{sale.customer}</span></p>
                  <div className="space-y-1">
                    {sale.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.name} x{item.qty}</span>
                        <span className="text-gray-900 font-medium">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Top Selling Items</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topSellingItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">{item.sold} sold</span>
                    <span className={`text-sm ${item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {item.trend}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${item.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Edit Sale Dialog */}
      {editingSale && (
        <Dialog open={!!editingSale} onOpenChange={() => setEditingSale(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Sale</DialogTitle>
              <DialogDescription>
                Update sale information and status.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Customer</Label>
                <Input
                  value={editingSale.customer}
                  onChange={(e) => setEditingSale({...editingSale, customer: e.target.value})}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select 
                  value={editingSale.status} 
                  onValueChange={(value: "completed" | "pending" | "cancelled") => 
                    setEditingSale({...editingSale, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingSale(null)}>
                Cancel
              </Button>
              <Button onClick={() => {
                handleUpdateSale(editingSale.id, editingSale);
                setEditingSale(null);
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
