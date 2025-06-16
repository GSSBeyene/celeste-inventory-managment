
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Bed,
  Droplets,
  Coffee,
  Wrench
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Dashboard = () => {
  const stats = [
    {
      title: "Total Items",
      value: "2,847",
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Low Stock Items",
      value: "23",
      change: "-8%",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Room Occupancy",
      value: "87%",
      change: "+5%",
      icon: Bed,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Monthly Usage",
      value: "$12,450",
      change: "+18%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const categories = [
    { name: "Room Amenities", count: 456, icon: Bed, color: "bg-blue-500" },
    { name: "Housekeeping", count: 892, icon: Droplets, color: "bg-green-500" },
    { name: "Minibar & F&B", count: 234, icon: Coffee, color: "bg-orange-500" },
    { name: "Maintenance", count: 167, icon: Wrench, color: "bg-purple-500" },
  ];

  const recentActivities = [
    { action: "Stock Added", item: "Bath Towels (Premium)", quantity: 50, time: "2 hours ago" },
    { action: "Low Stock Alert", item: "Shampoo Bottles", quantity: 8, time: "4 hours ago" },
    { action: "Item Used", item: "Coffee Pods", quantity: -25, time: "6 hours ago" },
    { action: "Stock Added", item: "Bed Sheets (King)", quantity: 30, time: "1 day ago" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Hotel Celeste Inventory Overview</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
        {/* Categories Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Inventory Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  <span className="text-gray-600 font-medium">{category.count} items</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Recent Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.action === 'Stock Added' ? 'bg-green-100 text-green-700' :
                      activity.action === 'Low Stock Alert' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {activity.action}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 mt-1">{activity.item}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <div className={`text-lg font-bold ${activity.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {activity.quantity > 0 ? '+' : ''}{activity.quantity}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
