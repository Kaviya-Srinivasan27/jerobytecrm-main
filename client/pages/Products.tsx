import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Star,
  Zap,
  Shield,
  Heart,
  Plus,
  Minus,
  ShoppingCart,
  ChevronLeft,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  rating: number;
  reviews: number;
  image_url: string;
  in_stock: boolean;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Products() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [customer, setCustomer] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = useMemo(() => ["All Products", "Battery", "CPU", "CCTV"], []);

  useEffect(() => {
    // ✅ Auth check and State persistence for Sidebar
    const storedUser = localStorage.getItem("currentCustomer");
    if (!storedUser) {
      navigate("/");
      return;
    }
    setCustomer(JSON.parse(storedUser));

    // Mock products data
    const mockProducts: Product[] = [
      {
        product_id: 1,
        name: "Luminous Inverter Battery 150Ah",
        description: "High-performance tubular battery with 5-year warranty.",
        price: 12500,
        original_price: 15000,
        category: "Battery",
        rating: 4.5,
        reviews: 128,
        image_url: "https://via.placeholder.com/400?text=Battery",
        in_stock: true,
      },
      {
        product_id: 2,
        name: "Intel Core i9-13900K Processor",
        description: "24-core flagship desktop processor. Boost up to 5.8GHz.",
        price: 58900,
        original_price: 65000,
        category: "CPU",
        rating: 4.9,
        reviews: 89,
        image_url: "https://via.placeholder.com/400?text=CPU",
        in_stock: true,
      },
      {
        product_id: 3,
        name: "Hikvision 4K CCTV Camera Set",
        description: "8-channel NVR with 4 bullet cameras. Night vision up to 30m.",
        price: 24500,
        original_price: 28000,
        category: "CCTV",
        rating: 4.6,
        reviews: 78,
        image_url: "https://via.placeholder.com/400?text=CCTV",
        in_stock: true,
      },
    ];
    setProducts(mockProducts);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory || selectedCategory === "All Products") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, products]);

  const increaseQuantity = (productId: string) => {
    setQuantities(prev => ({ ...prev, [productId]: (prev[productId] || 1) + 1 }));
  };

  const decreaseQuantity = (productId: string) => {
    setQuantities(prev => ({ ...prev, [productId]: Math.max(1, (prev[productId] || 1) - 1) }));
  };

  const addToCart = (product: Product) => {
    const qty = quantities[product.product_id.toString()] || 1;
    const existing = cart.find(item => item.productId === product.product_id.toString());
    
    if (existing) {
      setCart(cart.map(item => item.productId === product.product_id.toString() 
        ? { ...item, quantity: item.quantity + qty } : item));
    } else {
      setCart([...cart, { productId: product.product_id.toString(), name: product.name, price: product.price, quantity: qty }]);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Cloud Catalog...</div>;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Navigation Breadcrumb */}
        <div 
          className="flex items-center gap-2 text-blue-600 mb-6 cursor-pointer hover:underline" 
          onClick={() => navigate("/dashboard")}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium text-gray-900">Back to Dashboard</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
              <Package className="w-8 h-8" /> Product Catalog
            </h1>
            <p className="text-gray-500 mt-1">Explore our premium inventory synced from the cloud.</p>
          </div>
          {cart.length > 0 && (
            <Button onClick={() => navigate("/cart")} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg">
              <ShoppingCart className="w-5 h-5" /> View Cart ({cart.length})
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === "All Products" ? null : cat)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${
                      (selectedCategory === cat || (cat === "All Products" && !selectedCategory))
                        ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.product_id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group">
                  <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                    <Package className="w-12 h-12 text-gray-300 group-hover:scale-110 transition-transform" />
                    {!product.in_stock && <div className="absolute inset-0 bg-white/60 flex items-center justify-center font-bold text-red-600">Out of Stock</div>}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500 my-2">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm text-gray-500 font-medium">{product.rating} ({product.reviews} reviews)</span>
                    </div>
                    
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-bold text-blue-600">₹{product.price.toLocaleString("en-IN")}</span>
                      {product.original_price && <span className="text-sm text-gray-400 line-through">₹{product.original_price.toLocaleString("en-IN")}</span>}
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center border rounded-lg">
                        <Button variant="ghost" size="icon" onClick={() => decreaseQuantity(product.product_id.toString())}><Minus className="w-4 h-4" /></Button>
                        <span className="w-8 text-center font-bold">{quantities[product.product_id.toString()] || 1}</span>
                        <Button variant="ghost" size="icon" onClick={() => increaseQuantity(product.product_id.toString())}><Plus className="w-4 h-4" /></Button>
                      </div>
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                        onClick={() => addToCart(product)}
                        disabled={!product.in_stock}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
