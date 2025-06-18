
import React from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  AlertTriangle, 
  BarChart3, 
  ShoppingCart, 
  FileText,
  ShoppingBag,
  Coffee,
  Settings,
  CreditCard
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "alerts", label: "Stock Alerts", icon: AlertTriangle },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "sales", label: "Sales", icon: ShoppingCart },
  { id: "sales-orders", label: "Sales Orders", icon: FileText },
  { id: "purchasing-orders", label: "Purchasing Orders", icon: ShoppingBag },
  { id: "fnb", label: "Food & Beverage", icon: Coffee },
  { id: "credit", label: "Credit Management", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">Hotel Celeste</h1>
        <p className="text-sm text-gray-600">Inventory System</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors",
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
