import { useState, useEffect, useCallback } from "react";
import { ProductForm } from "./ProductForm";
import { ProductList } from "./ProductList";
import { ProductDetails } from "./ProductDetails";
import { AdminStats } from "./AdminStats";
import { BlockchainMonitor } from "./BlockchainMonitor";
import { toast } from "sonner"; // Assuming you're still using sonner for toasts

export function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // --- Data Fetching Functions ---

  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/products/my-products`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
      console.log("Products " ,data);
      
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products: " + error.message);
      setProducts([]); // Clear products on error
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const fetchAdminStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/stats`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAdminStats(data);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      toast.error("Failed to load admin stats: " + error.message);
      setAdminStats(null);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // --- Effects for Initial Data Load ---

  useEffect(() => {
    fetchProducts();
    fetchAdminStats();
  }, [fetchProducts, fetchAdminStats]);

  // --- API Call Functions ---

  const createSampleData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/sample-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create sample data");
      }
      toast.success(result.message);
      fetchProducts();
      fetchAdminStats();
    } catch (error) {
      toast.error("Failed to create sample data: " + error.message);
    }
  };

  const setUserRole = async (roleData) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/user-roles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(roleData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to set user role");
      }
    } catch (error) {
      console.error("Failed to set user role:", error);
    }
  };

  useEffect(() => {
    if (user && !user.role) {
      setUserRole({
        userId: user._id,
        role: "admin",
        companyName: user.companyName || "My Company",
        industry: "Technology",
      });
    }
  }, [user]);

  const handleCreateSampleData = async () => {
    await createSampleData();
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "products", label: "Products", icon: "📦" },
    { id: "create", label: "Create Product", icon: "➕" },
    { id: "blockchain", label: "Blockchain", icon: "⛓️" },
  ];

  if (selectedProductId) {
    return (
      <ProductDetails
        productId={selectedProductId}
        onBack={() => {
          setSelectedProductId(null);
          fetchProducts();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.name || user?.email}
                {user?.companyName && ` • ${user.companyName}`}
              </p>
            </div>

            {!isLoadingProducts && products.length === 0 && (
              <button
                onClick={handleCreateSampleData}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                🚀 Create Sample Data
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <AdminStats
            stats={adminStats}
            products={products}
            isLoadingStats={isLoadingStats}
            isLoadingProducts={isLoadingProducts}
          />
        )}

        {activeTab === "products" && (
          <div className="bg-white rounded-lg shadow">
            {isLoadingProducts ? (
              <div className="p-6 text-center text-gray-500">
                Loading products...
              </div>
            ) : (
              <ProductList
                products={products}
                onSelectProduct={setSelectedProductId}
                onProductActionSuccess={fetchProducts}
              />
            )}
          </div>
        )}

        {activeTab === "create" && (
          <div className="bg-white rounded-lg shadow">
            <ProductForm
              onSuccess={() => {
                setActiveTab("products");
                fetchProducts();
                fetchAdminStats();
              }}
            />
          </div>
        )}

        {activeTab === "blockchain" && <BlockchainMonitor />}
      </div>
    </div>
  );
}
