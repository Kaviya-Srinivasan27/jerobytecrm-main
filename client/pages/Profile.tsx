import { useState, useEffect } from "react";
import { ArrowLeft, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  type: "product" | "service" | "both";
  isLoggedIn: boolean;
}

export default function Profile() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Customer | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentCustomer");
    if (stored) {
      const data = JSON.parse(stored);
      setCustomer(data);
      setFormData(data);
    }
  }, []);

  const handleChange = (field: keyof Customer, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSave = () => {
    if (formData) {
      localStorage.setItem("currentCustomer", JSON.stringify(formData));
      setCustomer(formData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    }
  };

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your account information
            </p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-3xl">
                {customer.name.charAt(0)}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData?.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={!isEditing}
                className="h-10 rounded-lg border-gray-200 bg-gray-50 disabled:opacity-75"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData?.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={!isEditing}
                className="h-10 rounded-lg border-gray-200 bg-gray-50 disabled:opacity-75"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData?.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={!isEditing}
                className="h-10 rounded-lg border-gray-200 bg-gray-50 disabled:opacity-75"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Address
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Enter your address"
                value={formData?.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={!isEditing}
                className="h-10 rounded-lg border-gray-200 bg-gray-50 disabled:opacity-75"
              />
            </div>

            {/* Customer Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Account Type</Label>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900 font-medium">
                  {customer.type === "both"
                    ? "Product & Service Customer"
                    : customer.type === "product"
                    ? "Product Customer"
                    : "Service Customer"}
                </p>
                <p className="text-xs text-blue-800 mt-1">
                  {customer.type === "both"
                    ? "You have access to both product and service modules"
                    : customer.type === "product"
                    ? "You have access to products and product invoices"
                    : "You have access to service bookings and service invoices"}
                </p>
              </div>
            </div>

            {/* Member Since */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Member Since</Label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(customer);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
