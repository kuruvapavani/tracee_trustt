import { useState, useEffect, useCallback } from "react";
// Removed Convex imports: useAction, useQuery, api

export function BlockchainMonitor() {
  const [blockchainStats, setBlockchainStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added state to handle errors

  // Replaced useAction with a plain async function for fetching stats
  const fetchBlockchainStats = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      // Make a GET request to your Node.js backend endpoint
      const response = await fetch("/api/blockchain-stats");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBlockchainStats(data);
    } catch (err) {
      console.error("Failed to fetch blockchain stats:", err);
      setError(err.message || "An unknown error occurred.");
      setBlockchainStats(null); // Clear stats on error
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array as fetchBlockchainStats doesn't depend on external props/state

  // useEffect to trigger the initial fetch and set up the polling interval
  useEffect(() => {
    fetchBlockchainStats(); // Initial fetch

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchBlockchainStats, 30000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [fetchBlockchainStats]); // Depend on the memoized fetchBlockchainStats function

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading blockchain data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <p>Error loading blockchain data: {error}</p>
      </div>
    );
  }

  // If data is not loading and there's no error, but stats are null, show a message
  if (!blockchainStats) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <p>No blockchain data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Blockchain Status */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">⛓️ Blockchain Status</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Network Healthy</span>
          </div>
        </div>

        {blockchainStats && ( // Ensure blockchainStats is not null before rendering
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="text-2xl mb-2">🔗</div>
              <div className="text-sm text-blue-600 font-medium">Network</div>
              <div className="text-lg font-bold text-blue-900">{blockchainStats.network}</div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm text-purple-600 font-medium">Latest Block</div>
              <div className="text-lg font-bold text-purple-900">#{blockchainStats.lastBlockNumber}</div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm text-green-600 font-medium">Avg Confirmation</div>
              <div className="text-lg font-bold text-green-900">{blockchainStats.averageConfirmationTime}</div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Statistics */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Transaction Statistics</h3>

          {blockchainStats && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Transactions</span>
                <span className="font-bold text-gray-900">{blockchainStats.totalTransactions.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Gas Used</span>
                <span className="font-bold text-gray-900">{blockchainStats.totalGasUsed}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Contract Address</span>
                <span className="font-mono text-sm text-gray-900">{blockchainStats.contractAddress}</span>
              </div>
            </div>
          )}
        </div>

        {/* Smart Contract Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">📜 Smart Contract</h3>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <div className="text-sm text-indigo-600 font-medium mb-2">Contract Functions</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>addTraceabilityStep()</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>getProductHistory()</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>verifyAuthenticity()</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="text-sm text-green-600 font-medium mb-2">Security Features</div>
              <div className="space-y-1 text-sm text-green-700">
                <div>✅ Immutable Records</div>
                <div>✅ Multi-signature Validation</div>
                <div>✅ Gas Optimization</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Blockchain Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">🔄 Recent Blockchain Activity</h3>

        {/* This section uses hardcoded data. In a real application, you'd fetch this from your backend as well. */}
        <div className="space-y-3">
          {blockchainStats?.recentActivity && blockchainStats.recentActivity.length > 0 ? (
            blockchainStats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
                  }`}></div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.type}</div>
                    <div className="text-sm text-gray-500 font-mono">{activity.hash}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{activity.time}</div>
                  <div className={`text-xs font-medium ${
                    activity.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent blockchain activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}