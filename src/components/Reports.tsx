
import { BarChart3, TrendingUp, Download, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Reports = () => {
  const monthlyUsage = [
    { month: "Jan", usage: 12400, cost: 8200 },
    { month: "Feb", usage: 13200, cost: 8800 },
    { month: "Mar", usage: 11800, cost: 7900 },
    { month: "Apr", usage: 14100, cost: 9400 },
    { month: "May", usage: 15200, cost: 10100 },
    { month: "Jun", usage: 13800, cost: 9200 }
  ];

  const topCategories = [
    { category: "Housekeeping Supplies", usage: "45%", cost: "$4,200", trend: "+12%" },
    { category: "Room Amenities", usage: "32%", cost: "$2,980", trend: "+8%" },
    { category: "Minibar & F&B", usage: "15%", cost: "$1,400", trend: "-3%" },
    { category: "Maintenance Items", usage: "8%", cost: "$750", trend: "+15%" }
  ];

  const reports = [
    {
      title: "Monthly Inventory Report",
      description: "Comprehensive overview of inventory usage and costs",
      lastGenerated: "Today, 9:30 AM",
      format: "PDF",
      size: "2.4 MB"
    },
    {
      title: "Low Stock Analysis",
      description: "Analysis of items frequently running low on stock",
      lastGenerated: "Yesterday, 3:45 PM",
      format: "Excel",
      size: "1.2 MB"
    },
    {
      title: "Cost Trend Report",
      description: "Monthly cost trends and budget analysis",
      lastGenerated: "2 days ago",
      format: "PDF",
      size: "1.8 MB"
    },
    {
      title: "Supplier Performance",
      description: "Evaluation of supplier delivery times and quality",
      lastGenerated: "1 week ago",
      format: "PDF",
      size: "3.1 MB"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Analyze inventory trends and generate reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Select Date Range
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usage This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">$15,200</p>
                <p className="text-sm text-green-600 mt-1">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Daily Usage</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">$487</p>
                <p className="text-sm text-blue-600 mt-1">Consistent with target</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cost Per Room</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">$42.50</p>
                <p className="text-sm text-orange-600 mt-1">+3% from last month</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Efficiency Score</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">87%</p>
                <p className="text-sm text-green-600 mt-1">Above industry average</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Monthly Usage Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyUsage.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{month.month}</span>
                      <span className="text-sm text-gray-600">${month.cost.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(month.usage / 16000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Usage by Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{category.category}</span>
                    <span className={`text-sm font-medium ${
                      category.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {category.trend}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category.usage} of total usage</span>
                    <span className="font-semibold text-gray-900">{category.cost}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-purple-600" />
            <span>Available Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Last generated: {report.lastGenerated}</span>
                      <span>Format: {report.format}</span>
                      <span>Size: {report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Generate New
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
