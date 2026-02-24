import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { ShoppingCart, ArrowLeft, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = () => {
    const newInvoiceNo = `INV-${Date.now()}`;

    // ✅ Save invoice metadata only
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    invoices.push({
      invoiceNo: newInvoiceNo,
      date: new Date().toLocaleDateString(),
      total: totalPrice,
      items: cartItems,
    });
    localStorage.setItem("invoices", JSON.stringify(invoices));

    // ✅ Clear cart and show success message
    localStorage.removeItem("cart");
    setInvoiceNo(newInvoiceNo);
    setOrderPlaced(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-primary" />
            Checkout
          </h1>
        </div>

        {/* ✅ Success Banner */}
        {orderPlaced && (
          <div className="mb-6 p-4 rounded-lg border border-green-300 bg-green-50 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">
                🎉 Congratulations! Your order has been placed.
              </p>
              <p className="text-sm text-green-700">
                Invoice No: {invoiceNo} — You can download your invoice later
                from the Invoices module.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white border rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Bill Summary</h2>
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between border-b pb-2 mb-2"
            >
              <p>
                {item.name} (Qty: {item.quantity})
              </p>
              <p className="font-bold">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-primary">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="mt-6">
            <h3 className="font-bold mb-2">Payment Method</h3>
            <div className="flex items-center gap-2 p-4 border rounded-lg bg-gray-50">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="font-semibold">Cash on Delivery</span>
            </div>
          </div>

          {!orderPlaced && (
            <Button
              onClick={placeOrder}
              className="w-full mt-6 bg-gradient-to-r from-secondary to-emerald-600 text-white font-bold py-3 rounded-lg hover:shadow-lg"
            >
              Place Order
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}