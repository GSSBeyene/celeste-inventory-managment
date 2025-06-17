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
  ShoppingCart
} from "lucide-react";

interface PurchaseOrderItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface PurchasingOrder {
  id: string;
  orderNumber: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: "pending" | "approved" | "ordered" | "delivered" | "cancelled";
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  notes: string;
  department: string;
}

export const PurchasingOrders = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchasingOrder | null>(null);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [selectedOrderForItem, setSelectedOrderForItem] = useState<string | null>(null);

  const [newOrder, setNewOrder] = useState<Omit<PurchasingOrder, "id">>({
    orderNumber: "",
    supplierName: "",
    supplierEmail: "",
    supplierPhone: "",
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: "",
    status: "pending",
    items: [],
    subtotal: 0,
    tax: 0,
    totalAmount: 0,
    notes: "",
    department: ""
  });

  const [newItem, setNewItem] = useState<Omit<PurchaseOrderItem, "id" | "totalPrice">>({
    name: "",
    category: "",
    quantity: 1,
    unitPrice: 0
  });

  const [orders, setOrders] = useState<PurchasingOrder[]>([
    {
      id: "1",
      orderNumber: "PO-2024-001",
      supplierName: "Hotel Supplies Co.",
      supplierEmail: "orders@hotelsupplies.com",
      supplierPhone: "+1987654321",
      orderDate: "2024-01-15",
      expectedDeliveryDate: "2024-01-22",
      status: "approved",
      items: [
        { id: "1", name: "Bed Linens", category: "Housekeeping", quantity: 50, unitPrice: 25, totalPrice: 1250 },
        { id: "2", name: "Towels", category: "Housekeeping", quantity: 100, unitPrice: 15, totalPrice: 1500 }
      ],
      subtotal: 2750,
      tax: 275,
      totalAmount: 3025,
      notes: "Bulk order for Q1",
      department: "Housekeeping"
    }
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddOrder = () => {
    const order: PurchasingOrder = {
      ...newOrder,
      id: Date.now().toString(),
      orderNumber: `PO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`
    };

    setOrders([...orders, order]);
    setNewOrder({
      orderNumber: "",
      supplierName: "",
      supplierEmail: "",
      supplierPhone: "",
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: "",
      status: "pending",
      items: [],
      subtotal: 0,
      tax: 0,
      totalAmount: 0,
      notes: "",
      department: ""
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Purchase order created successfully!"
    });
  };

  const handleEditOrder = () => {
    if (!editingOrder) return;
    
    setOrders(orders.map(order => 
      order.id === editingOrder.id ? editingOrder : order
    ));
    setEditingOrder(null);
    setIsEditDialogOpen(false);
    toast({
      title: "Success",
      description: "Purchase order updated successfully!"
    });
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter(order => order.id !== id));
    toast({
      title: "Success",
      description: "Purchase order deleted successfully!"
    });
  };

  const handleAddItem = () => {
    if (!selectedOrderForItem || !newItem.name || newItem.quantity === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const item: PurchaseOrderItem = {
      ...newItem,
      id: Date.now().toString(),
      totalPrice: newItem.quantity * newItem.unitPrice
    };

    setOrders(orders.map(order => 
      order.id === selectedOrderForItem 
        ? { ...order, items: [...order.items, item] }
        : order
    ));

    setNewItem({
      name: "",
      category: "",
      quantity: 1,
      unitPrice: 0
    });
    setIsAddItemDialogOpen(false);
    setSelectedOrderForItem(null);

    toast({
      title: "Success",
      description: "Item added to order successfully!"
    });
  };

  const handleDeleteItem = (orderId: string, itemId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, items: order.items.filter(item => item.id !== itemId) }
        : order
    ));
    
    toast({
      title: "Success",
      description: "Item removed from order successfully!"
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      ordered: "default",
      delivered: "default",
      cancelled: "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>;
  };

  const departments = ["Housekeeping", "Kitchen", "Maintenance", "Front Desk", "Restaurant", "Spa", "General"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchasing Orders</h1>
          <p className="text-gray-600">Manage supplier orders and procurement</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Purchase Order</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Purchase Order</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Supplier Name</Label>
                <Input
                  value={newOrder.supplierName}
                  onChange={(e) => setNewOrder({...newOrder, supplierName: e.target.value})}
                  placeholder="Enter supplier name"
                />
              </div>
              <div>
                <Label>Supplier Email</Label>
                <Input
                  value={newOrder.supplierEmail}
                  onChange={(e) => setNewOrder({...newOrder, supplierEmail: e.target.value})}
                  placeholder="Enter supplier email"
                />
              </div>
              <div>
                <Label>Supplier Phone</Label>
                <Input
                  value={newOrder.supplierPhone}
                  onChange={(e) => setNewOrder({...newOrder, supplierPhone: e.target.value})}
                  placeholder="Enter supplier phone"
                />
              </div>
              <div>
                <Label>Department</Label>
                <Select value={newOrder.department} onValueChange={(value) => setNewOrder({...newOrder, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Order Date</Label>
                <Input
                  type="date"
                  value={newOrder.orderDate}
                  onChange={(e) => setNewOrder({...newOrder, orderDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Expected Delivery Date</Label>
                <Input
                  type="date"
                  value={newOrder.expectedDeliveryDate}
                  onChange={(e) => setNewOrder({...newOrder, expectedDeliveryDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Subtotal ($)</Label>
                <Input
                  type="number"
                  value={newOrder.subtotal}
                  onChange={(e) => setNewOrder({...newOrder, subtotal: parseFloat(e.target.value) || 0})}
                  placeholder="Enter subtotal"
                />
              </div>
              <div>
                <Label>Tax ($)</Label>
                <Input
                  type="number"
                  value={newOrder.tax}
                  onChange={(e) => setNewOrder({...newOrder, tax: parseFloat(e.target.value) || 0})}
                  placeholder="Enter tax amount"
                />
              </div>
              <div>
                <Label>Total Amount ($)</Label>
                <Input
                  type="number"
                  value={newOrder.totalAmount}
                  onChange={(e) => setNewOrder({...newOrder, totalAmount: parseFloat(e.target.value) || 0})}
                  placeholder="Enter total amount"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={newOrder.status} onValueChange={(value) => setNewOrder({...newOrder, status: value as "pending" | "approved" | "ordered" | "delivered" | "cancelled"})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="ordered">Ordered</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Input
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                  placeholder="Additional notes"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddOrder}>Create Order</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
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
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'ordered').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="ordered">Ordered</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.supplierName}</div>
                      <div className="text-sm text-gray-500">{order.supplierEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.department}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.expectedDeliveryDate}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="font-medium">${order.totalAmount}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrderForItem(order.id);
                          setIsAddItemDialogOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingOrder(order);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item to Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Item Name</Label>
              <Input
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="Enter item name"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                placeholder="Enter category"
              />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label>Unit Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem({...newItem, unitPrice: parseFloat(e.target.value) || 0})}
                placeholder="Enter unit price"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Purchase Order</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Supplier Name</Label>
                  <Input
                    value={editingOrder.supplierName}
                    onChange={(e) => setEditingOrder({...editingOrder, supplierName: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Supplier Email</Label>
                  <Input
                    value={editingOrder.supplierEmail}
                    onChange={(e) => setEditingOrder({...editingOrder, supplierEmail: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Supplier Phone</Label>
                  <Input
                    value={editingOrder.supplierPhone}
                    onChange={(e) => setEditingOrder({...editingOrder, supplierPhone: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Department</Label>
                  <Select value={editingOrder.department} onValueChange={(value) => setEditingOrder({...editingOrder, department: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select 
                    value={editingOrder.status} 
                    onValueChange={(value: "pending" | "approved" | "ordered" | "delivered" | "cancelled") => 
                      setEditingOrder({...editingOrder, status: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="ordered">Ordered</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Items List */}
              <div>
                <Label className="text-lg font-semibold">Order Items</Label>
                <div className="border rounded-lg mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editingOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unitPrice}</TableCell>
                          <TableCell className="font-medium">${item.totalPrice}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteItem(editingOrder.id, item.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditOrder}>Update Order</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
