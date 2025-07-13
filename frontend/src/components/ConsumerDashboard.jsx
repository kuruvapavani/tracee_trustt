import { useState, useEffect, useCallback } from "react";
// Removed Convex imports: useQuery, useMutation, api
import { ProductTimeline } from "./ProductTimeline"; // Assuming this component is still relevant

export function ConsumerDashboard() {
  const [qrCode, setQrCode] = useState("");
  const [scannedProduct, setScannedProduct] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [fetchError, setFetchError] = useState(null); // To store any errors from fetching product
  const [productNotFound, setProductNotFound] = useState(false); // To indicate if product wasn't found

  // Function to fetch product by QR code
  const fetchProductByQrCode = useCallback(async (code) => {
    setProductNotFound(false); // Reset not found status
    setFetchError(null);      // Clear any previous fetch errors
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/products/qr/${code}`); // Your backend endpoint
      if (response.status === 404) {
        setProductNotFound(true);
        return null; // Product not found
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      setFetchError(error.message);
      return null;
    }
  }, []);

  // Function to update scan count
  const updateScanCount = useCallback(async (code) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/products/update-scan-count`, { // Your backend endpoint
        method: "POST", // Or PUT, depending on your API design
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrCode: code }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      // console.log("Scan count updated successfully");
    } catch (error) {
      console.error("Failed to update scan count:", error);
      // You might want to show a toast or message here, but it's not critical for the consumer UX
    }
  }, []);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!qrCode.trim()) return;

    setIsScanning(true);
    setScannedProduct(null); // Clear previously scanned product
    setProductNotFound(false); // Reset product not found status
    setFetchError(null);      // Clear any previous fetch errors

    // Simulate scanning delay (optional, remove in production if not needed)
    setTimeout(async () => {
      const fetchedProduct = await fetchProductByQrCode(qrCode);
      if (fetchedProduct) {
        await updateScanCount(qrCode); // Update scan count after successful fetch
        setScannedProduct(fetchedProduct);
      }
      setIsScanning(false);
    }, 1000); // 1-second delay
  };

  const handleReset = () => {
    setQrCode("");
    setScannedProduct(null);
    setProductNotFound(false);
    setFetchError(null);
  };

  if (scannedProduct) {
    return (
      <ProductTimeline
        product={scannedProduct}
        onBack={handleReset}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 Product Verification
          </h1>
          <p className="text-xl text-gray-600">
            Scan or enter a QR code to verify product authenticity and view its complete journey
          </p>
        </div>

        {/* Scanner Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">📱</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">QR Code Scanner</h2>
            <p className="text-gray-600 text-lg">
              Enter your product's QR code to access blockchain-verified information
            </p>
          </div>

          <form onSubmit={handleScan} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Product QR Code
              </label>
              <input
                type="text"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono text-lg"
                placeholder="Enter QR code (e.g., TRACE-1234567890-abc123def)"
              />
            </div>

            <button
              type="submit"
              disabled={!qrCode.trim() || isScanning}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold transition-all"
            >
              {isScanning ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Verifying Product...
                </div>
              ) : (
                "🔍 Verify Product Authenticity"
              )}
            </button>
          </form>

          {/* Error and Not Found Messages */}
          {productNotFound && qrCode && !isScanning && (
            <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-center">
                <div className="text-red-500 text-3xl mr-4">❌</div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Product Not Found</h3>
                  <p className="text-red-700 mt-1">
                    The QR code "{qrCode}" is not valid or the product may have been deactivated.
                    Please check the code and try again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {fetchError && qrCode && !isScanning && !productNotFound && (
            <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-center">
                <div className="text-red-500 text-3xl mr-4">❗</div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Error Verifying Product</h3>
                  <p className="text-red-700 mt-1">
                    An error occurred: {fetchError}. Please try again later.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sample Codes */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🧪 Try Sample Products
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Don't have a QR code? Try these sample products to see how traceability works:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setQrCode("TRACE-1234567890-sample1")}
              className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl hover:from-green-100 hover:to-green-200 transition-all text-left"
            >
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-3">🍎</span>
                <div>
                  <h4 className="font-semibold text-green-800">Organic Apples</h4>
                  <p className="text-green-600 text-sm">Farm to table traceability</p>
                </div>
              </div>
              <p className="font-mono text-sm text-green-700 bg-green-50 p-2 rounded">
                TRACE-1234567890-sample1
              </p>
            </button>

            <button
              onClick={() => setQrCode("TRACE-0987654321-sample2")}
              className="p-6 bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl hover:from-amber-100 hover:to-amber-200 transition-all text-left"
            >
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-3">☕</span>
                <div>
                  <h4 className="font-semibold text-amber-800">Premium Coffee</h4>
                  <p className="text-amber-600 text-sm">Colombian highlands origin</p>
                </div>
              </div>
              <p className="font-mono text-sm text-amber-700 bg-amber-50 p-2 rounded">
                TRACE-0987654321-sample2
              </p>
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-bold text-gray-900 mb-2">Blockchain Secured</h3>
            <p className="text-gray-600 text-sm">
              All data is immutably recorded on blockchain
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-bold text-gray-900 mb-2">Fully Transparent</h3>
            <p className="text-gray-600 text-sm">
              Complete journey visibility from origin
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="font-bold text-gray-900 mb-2">Authenticity Verified</h3>
            <p className="text-gray-600 text-sm">
              Tamper-proof certification guaranteed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}