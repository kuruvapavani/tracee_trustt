import { useState, useEffect, useCallback } from "react";
// Removed Convex imports: useQuery, useMutation, api
import { TraceabilityStepForm } from "./TraceabilityStepForm"; // Assuming this component will be updated separately
import { QRCodeDisplay } from "./QRCodeDisplay";
import { toast } from "sonner"; // Assuming sonner toast library is still used

export function ProductDetails({ productId, onBack }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddStep, setShowAddStep] = useState(false);
  const [product, setProduct] = useState(null); // State to hold product data
  const [isLoading, setIsLoading] = useState(true); // Loading state for product fetch
  const [error, setError] = useState(null);       // Error state for product fetch

  // Function to fetch product data
  const fetchProduct = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming your backend endpoint for getting product by ID is /api/products/:id
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/products/${productId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setError(err.message);
      toast.error("Failed to load product: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [productId]); // Re-run if productId changes

  // Effect to fetch product on component mount or productId change
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  // Function to update product status
  const handleStatusUpdate = async (newStatus) => {
    if (!product) return; // Should not happen if UI is correctly rendered
    try {
      const token = localStorage.getItem("token");
      // Assuming your backend endpoint for updating product status is PATCH /api/products/:id/status
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/products/${product._id}/status`, {
        method: "PATCH", // Or PUT, depending on your API design
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // If successful, update the local product state
      setProduct((prevProduct) => ({ ...prevProduct, status: newStatus }));
      toast.success(`Product status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status: " + error.message);
    }
  };

  // Callback for when a new step is successfully added in TraceabilityStepForm
  const handleStepAdded = () => {
    setShowAddStep(false);
    fetchProduct(); // Re-fetch product data to update the timeline
    toast.success("New traceability step added!");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'recalled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "timeline", label: "Timeline", icon: "🕐" },
    { id: "qr", label: "QR Code", icon: "📱" },
    { id: "blockchain", label: "Blockchain", icon: "⛓️" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto mt-10">
        <p className="font-bold text-lg mb-2">Error loading product:</p>
        <p>{error}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    // This case would primarily be hit if productId is null initially, or after an error.
    // The isLoading and error checks above should cover most situations.
    return (
      <div className="text-center p-8 text-gray-600">
        <p>Product not found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Products
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="text-gray-600 mt-1">{product.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(product.status)}`}>
                {product.status === 'active' && '✅'}
                {product.status === 'completed' && '🏁'}
                {product.status === 'recalled' && '⚠️'}
                <span className="ml-1 capitalize">{product.status}</span>
              </span>
              
              <select
                value={product.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="recalled">Recalled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Product Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Product Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <p className="mt-1 text-gray-900">{product.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                    <p className="mt-1 text-gray-900">{product.manufacturer}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Batch Number</label>
                    <p className="mt-1 text-gray-900">{product.batchNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">QR Code</label>
                    <p className="mt-1 text-gray-900 font-mono text-sm">{product.qrCode}</p>
                  </div>
                </div>
              </div>

              {/* Recent Steps */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Recent Steps</h3>
                  <button
                    onClick={() => setShowAddStep(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    + Add Step
                  </button>
                </div>
                
                {product.steps && product.steps.length > 0 ? (
                  <div className="space-y-3">
                    {product.steps.slice(-3).map((step) => ( // Removed index from key as _id is unique
                      <div key={step._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm">
                            {step.stepType === 'farming' && '🌱'}
                            {step.stepType === 'processing' && '⚙️'}
                            {step.stepType === 'packaging' && '📦'}
                            {step.stepType === 'shipping' && '🚚'}
                            {step.stepType === 'retail' && '🏪'}
                            {step.stepType === 'quality_check' && '✅'}
                            {step.stepType === 'certification' && '📜'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 capitalize">
                            {step.stepType.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-600">{step.description}</p>
                          <p className="text-xs text-gray-500">
                            {step.location} • {new Date(step.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No traceability steps yet</p>
                )}
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Steps</span>
                    <span className="font-bold">{product.steps?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">QR Scans</span>
                    <span className="font-bold">{product.scannedCount || 0}</span> {/* Changed from product.qrMapping?.scannedCount */}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created</span>
                    <span className="font-bold">{new Date(product.createdAt).toLocaleDateString()}</span> {/* Changed from product._creationTime */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Product Timeline</h3>
            {product.steps && product.steps.length > 0 ? (
              <div className="space-y-6">
                {product.steps.map((step, index) => (
                  <div key={step._id} className="flex"> {/* Using step._id for key */}
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600">
                          {step.stepType === 'farming' && '🌱'}
                          {step.stepType === 'processing' && '⚙️'}
                          {step.stepType === 'packaging' && '📦'}
                          {step.stepType === 'shipping' && '🚚'}
                          {step.stepType === 'retail' && '🏪'}
                          {step.stepType === 'quality_check' && '✅'}
                          {step.stepType === 'certification' && '📜'}
                        </span>
                      </div>
                      {index < product.steps.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 capitalize mb-2">
                          {step.stepType.replace('_', ' ')}
                        </h4>
                        <p className="text-gray-700 mb-2">{step.description}</p>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>📍 {step.location}</p>
                          <p>🕐 {new Date(step.timestamp).toLocaleString()}</p>
                          {step.certification && <p>📜 {step.certification}</p>}
                          {step.blockchainTxHash && (
                            <p className="font-mono">⛓️ {step.blockchainTxHash}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No timeline data available</p>
            )}
          </div>
        )}

        {activeTab === "qr" && (
          <QRCodeDisplay qrCode={product.qrCode} productName={product.name} />
        )}

        {activeTab === "blockchain" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Blockchain Records</h3>
            {product.steps?.filter(step => step.blockchainTxHash).length > 0 ? (
              <div className="space-y-4">
                {product.steps
                  .filter(step => step.blockchainTxHash)
                  .map((step) => (
                    <div key={step._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold capitalize">
                          {step.stepType.replace('_', ' ')}
                        </h4>
                        <p className="text-gray-600 mb-2">{step.description}</p>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p className="font-mono">TX: {step.blockchainTxHash}</p>
                          {/* Assuming blockchain data is directly nested in the step, not a separate object */}
                          {step.blockNumber && <p>Block: #{step.blockNumber}</p>}
                          {step.gasUsed && <p>Gas Used: {step.gasUsed}</p>}
                          {step.network && <p>Network: {step.network}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No blockchain records yet</p>
            )}
          </div>
        )}
      </div>

      {/* Add Step Modal */}
      {showAddStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <TraceabilityStepForm
              productId={product.qrCode}
              onSuccess={handleStepAdded} // Changed onSuccess to trigger re-fetch
              onCancel={() => setShowAddStep(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}