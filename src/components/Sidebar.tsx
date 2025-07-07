
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
  CreditCard,
  UserCheck
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
  { id: "users", label: "User Management", icon: UserCheck },
  { id: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-cyan-600 to-cyan-700 shadow-lg">
      <div className="p-6 bg-cyan-800">
        <div className="flex items-center space-x-3 mb-2">
          <img 
            src="/lovable-uploads/7698a8dd-6565-4a7b-8c80-f6667e10bf65.png" 
            alt="Hotel Celeste Logo" 
            className="w-10 h-10 bg-white p-1 rounded-lg shadow-md"
          />
          <div>
            <h1 className="text-xl font-bold text-white">Hotel Celeste</h1>
            <p className="text-sm text-cyan-100">Inventory System</p>
          </div>
        </div>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-all duration-200",
                activeTab === item.id
                  ? "bg-white text-cyan-700 border-r-4 border-cyan-300 shadow-md"
                  : "text-cyan-100 hover:bg-cyan-600 hover:text-white hover:shadow-sm"
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
