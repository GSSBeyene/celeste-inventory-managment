
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
  FileText,
  Calendar,
  DollarSign
} from "lucide-react";

interface SalesOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  items: SalesOrderItem[];
  totalAmount: number;
  notes: string;
}

export const SalesOrders = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);

  const [newOrder, setNewOrder] = useState<Omit<SalesOrder, "id">>({
    orderNumber: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    orderDate: new Date().toISOString().split('T')[0],
    checkInDate: "",
    checkOutDate: "",
    roomType: "",
    status: "pending",
    items: [],
    totalAmount: 0,
    notes: ""
  });

  const [orders, setOrders] = useState<SalesOrder[]>([
    {
      id: "1",
      orderNumber: "SO-2024-001",
      customerName: "John Smith",
      customerEmail: "john@email.com",
      customerPhone: "+1234567890",
      orderDate: "2024-01-15",
      checkInDate: "2024-02-01",
      checkOutDate: "2024-02-05",
      roomType: "Deluxe Suite",
      status: "confirmed",
      items: [
        { id: "1", name: "Room Service", quantity: 2, price: 50 },
        { id: "2", name: "Spa Treatment", quantity: 1, price: 120 }
      ],
      totalAmount: 220,
      notes: "Anniversary celebration"
    }
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddOrder = () => {
    const order: SalesOrder = {
      ...newOrder,
      id: Date.now().toString(),
      orderNumber: `SO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`
    };

    setOrders([...orders, order]);
    setNewOrder({
      orderNumber: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      orderDate: new Date().toISOString().split('T')[0],
      checkInDate: "",
      checkOutDate: "",
      roomType: "",
      status: "pending",
      items: [],
      totalAmount: 0,
      notes: ""
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Sales order created successfully!"
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
      description: "Sales order updated successfully!"
    });
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter(order => order.id !== id));
    toast({
      title: "Success",
      description: "Sales order deleted successfully!"
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      confirmed: "default",
      completed: "default",
      cancelled: "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>;
  };

  const roomTypes = ["Standard Room", "Deluxe Room", "Suite", "Deluxe Suite", "Presidential Suite"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-gray-600">Manage hotel reservations and sales orders</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Sales Order</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Sales Order</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Name</Label>
                <Input
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label>Customer Email</Label>
                <Input
                  value={newOrder.customerEmail}
                  onChange={(e) => setNewOrder({...newOrder, customerEmail: e.target.value})}
                  placeholder="Enter customer email"
                />
              </div>
              <div>
                <Label>Customer Phone</Label>
                <Input
                  value={newOrder.customerPhone}
                  onChange={(e) => setNewOrder({...newOrder, customerPhone: e.target.value})}
                  placeholder="Enter customer phone"
                />
              </div>
              <div>
                <Label>Room Type</Label>
                <Select value={newOrder.roomType} onValueChange={(value) => setNewOrder({...newOrder, roomType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Check-in Date</Label>
                <Input
                  type="date"
                  value={newOrder.checkInDate}
                  onChange={(e) => setNewOrder({...newOrder, checkInDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Check-out Date</Label>
                <Input
                  type="date"
                  value={newOrder.checkOutDate}
                  onChange={(e) => setNewOrder({...newOrder, checkOutDate: e.target.value})}
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
                <Select value={newOrder.status} onValueChange={(value) => setNewOrder({...newOrder, status: value as "pending" | "confirmed" | "completed" | "cancelled"})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
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
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Orders</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'confirmed').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${orders.length > 0 ? (orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length).toFixed(0) : 0}
            </div>
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
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Room Type</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
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
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.roomType}</TableCell>
                  <TableCell>{order.checkInDate}</TableCell>
                  <TableCell>{order.checkOutDate}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="font-medium">${order.totalAmount}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sales Order</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Name</Label>
                <Input
                  value={editingOrder.customerName}
                  onChange={(e) => setEditingOrder({...editingOrder, customerName: e.target.value})}
                />
              </div>
              <div>
                <Label>Customer Email</Label>
                <Input
                  value={editingOrder.customerEmail}
                  onChange={(e) => setEditingOrder({...editingOrder, customerEmail: e.target.value})}
                />
              </div>
              <div>
                <Label>Customer Phone</Label>
                <Input
                  value={editingOrder.customerPhone}
                  onChange={(e) => setEditingOrder({...editingOrder, customerPhone: e.target.value})}
                />
              </div>
              <div>
                <Label>Room Type</Label>
                <Select value={editingOrder.roomType} onValueChange={(value) => setEditingOrder({...editingOrder, roomType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Check-in Date</Label>
                <Input
                  type="date"
                  value={editingOrder.checkInDate}
                  onChange={(e) => setEditingOrder({...editingOrder, checkInDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Check-out Date</Label>
                <Input
                  type="date"
                  value={editingOrder.checkOutDate}
                  onChange={(e) => setEditingOrder({...editingOrder, checkOutDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Total Amount ($)</Label>
                <Input
                  type="number"
                  value={editingOrder.totalAmount}
                  onChange={(e) => setEditingOrder({...editingOrder, totalAmount: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select 
                  value={editingOrder.status} 
                  onValueChange={(value) => setEditingOrder({...editingOrder, status: value as "pending" | "confirmed" | "completed" | "cancelled"})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Input
                  value={editingOrder.notes}
                  onChange={(e) => setEditingOrder({...editingOrder, notes: e.target.value})}
                />
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
