import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom"; // ⬅️ NEW
import { ProductTimeline } from "./ProductTimeline";

export function ConsumerDashboard() {
  const [searchParams] = useSearchParams(); // ⬅️ NEW
  const urlCode = searchParams.get("code"); // ⬅️ NEW

  const [qrCode, setQrCode] = useState(urlCode || ""); // ⬅️ initialize with URL param
  const [scannedProduct, setScannedProduct] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [productNotFound, setProductNotFound] = useState(false);

  const fetchProductByQrCode = useCallback(async (code) => {
    setProductNotFound(false);
    setFetchError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/products/qr/${code}`);
      if (response.status === 404) {
        setProductNotFound(true);
        return null;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      setFetchError(error.message);
      return null;
    }
  }, []);

  const updateScanCount = useCallback(async (code) => {
    try {
      await fetch(`${process.env.REACT_APP_BASE_URL}/api/products/update-scan-count`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode: code }),
      });
    } catch (error) {
      console.error("Scan count update failed:", error);
    }
  }, []);

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    if (!qrCode.trim()) return;

    setIsScanning(true);
    setScannedProduct(null);
    setProductNotFound(false);
    setFetchError(null);

    const fetchedProduct = await fetchProductByQrCode(qrCode);
    if (fetchedProduct) {
      await updateScanCount(qrCode);
      setScannedProduct(fetchedProduct);
    }
    setIsScanning(false);
  };

  const handleReset = () => {
    setQrCode("");
    setScannedProduct(null);
    setProductNotFound(false);
    setFetchError(null);
  };

  // 🔁 Auto-scan if code exists in URL
  useEffect(() => {
    if (urlCode) {
      handleScan();
    }
  }, [urlCode]);

  if (scannedProduct) {
    return <ProductTimeline product={scannedProduct} onBack={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🔍 Product Verification</h1>
          <p className="text-xl text-gray-600">
            Scan or enter a QR code to verify authenticity and trace the product journey
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">📱</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">QR Code Scanner</h2>
            <p className="text-gray-600 text-lg">
              Enter the product QR code to view blockchain-verified data
            </p>
          </div>

          <form onSubmit={handleScan} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">Product QR Code</label>
              <input
                type="text"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none text-center font-mono text-lg"
                placeholder="e.g., TRACE-1234567890-xyz"
              />
            </div>

            <button
              type="submit"
              disabled={!qrCode.trim() || isScanning}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none disabled:opacity-50 text-lg font-semibold"
            >
              {isScanning ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                  Verifying Product...
                </div>
              ) : (
                "🔍 Verify Product"
              )}
            </button>
          </form>

          {productNotFound && (
            <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
              <h3 className="text-lg font-semibold text-red-800">❌ Product Not Found</h3>
              <p className="text-red-700">
                QR code "{qrCode}" is not valid or the product was removed.
              </p>
            </div>
          )}

          {fetchError && (
            <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
              <h3 className="text-lg font-semibold text-red-800">❗ Error</h3>
              <p className="text-red-700">An error occurred: {fetchError}</p>
            </div>
          )}
        </div>

        {/* Optional Sample Buttons */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🧪 Try Sample Products</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setQrCode("TRACE-1234567890-sample1")}
              className="p-6 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 text-left"
            >
              🍎 <strong>Organic Apple</strong><br />
              <span className="font-mono text-sm">TRACE-1234567890-sample1</span>
            </button>

            <button
              onClick={() => setQrCode("TRACE-0987654321-sample2")}
              className="p-6 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 text-left"
            >
              ☕ <strong>Premium Coffee</strong><br />
              <span className="font-mono text-sm">TRACE-0987654321-sample2</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
