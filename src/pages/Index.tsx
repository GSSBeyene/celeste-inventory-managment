
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
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile after authentication
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setCurrentUser(null);
          navigate("/auth");
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        setCurrentUser({
          id: profile.user_id,
          name: profile.display_name || `${profile.first_name} ${profile.last_name}`,
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
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return null;
  }

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
