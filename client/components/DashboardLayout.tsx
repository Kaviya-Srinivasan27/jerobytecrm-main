import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardNav from "./DashboardNav";
import { useNotifications } from "@/hooks/useNotifications";

interface CurrentCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  customer_type: "product" | "service" | "both"; 
  isLoggedIn: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CurrentCustomer | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  useEffect(() => {
    const stored = localStorage.getItem("currentCustomer");
    if (!stored) {
      navigate("/");
      return;
    }

    const customerData = JSON.parse(stored);
    
    if (!customerData.isLoggedIn) {
      navigate("/");
      return;
    }

    setCustomer(customerData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentCustomer");
    navigate("/");
  };

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-blue-600 font-medium animate-pulse">Syncing with cloud...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b sticky top-0 z-40 bg-blue-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shadow-inner">
              <span className="text-white font-bold">JB</span>
            </div>
            <h1 className="text-xl font-bold hidden sm:block text-white">Jerobyte CRM</h1>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg text-white">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                   <div className="p-4">
                     <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
                     <div className="space-y-2 max-h-60 overflow-y-auto">
                        {notifications.map(n => (
                          <div key={n.id} className="text-xs p-2 hover:bg-gray-50 rounded" onClick={() => markAsRead(n.id)}>
                            <p className="font-bold">{n.title}</p>
                            <p className="text-gray-500">{n.message}</p>
                          </div>
                        ))}
                     </div>
                   </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-white/30 text-white">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                {customer.name.charAt(0)}
              </div>
              <div className="text-sm">
                <p className="font-medium">{customer.name}</p>
                <p className="opacity-80 text-xs">{customer.email}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2 text-white">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* ✅ SIDEBAR UPDATE: Light Blue Shade Background */}
        <aside className="hidden md:block w-64 border-r border-gray-100 min-h-[calc(100vh-73px)] sticky top-[73px] bg-[#E8F1FD]">
          <DashboardNav customerType={customer.customer_type} />
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <aside className="md:hidden w-full border-b border-gray-100 bg-[#E8F1FD] absolute top-[73px] z-30 shadow-lg">
            <DashboardNav customerType={customer.customer_type} />
          </aside>
        )}

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
