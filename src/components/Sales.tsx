
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
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");

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

  const recentSales = [
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
  ];

  const topSellingItems = [
    { name: "Coffee Pods", sold: 156, revenue: 468.00, trend: "+12%" },
    { name: "Bath Towels", sold: 89, revenue: 2001.00, trend: "+8%" },
    { name: "Minibar Snacks", sold: 134, revenue: 670.00, trend: "+15%" },
    { name: "Bed Sheets", sold: 45, revenue: 3825.00, trend: "+5%" },
    { name: "Cleaning Supplies", sold: 78, revenue: 936.00, trend: "+18%" }
  ];

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
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Sale
          </Button>
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
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">${sale.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{sale.date} {sale.time}</p>
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
    </div>
  );
};
