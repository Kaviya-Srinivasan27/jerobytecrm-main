import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Wrench, FileText, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardNavProps {
  // ✅ Matches the specific data field from your Neon database
  customerType?: "product" | "service" | "both";
}

export default function DashboardNav({ customerType }: DashboardNavProps) {
  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
      show: true,
    },
    {
      label: "Product Catalog",
      href: "/products",
      icon: ShoppingCart,
      // ✅ Now correctly shows for 'product' or 'both' cloud users
      show: customerType === "product" || customerType === "both",
    },
    {
      label: "Service Booking",
      href: "/services",
      icon: Wrench,
      // ✅ Now correctly shows for 'service' or 'both' cloud users
      show: customerType === "service" || customerType === "both",
    },
    {
      label: "Invoice & Reports",
      href: "/invoices",
      icon: FileText,
      show: true,
    },
  ];

  return (
    <nav className="p-4 md:p-6 space-y-2">
      {navItems.map((item) => {
        // ✅ Only render items that should be shown
        if (!item.show) return null;

        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm",
              isActive
                ? "bg-blue-600 text-white shadow-md translate-x-1"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
