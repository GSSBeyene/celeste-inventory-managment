
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthPage from "./AuthPage";
import { PendingApprovalScreen } from "@/components/auth/PendingApprovalScreen";
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
import { UserApproval } from "@/components/UserApproval";

const Index = () => {
  const { user, isApproved, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  if (!user) {
    return <AuthPage />;
  }

  if (!isApproved) {
    return <PendingApprovalScreen />;
  }

  useEffect(() => {
    if (profile) {
      setCurrentUser({
        id: profile.user_id,
        name: profile.display_name || `${profile.first_name} ${profile.last_name}` || "Unknown User",
        email: user?.email || "",
        role: profile.role as "admin" | "manager" | "staff" | "viewer",
        status: "active",
        permissions: {
          canEditMenu: profile.role === "admin" || profile.role === "manager",
          canDeleteMenu: profile.role === "admin",
          canUpdateMenu: profile.role === "admin" || profile.role === "manager",
          canViewReports: true,
          canManageOrders: true
        },
        createdAt: new Date(profile.created_at).toLocaleDateString(),
        lastLogin: new Date().toLocaleDateString()
      });
    }
  }, [profile, user]);

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
      case "user-approval":
        return <UserApproval />;
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
