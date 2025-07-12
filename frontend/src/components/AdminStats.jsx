export function AdminStats({ stats, products, isLoadingStats, isLoadingProducts }) {
  // Show loading spinner if stats are still loading
  if (isLoadingStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading admin statistics...</p>
      </div>
    );
  }

  // If stats are not loading but are null (e.g., failed to fetch), show an error or empty state
  if (!stats) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <p>Failed to load admin statistics. Please try refreshing the page.</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      color: "blue",
      change: "+12%" // This would ideally come from stats or be calculated
    },
    {
      title: "Traceability Steps",
      value: stats.totalSteps,
      icon: "📋",
      color: "green",
      change: "+8%"
    },
    {
      title: "QR Code Scans",
      value: stats.totalScans,
      icon: "📱",
      color: "purple",
      change: "+24%"
    },
    {
      title: "Active Products",
      value: stats.activeProducts,
      icon: "✅",
      color: "emerald",
      change: "+5%"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    };
    return colors[color] || colors.blue;
  };

  // Calculate product status counts based on the 'products' prop
  const activeProductCount = products.filter(p => p.status === 'active').length;
  const completedProductCount = products.filter(p => p.status === 'completed').length;
  const recalledProductCount = products.filter(p => p.status === 'recalled').length;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${getColorClasses(stat.color)}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {isLoadingStats ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                <p className="ml-3 text-gray-500">Loading activity...</p>
              </div>
            ) : stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">
                      {activity.action === 'CREATE_PRODUCT' ? '📦' :
                        activity.action === 'ADD_STEP' ? '📋' : '🔄'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.details}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>

        {/* Product Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Product Status</h3>
          <div className="space-y-4">
            {isLoadingProducts ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                <p className="ml-3 text-gray-500">Loading product status...</p>
              </div>
            ) : (
              [
                { status: 'active', label: 'Active', color: 'green', count: activeProductCount },
                { status: 'completed', label: 'Completed', color: 'blue', count: completedProductCount },
                { status: 'recalled', label: 'Recalled', color: 'red', count: recalledProductCount },
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-left transition-colors">
            <div className="text-2xl mb-2">📦</div>
            <div className="font-semibold">Create Product</div>
            <div className="text-sm opacity-90">Add new product to track</div>
          </button>
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-left transition-colors">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-semibold">Add Step</div>
            <div className="text-sm opacity-90">Record traceability step</div>
          </button>
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-left transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold">View Reports</div>
            <div className="text-sm opacity-90">Analytics & insights</div>
          </button>
        </div>
      </div>
    </div>
  );
}