import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Cart() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Load cart from localStorage or navigation state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      return JSON.parse(saved);
    }
    return location.state?.cartItems || [];
  });

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Calculate total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ Remove item from cart
  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // ✅ Update quantity
  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // ✅ Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/products")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-primary" />
            Your Cart
          </h1>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 text-lg font-semibold">
              Your cart is empty
            </p>
            <Button
              onClick={() => navigate("/products")}
              className="mt-4 bg-primary text-white font-semibold"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Price: ₹{item.price.toLocaleString("en-IN")}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <span className="px-3 font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2 text-red-600 border-red-300"
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Price + Clear Cart */}
            <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700">
                  Total
                </span>
                <span className="text-2xl font-bold text-primary">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex gap-4">
                {/* ✅ Updated Proceed to Checkout */}
                <Button
                  onClick={() => navigate("/checkout")}
                  className="flex-1 bg-gradient-to-r from-secondary to-emerald-600 text-white font-bold py-3 rounded-lg hover:shadow-lg"
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 border-red-300 font-semibold"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
