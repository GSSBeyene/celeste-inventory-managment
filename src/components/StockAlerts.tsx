
import { AlertTriangle, Package, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Alert {
  id: string;
  item: string;
  currentStock: number;
  minStock: number;
  category: string;
  priority: "high" | "medium" | "low";
  lastCheck: string;
}

export const StockAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockAlerts = async () => {
      try {
        setLoading(true);
        
        // Fetch inventory items with their current stock levels
        const { data: stockData, error } = await supabase
          .from('stock_levels')
          .select(`
            current_quantity,
            last_updated,
            inventory_items!inner (
              id,
              name,
              category,
              reorder_level
            )
          `)
          .lt('current_quantity', 'inventory_items.reorder_level');

        if (error) throw error;

        const alertsData: Alert[] = stockData?.map((item: any) => {
          const currentStock = item.current_quantity;
          const minStock = item.inventory_items.reorder_level;
          const shortage = minStock - currentStock;
          
          let priority: "high" | "medium" | "low" = "low";
          if (shortage >= 10) priority = "high";
          else if (shortage >= 5) priority = "medium";

          return {
            id: item.inventory_items.id,
            item: item.inventory_items.name,
            currentStock,
            minStock,
            category: item.inventory_items.category,
            priority,
            lastCheck: new Date(item.last_updated).toLocaleString()
          };
        }) || [];

        setAlerts(alertsData);
      } catch (error) {
        console.error('Error fetching stock alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockAlerts();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 text-red-700 border-red-200";
      case "medium": return "bg-orange-50 text-orange-700 border-orange-200";
      case "low": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return "🔴";
      case "medium": return "🟡";
      case "low": return "🟢";
      default: return "⚪";
    }
  };

  const criticalAlerts = alerts.filter(alert => alert.priority === "high").length;
  const totalAlerts = alerts.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Alerts</h1>
          <p className="text-gray-600 mt-2">Monitor low stock items and critical inventory levels</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-medium">{criticalAlerts} Critical</span>
            </div>
          </div>
          <Button variant="outline">
            Mark All as Reviewed
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{totalAlerts}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{criticalAlerts}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Items to Reorder</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{alerts.filter(a => a.currentStock <= a.minStock).length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>Active Stock Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-4 ${getPriorityColor(alert.priority)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getPriorityIcon(alert.priority)}</span>
                    <h3 className="font-semibold text-gray-900">{alert.item}</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                      {alert.category}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Current Stock</p>
                      <p className="font-bold text-lg">{alert.currentStock} units</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Minimum Required</p>
                      <p className="font-semibold">{alert.minStock} units</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Shortage</p>
                      <p className="font-semibold text-red-600">
                        -{Math.max(0, alert.minStock - alert.currentStock)} units
                      </p>
                    </div>
                  </div>

                   <div className="flex items-center space-x-4 text-sm text-gray-600">
                     <div className="flex items-center space-x-1">
                       <MapPin className="w-4 h-4" />
                       <span>Warehouse</span>
                     </div>
                     <div className="flex items-center space-x-1">
                       <Clock className="w-4 h-4" />
                       <span>Last checked: {alert.lastCheck}</span>
                     </div>
                   </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Reorder Now
                  </Button>
                  <Button variant="outline" size="sm">
                    Update Stock
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    Dismiss
                  </Button>
                </div>
              </div>

              {/* Stock Level Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Stock Level</span>
                  <span>{Math.round((alert.currentStock / alert.minStock) * 100)}% of minimum</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      alert.currentStock <= alert.minStock * 0.5 ? 'bg-red-500' :
                      alert.currentStock <= alert.minStock ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min((alert.currentStock / alert.minStock) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
