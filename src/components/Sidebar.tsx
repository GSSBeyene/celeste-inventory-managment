
import { 
  LayoutDashboard, 
  Package, 
  AlertTriangle, 
  BarChart3,
  Building2,
  Settings,
  Bell
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "alerts", label: "Stock Alerts", icon: AlertTriangle },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-gray-200 z-40">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Hotel Celeste</h1>
            <p className="text-sm text-gray-500">Inventory System</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="flex items-center space-x-2 mb-2">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-medium">System Status</span>
          </div>
          <p className="text-xs opacity-90">All systems operational</p>
          <div className="flex items-center space-x-1 mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
