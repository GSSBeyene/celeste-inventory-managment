
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Bed,
  Droplets,
  Coffee,
  Wrench,
  ShoppingCart,
  FileText,
  ShoppingBag,
  CreditCard,
  Settings,
  Lock,
  Key
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const [userRole, setUserRole] = useState<string>("staff");
  const [userPermissions, setUserPermissions] = useState({
    inventory: false,
    sales: false,
    reports: false,
    settings: false,
    purchasing: false,
    fnb: false,
    credit: false,
    alerts: false
  });

  useEffect(() => {
    // Get user role and permissions from localStorage
    const role = localStorage.getItem("userRole") || "staff";
    const permissions = localStorage.getItem("userPermissions");
    setUserRole(role);
    if (permissions) {
      setUserPermissions(JSON.parse(permissions));
    } else {
      // Default permissions based on role
      if (role === "admin") {
        setUserPermissions({ 
          inventory: true, 
          sales: true, 
          reports: true, 
          settings: true, 
          purchasing: true, 
          fnb: true, 
          credit: true, 
          alerts: true 
        });
      } else if (role === "manager") {
        setUserPermissions({ 
          inventory: true, 
          sales: true, 
          reports: true, 
          settings: false, 
          purchasing: true, 
          fnb: true, 
          credit: true, 
          alerts: true 
        });
      } else {
        setUserPermissions({ 
          inventory: true, 
          sales: false, 
          reports: false, 
          settings: false, 
          purchasing: false, 
          fnb: false, 
          credit: false, 
          alerts: true 
        });
      }
    }
  }, []);

  const stats = [
    {
      title: "Total Items",
      value: "2,847",
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      requiredPermission: "inventory"
    },
    {
      title: "Low Stock Items",
      value: "23",
      change: "-8%",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      requiredPermission: "alerts"
    },
    {
      title: "Room Occupancy",
      value: "87%",
      change: "+5%",
      icon: Bed,
      color: "text-green-600",
      bgColor: "bg-green-50",
      requiredPermission: null
    },
    {
      title: "Monthly Sales",
      value: "$12,450",
      change: "+18%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      requiredPermission: "sales"
    },
    {
      title: "Purchase Orders",
      value: "156",
      change: "+7%",
      icon: ShoppingBag,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      requiredPermission: "purchasing"
    },
    {
      title: "F&B Revenue",
      value: "$8,340",
      change: "+22%",
      icon: Coffee,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      requiredPermission: "fnb"
    },
    {
      title: "Credit Accounts",
      value: "89",
      change: "+5%",
      icon: CreditCard,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      requiredPermission: "credit"
    }
  ];

  const moduleAccess = [
    { 
      name: "Inventory Management", 
      permission: "inventory", 
      icon: Package, 
      description: "Manage stock levels and items",
      color: "bg-blue-500"
    },
    { 
      name: "Sales & Orders", 
      permission: "sales", 
      icon: ShoppingCart, 
      description: "Handle sales transactions",
      color: "bg-green-500"
    },
    { 
      name: "Purchasing Orders", 
      permission: "purchasing", 
      icon: ShoppingBag, 
      description: "Manage supplier orders",
      color: "bg-indigo-500"
    },
    { 
      name: "Food & Beverage", 
      permission: "fnb", 
      icon: Coffee, 
      description: "F&B inventory and sales",
      color: "bg-orange-500"
    },
    { 
      name: "Credit Management", 
      permission: "credit", 
      icon: CreditCard, 
      description: "Manage customer credit",
      color: "bg-emerald-500"
    },
    { 
      name: "Stock Alerts", 
      permission: "alerts", 
      icon: AlertTriangle, 
      description: "Monitor stock alerts",
      color: "bg-yellow-500"
    },
    { 
      name: "Reports & Analytics", 
      permission: "reports", 
      icon: FileText, 
      description: "View business insights",
      color: "bg-purple-500"
    },
    { 
      name: "System Settings", 
      permission: "settings", 
      icon: Settings, 
      description: "Configure system preferences",
      color: "bg-red-500"
    },
  ];

  const availableModules = [
    { name: "Stock Alerts", icon: AlertTriangle, permission: "alerts" },
    { name: "Sales Orders", icon: FileText, permission: "sales" },
    { name: "Purchasing Orders", icon: ShoppingBag, permission: "purchasing" },
    { name: "Food & Beverage", icon: Coffee, permission: "fnb" },
    { name: "Credit Management", icon: CreditCard, permission: "credit" },
    { name: "User Management", icon: Users, permission: "settings" },
    { name: "Password Management", icon: Key, permission: "settings" },
  ];

  const categories = [
    { name: "Room Amenities", count: 456, icon: Bed, color: "bg-blue-500" },
    { name: "Housekeeping", count: 892, icon: Droplets, color: "bg-green-500" },
    { name: "Minibar & F&B", count: 234, icon: Coffee, color: "bg-orange-500" },
    { name: "Maintenance", count: 167, icon: Wrench, color: "bg-purple-500" },
  ];

  const recentActivities = [
    { action: "Stock Added", item: "Bath Towels (Premium)", quantity: 50, time: "2 hours ago", permission: "inventory" },
    { action: "Low Stock Alert", item: "Shampoo Bottles", quantity: 8, time: "4 hours ago", permission: "alerts" },
    { action: "Sale Completed", item: "Room Service Order", quantity: -1, time: "6 hours ago", permission: "sales" },
    { action: "Purchase Order", item: "Coffee Supplies", quantity: 100, time: "8 hours ago", permission: "purchasing" },
    { action: "F&B Sale", item: "Restaurant Order #1234", quantity: -1, time: "10 hours ago", permission: "fnb" },
    { action: "Credit Added", item: "Customer Credit Top-up", quantity: 200, time: "12 hours ago", permission: "credit" },
    { action: "Stock Added", item: "Bed Sheets (King)", quantity: 30, time: "1 day ago", permission: "inventory" },
  ];

  const hasPermission = (permission: string | null) => {
    if (!permission) return true;
    return userRole === "admin" || userPermissions[permission as keyof typeof userPermissions];
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "manager": return "bg-blue-100 text-blue-800";
      case "staff": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-gray-600">Hotel Celeste Inventory Overview</p>
            <Badge className={getRoleBadgeColor(userRole)}>
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Role-based Access Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Your Access Level - All System Modules</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {moduleAccess.map((module, index) => {
              const Icon = module.icon;
              const hasAccess = hasPermission(module.permission);
              return (
                <div key={index} className={`p-4 rounded-lg border-2 ${hasAccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${hasAccess ? module.color : 'bg-gray-400'} rounded-lg flex items-center justify-center`}>
                      {hasAccess ? <Icon className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{module.name}</h3>
                      <p className="text-sm text-gray-600">{module.description}</p>
                      <Badge variant={hasAccess ? "default" : "destructive"} className="text-xs mt-1">
                        {hasAccess ? "Accessible" : "Restricted"}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards - filtered by permissions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.filter(stat => hasPermission(stat.requiredPermission)).map((stat, index) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>All Available Modules</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableModules.map((module, index) => {
              const Icon = module.icon;
              const hasAccess = hasPermission(module.permission);
              return (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${hasAccess ? 'hover:bg-gray-50 bg-white' : 'bg-gray-100'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hasAccess ? 'bg-blue-100' : 'bg-gray-300'}`}>
                      {hasAccess ? <Icon className="w-4 h-4 text-blue-600" /> : <Lock className="w-4 h-4 text-gray-500" />}
                    </div>
                    <span className={`font-medium ${hasAccess ? 'text-gray-900' : 'text-gray-500'}`}>{module.name}</span>
                  </div>
                  <Badge variant={hasAccess ? "default" : "secondary"} className="text-xs">
                    {hasAccess ? "Available" : "Restricted"}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activities - filtered by permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Recent Activities (All Modules)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.filter(activity => hasPermission(activity.permission)).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.action === 'Stock Added' ? 'bg-green-100 text-green-700' :
                      activity.action === 'Low Stock Alert' ? 'bg-orange-100 text-orange-700' :
                      activity.action === 'Sale Completed' ? 'bg-blue-100 text-blue-700' :
                      activity.action === 'Purchase Order' ? 'bg-indigo-100 text-indigo-700' :
                      activity.action === 'F&B Sale' ? 'bg-orange-100 text-orange-700' :
                      activity.action === 'Credit Added' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {activity.action}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 mt-1">{activity.item}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <div className={`text-lg font-bold ${activity.quantity > 0 ? 'text-green-600' : activity.quantity < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  {activity.quantity > 0 ? '+' : ''}{activity.quantity === -1 ? '✓' : activity.quantity}
                </div>
              </div>
            ))}
            {recentActivities.filter(activity => hasPermission(activity.permission)).length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Lock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No activities available for your current permissions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin-only Password Management Section */}
      {userRole === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-red-600" />
              <span>Admin Password Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Password Management Access</h3>
                  <p className="text-sm text-gray-600">As an admin, you can reset passwords for all users in the Settings module</p>
                  <Badge className="bg-red-100 text-red-800 text-xs mt-1">
                    Admin Only Feature
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Categories - only show if user has inventory permission */}
      {hasPermission("inventory") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Inventory Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{category.name}</span>
                        <p className="text-sm text-gray-600">{category.count} items</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
