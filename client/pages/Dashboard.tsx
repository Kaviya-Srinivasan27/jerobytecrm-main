import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout"; // ✅ Import your layout

// Interface for type safety
interface CurrentCustomer {
  id: string;
  name: string;
  email: string;
  customer_type: "product" | "service" | "both";
  isLoggedIn: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CurrentCustomer | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentCustomer");
    if (!stored) {
      navigate("/");
      return;
    }
    setCustomer(JSON.parse(stored));
  }, [navigate]);

  if (!customer) return null;

  return (
    <DashboardLayout> {/* ✅ Wrap everything in DashboardLayout */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {customer.name}!
        </h2>
        <p className="text-gray-600 mb-8">
          Manage your products, services, and orders from your live dashboard.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-xl p-6 bg-green-500 text-white shadow-md border-b-4 border-green-700">
            <div className="text-sm opacity-90 font-medium mb-1">Active Orders</div>
            <div className="text-4xl font-bold">2</div>
          </div>
          <div className="rounded-xl p-6 bg-amber-500 text-white shadow-md border-b-4 border-amber-700">
            <div className="text-sm opacity-90 font-medium mb-1">Service Bookings</div>
            <div className="text-4xl font-bold">1</div>
          </div>
          <div className="rounded-xl p-6 bg-rose-500 text-white shadow-md border-b-4 border-rose-700">
            <div className="text-sm opacity-90 font-medium mb-1">Pending Invoices</div>
            <div className="text-4xl font-bold">3</div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Recent Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New product arrived</p>
                <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Service booking confirmed</p>
                <p className="text-xs text-gray-500 mt-0.5">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
