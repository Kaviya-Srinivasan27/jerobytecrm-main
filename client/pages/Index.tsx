import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ✅ Updated API_BASE_URL directly to your Render link
const API_BASE_URL = "https://server-main-h3qo.onrender.com/api";

export default function Index() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    customerType: "product",
  });
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      // ✅ Requesting live authentication from Render
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      // ✅ Store the actual user data from Neon database for the session
      localStorage.setItem(
        "currentCustomer",
        JSON.stringify({
          ...data.user,
          isLoggedIn: true,
        })
      );

      navigate("/dashboard");
    } catch (err: any) {
      setLoginError(err.message || "Login failed. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    setIsLoading(true);

    if (formData.password.length < 6) {
      setRegisterError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      // ✅ Sending registration data to the Cloud
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          password: formData.password,
          customer_type: formData.customerType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setRegisterSuccess("Registration successful! You can now login.");
      
      // Switch to login view automatically
      setTimeout(() => {
        setIsLogin(true);
        setRegisterSuccess("");
      }, 2000);
    } catch (err: any) {
      setRegisterError(err.message || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity" 
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">JB</span>
            </div>
            <h1 className="text-xl font-bold hidden sm:block text-white">
              Jerobyte CRM
            </h1>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? "Login" : "Register"}
          </h1>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" type="text" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="customerType">Account Type</Label>
                  <select
                    id="customerType"
                    value={formData.customerType}
                    onChange={(e) => handleChange("customerType", e.target.value)}
                    className="w-full border rounded-lg p-2 bg-white text-sm"
                    required
                  >
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={formData.password} onChange={(e) => handleChange("password", e.target.value)} required />
            </div>

            {isLogin && loginError && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-xs border border-red-200">{loginError}</div>
            )}
            {!isLogin && registerError && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-xs border border-red-200">{registerError}</div>
            )}
            {!isLogin && registerSuccess && (
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-xs border border-green-200">{registerSuccess}</div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
              {isLoading ? "Connecting to Cloud..." : isLogin ? "Login" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setLoginError("");
                setRegisterError("");
                setRegisterSuccess("");
              }}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium underline underline-offset-4"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
