import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, DollarSign, Users, Clock, Calendar, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface CreditCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  roomNumber?: string;
  creditLimit: number;
  currentBalance: number;
  paidAmount: number;
  registrationDate: string;
  status: 'active' | 'suspended' | 'inactive';
}

interface CreditTransaction {
  id: string;
  customerId: string;
  customerName: string;
  serviceType: string;
  description: string;
  amount: number;
  type: 'charge' | 'payment' | 'credit';
  date: string;
  staff: string;
  paymentStatus: 'paid' | 'unpaid' | 'partial';
}

const serviceTypes = [
  'Restaurant & Bar',
  'Room Service',
  'Alcoholic Beverages',
  'Beer & Wine',
  'Food & Dining',
  'Coffee & Snacks',
  'Breakfast Service',
  'Lunch Service',
  'Dinner Service',
  'Room Accommodation',
  'Spa Services',
  'Laundry',
  'Mini Bar',
  'Conference Room',
  'Transportation',
  'Gift Shop',
  'Recreation Activities',
  'Swimming Pool',
  'Gym & Fitness',
  'Business Center',
  'Parking Services',
  'WiFi Premium',
  'Late Check-out',
  'Extra Cleaning',
  'Other'
];

export const CreditManagement = () => {
  const [customers, setCustomers] = useState<CreditCustomer[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      roomNumber: '101',
      creditLimit: 1000,
      currentBalance: 250,
      paidAmount: 150,
      registrationDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1-555-0456',
      roomNumber: '205',
      creditLimit: 1500,
      currentBalance: 750,
      paidAmount: 0,
      registrationDate: '2024-01-18',
      status: 'active'
    }
  ]);

  const [transactions, setTransactions] = useState<CreditTransaction[]>([
    {
      id: '1',
      customerId: '1',
      customerName: 'John Smith',
      serviceType: 'Restaurant & Bar',
      description: 'Dinner at hotel restaurant',
      amount: 85.50,
      type: 'charge',
      date: '2024-01-20',
      staff: 'Mike Johnson',
      paymentStatus: 'unpaid'
    },
    {
      id: '2',
      customerId: '1',
      customerName: 'John Smith',
      serviceType: 'Beer & Wine',
      description: 'Premium beer selection',
      amount: 35.00,
      type: 'charge',
      date: '2024-01-21',
      staff: 'Lisa Wong',
      paymentStatus: 'paid'
    },
    {
      id: '3',
      customerId: '2',
      customerName: 'Sarah Johnson',
      serviceType: 'Alcoholic Beverages',
      description: 'Cocktails at lobby bar',
      amount: 120.00,
      type: 'charge',
      date: '2024-01-21',
      staff: 'Anna Davis',
      paymentStatus: 'unpaid'
    }
  ]);

  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'customers' | 'transactions' | 'overview'>('overview');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedTransactionId, setSelectedTransactionId] = useState('');
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CreditCustomer | null>(null);
  const [customServiceType, setCustomServiceType] = useState('');

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    roomNumber: '',
    creditLimit: ''
  });

  const [newTransaction, setNewTransaction] = useState({
    customerId: '',
    serviceType: '',
    description: '',
    amount: '',
    type: 'charge' as 'charge' | 'payment' | 'credit',
    staff: ''
  });

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.creditLimit) {
      toast.error('Please fill in all required fields');
      return;
    }

    const customer: CreditCustomer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      roomNumber: newCustomer.roomNumber,
      creditLimit: parseFloat(newCustomer.creditLimit),
      currentBalance: 0,
      paidAmount: 0,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setCustomers([...customers, customer]);
    setNewCustomer({ name: '', email: '', phone: '', roomNumber: '', creditLimit: '' });
    setIsAddCustomerOpen(false);
    toast.success('Customer registered successfully');
  };

  const handleAddTransaction = () => {
    if (!newTransaction.customerId || !newTransaction.serviceType || !newTransaction.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const customer = customers.find(c => c.id === newTransaction.customerId);
    if (!customer) {
      toast.error('Customer not found');
      return;
    }

    const amount = parseFloat(newTransaction.amount);
    const transaction: CreditTransaction = {
      id: Date.now().toString(),
      customerId: newTransaction.customerId,
      customerName: customer.name,
      serviceType: newTransaction.serviceType,
      description: newTransaction.description,
      amount: amount,
      type: newTransaction.type,
      date: new Date().toISOString().split('T')[0],
      staff: newTransaction.staff,
      paymentStatus: newTransaction.type === 'payment' ? 'paid' : 'unpaid'
    };

    setTransactions([...transactions, transaction]);

    // Update customer balance
    const updatedCustomers = customers.map(c => {
      if (c.id === newTransaction.customerId) {
        let newBalance = c.currentBalance;
        let newPaidAmount = c.paidAmount;
        
        if (newTransaction.type === 'charge') {
          newBalance += amount;
        } else if (newTransaction.type === 'payment') {
          newPaidAmount += amount;
          newBalance = Math.max(0, newBalance - amount);
        } else if (newTransaction.type === 'credit') {
          newBalance -= amount;
        }
        
        return { ...c, currentBalance: Math.max(0, newBalance), paidAmount: newPaidAmount };
      }
      return c;
    });

    setCustomers(updatedCustomers);
    setNewTransaction({ customerId: '', serviceType: '', description: '', amount: '', type: 'charge', staff: '' });
    setIsAddTransactionOpen(false);
    toast.success('Transaction added successfully');
  };

  const handleMarkAsPaid = (transactionId: string) => {
    setTransactions(transactions.map(t => 
      t.id === transactionId 
        ? { ...t, paymentStatus: 'paid' as const }
        : t
    ));
    toast.success('Transaction marked as paid');
  };

  const handlePayment = () => {
    if (!paymentAmount || !selectedCustomer) {
      toast.error('Please enter payment amount');
      return;
    }

    const amount = parseFloat(paymentAmount);
    const customer = customers.find(c => c.id === selectedCustomer);
    
    if (!customer) {
      toast.error('Customer not found');
      return;
    }

    // Add payment transaction
    const paymentTransaction: CreditTransaction = {
      id: Date.now().toString(),
      customerId: selectedCustomer,
      customerName: customer.name,
      serviceType: 'Payment',
      description: `Payment received - $${amount}`,
      amount: amount,
      type: 'payment',
      date: new Date().toISOString().split('T')[0],
      staff: 'Front Desk',
      paymentStatus: 'paid'
    };

    setTransactions([...transactions, paymentTransaction]);

    // Update customer balance and paid amount
    const updatedCustomers = customers.map(c => {
      if (c.id === selectedCustomer) {
        return { 
          ...c, 
          currentBalance: Math.max(0, c.currentBalance - amount),
          paidAmount: c.paidAmount + amount
        };
      }
      return c;
    });

    setCustomers(updatedCustomers);
    setPaymentAmount('');
    setSelectedCustomer('');
    setIsPaymentDialogOpen(false);
    toast.success('Payment processed successfully');
  };

  const handleEditCustomer = (customer: CreditCustomer) => {
    setEditingCustomer(customer);
    setNewCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      roomNumber: customer.roomNumber || '',
      creditLimit: customer.creditLimit.toString()
    });
    setIsEditCustomerOpen(true);
  };

  const handleUpdateCustomer = () => {
    if (!editingCustomer || !newCustomer.name || !newCustomer.email || !newCustomer.creditLimit) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedCustomers = customers.map(c => 
      c.id === editingCustomer.id 
        ? {
            ...c,
            name: newCustomer.name,
            email: newCustomer.email,
            phone: newCustomer.phone,
            roomNumber: newCustomer.roomNumber,
            creditLimit: parseFloat(newCustomer.creditLimit)
          }
        : c
    );

    // Update customer name in transactions
    const updatedTransactions = transactions.map(t =>
      t.customerId === editingCustomer.id
        ? { ...t, customerName: newCustomer.name }
        : t
    );

    setCustomers(updatedCustomers);
    setTransactions(updatedTransactions);
    setNewCustomer({ name: '', email: '', phone: '', roomNumber: '', creditLimit: '' });
    setEditingCustomer(null);
    setIsEditCustomerOpen(false);
    toast.success('Customer updated successfully');
  };

  const handleDeleteCustomer = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    if (customer.currentBalance > 0) {
      toast.error('Cannot delete customer with outstanding balance');
      return;
    }

    const hasTransactions = transactions.some(t => t.customerId === customerId);
    if (hasTransactions) {
      toast.error('Cannot delete customer with transaction history');
      return;
    }

    setCustomers(customers.filter(c => c.id !== customerId));
    toast.success('Customer deleted successfully');
  };

  const handleServiceTypeChange = (value: string) => {
    if (value === 'Other') {
      setCustomServiceType('');
    }
    setNewTransaction({ ...newTransaction, serviceType: value });
  };

  const getServiceTypeValue = () => {
    if (newTransaction.serviceType === 'Other' && customServiceType) {
      return customServiceType;
    }
    return newTransaction.serviceType;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getTransactionTypeBadge = (type: string) => {
    const variants = {
      charge: 'bg-red-100 text-red-800',
      payment: 'bg-green-100 text-green-800',
      credit: 'bg-blue-100 text-blue-800'
    };
    return <Badge className={variants[type as keyof typeof variants]}>{type}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-red-100 text-red-800',
      partial: 'bg-yellow-100 text-yellow-800'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const totalCreditIssued = customers.reduce((sum, customer) => sum + customer.creditLimit, 0);
  const totalOutstanding = customers.reduce((sum, customer) => sum + customer.currentBalance, 0);
  const totalPaid = customers.reduce((sum, customer) => sum + customer.paidAmount, 0);
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credit Management</h1>
          <p className="text-muted-foreground">Manage customer credit accounts and service charges</p>
        </div>
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <DollarSign className="h-4 w-4 mr-2" />
              Process Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Process Customer Payment</DialogTitle>
              <DialogDescription>Record a payment from customer</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="paymentCustomer">Customer *</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.filter(c => c.currentBalance > 0).map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - Balance: ${customer.currentBalance.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentAmount">Payment Amount *</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter payment amount"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handlePayment}>Process Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'customers' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('customers')}
        >
          Customers
        </Button>
        <Button
          variant={activeTab === 'transactions' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </Button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Credit Issued</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalCreditIssued.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">${totalOutstanding.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCustomers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCustomers}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest credit transactions and charges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{transaction.customerName}</p>
                      <p className="text-sm text-muted-foreground">{transaction.serviceType} - {transaction.description}</p>
                      <div className="flex items-center gap-2">
                        {getTransactionTypeBadge(transaction.type)}
                        {getPaymentStatusBadge(transaction.paymentStatus)}
                        <span className="text-xs text-muted-foreground">{transaction.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${transaction.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">by {transaction.staff}</p>
                      {transaction.paymentStatus === 'unpaid' && transaction.type === 'charge' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-1"
                          onClick={() => handleMarkAsPaid(transaction.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Credit Customers</h2>
            <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Register Customer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Register New Credit Customer</DialogTitle>
                  <DialogDescription>Add a new customer to the credit system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Customer Name *</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roomNumber">Room Number</Label>
                    <Input
                      id="roomNumber"
                      value={newCustomer.roomNumber}
                      onChange={(e) => setNewCustomer({ ...newCustomer, roomNumber: e.target.value })}
                      placeholder="Enter room number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="creditLimit">Credit Limit *</Label>
                    <Input
                      id="creditLimit"
                      type="number"
                      value={newCustomer.creditLimit}
                      onChange={(e) => setNewCustomer({ ...newCustomer, creditLimit: e.target.value })}
                      placeholder="Enter credit limit"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddCustomer}>Register Customer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Customer Dialog */}
          <Dialog open={isEditCustomerOpen} onOpenChange={setIsEditCustomerOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Customer</DialogTitle>
                <DialogDescription>Update customer information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editName">Customer Name *</Label>
                  <Input
                    id="editName"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="editEmail">Email *</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="editPhone">Phone</Label>
                  <Input
                    id="editPhone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="editRoomNumber">Room Number</Label>
                  <Input
                    id="editRoomNumber"
                    value={newCustomer.roomNumber}
                    onChange={(e) => setNewCustomer({ ...newCustomer, roomNumber: e.target.value })}
                    placeholder="Enter room number"
                  />
                </div>
                <div>
                  <Label htmlFor="editCreditLimit">Credit Limit *</Label>
                  <Input
                    id="editCreditLimit"
                    type="number"
                    value={newCustomer.creditLimit}
                    onChange={(e) => setNewCustomer({ ...newCustomer, creditLimit: e.target.value })}
                    placeholder="Enter credit limit"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdateCustomer}>Update Customer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Credit Limit</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Paid Amount</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.roomNumber || 'N/A'}</TableCell>
                      <TableCell>${customer.creditLimit.toLocaleString()}</TableCell>
                      <TableCell className={customer.currentBalance > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                        ${customer.currentBalance.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-green-600 font-medium">
                        ${customer.paidAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {customer.currentBalance === 0 ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Paid</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600">
                            <XCircle className="h-4 w-4" />
                            <span className="text-sm">Unpaid</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell>{customer.registrationDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={customer.currentBalance > 0 || transactions.some(t => t.customerId === customer.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {customer.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCustomer(customer.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Credit Transactions</h2>
            <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Credit Transaction</DialogTitle>
                  <DialogDescription>Record a new service charge or payment</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customer">Customer *</Label>
                    <Select value={newTransaction.customerId} onValueChange={(value) => setNewTransaction({ ...newTransaction, customerId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.filter(c => c.status === 'active').map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - Room {customer.roomNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="transactionType">Transaction Type *</Label>
                    <Select value={newTransaction.type} onValueChange={(value: 'charge' | 'payment' | 'credit') => setNewTransaction({ ...newTransaction, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="charge">Service Charge</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="credit">Credit Adjustment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select value={newTransaction.serviceType} onValueChange={handleServiceTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service} value={service}>{service}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {newTransaction.serviceType === 'Other' && (
                    <div>
                      <Label htmlFor="customServiceType">Custom Service Type *</Label>
                      <Input
                        id="customServiceType"
                        value={customServiceType}
                        onChange={(e) => setCustomServiceType(e.target.value)}
                        placeholder="Enter custom service type"
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                      placeholder="Enter transaction description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="staff">Staff Member</Label>
                    <Input
                      id="staff"
                      value={newTransaction.staff}
                      onChange={(e) => setNewTransaction({ ...newTransaction, staff: e.target.value })}
                      placeholder="Enter staff member name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddTransaction}>Add Transaction</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice().reverse().map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.customerName}</TableCell>
                      <TableCell>{transaction.serviceType}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{getTransactionTypeBadge(transaction.type)}</TableCell>
                      <TableCell className={transaction.type === 'charge' ? 'text-red-600' : 'text-green-600'}>
                        {transaction.type === 'charge' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{getPaymentStatusBadge(transaction.paymentStatus)}</TableCell>
                      <TableCell>{transaction.staff}</TableCell>
                      <TableCell>
                        {transaction.paymentStatus === 'unpaid' && transaction.type === 'charge' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkAsPaid(transaction.id)}
                          >
                            Mark Paid
                          </Button>
                        )}
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
  );
};
