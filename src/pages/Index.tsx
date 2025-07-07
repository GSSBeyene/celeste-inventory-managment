
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { InventoryManager } from "@/components/InventoryManager";
import { StockAlerts } from "@/components/StockAlerts";
import { Reports } from "@/components/Reports";
import { Sales } from "@/components/Sales";
import { Settings } from "@/components/Settings";
import { SalesOrders } from "@/components/SalesOrders";
import { PurchasingOrders } from "@/components/PurchasingOrders";
import { FoodBeverage } from "@/components/FoodBeverage";
import { CreditManagement } from "@/components/CreditManagement";
import { UserManagement, User } from "@/components/UserManagement";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/auth");
    } else {
      // Set default admin user for demo purposes
      setCurrentUser({
        id: "1",
        name: "Admin User",
        email: "admin@celeste-hotel.com",
        role: "admin",
        status: "active",
        permissions: {
          canEditMenu: true,
          canDeleteMenu: true,
          canUpdateMenu: true,
          canViewReports: true,
          canManageOrders: true
        },
        createdAt: "2024-01-01",
        lastLogin: "2024-01-15 09:30"
      });
    }
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "inventory":
        return <InventoryManager />;
      case "alerts":
        return <StockAlerts />;
      case "reports":
        return <Reports />;
      case "sales":
        return <Sales />;
      case "sales-orders":
        return <SalesOrders />;
      case "purchasing-orders":
        return <PurchasingOrders />;
      case "fnb":
        return <FoodBeverage currentUser={currentUser} />;
      case "credit":
        return <CreditManagement />;
      case "users":
        return <UserManagement currentUser={currentUser} onUserUpdate={(users) => {
          // Update current user if they edited themselves
          const updatedCurrentUser = users.find(u => u.id === currentUser?.id);
          if (updatedCurrentUser) {
            setCurrentUser(updatedCurrentUser);
          }
        }} />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
