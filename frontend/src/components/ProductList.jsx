export function ProductList({ products, onSelectProduct }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'recalled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return '✅';
      case 'completed':
        return '🏁';
      case 'recalled':
        return '⚠️';
      default:
        return '❓';
    }
  };

  if (!products || products.length === 0) { // Added !products check for robustness
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
        <p className="text-gray-600 mb-6">
          Create your first product to start tracking its journey through the supply chain.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <p className="text-gray-600 mt-1">Manage your tracked products</p>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product._id} // Ensure this matches your MongoDB document ID field
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectProduct(product._id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    <span className="mr-1">{getStatusIcon(product.status)}</span>
                    {product.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{product.description}</p>
                
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="ml-2 text-gray-600">{product.category}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Manufacturer:</span>
                    <span className="ml-2 text-gray-600">{product.manufacturer}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Batch:</span>
                    <span className="ml-2 text-gray-600">{product.batchNumber}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-1">📱</span>
                    QR: {product.qrCode}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">📅</span>
                    {/* Updated from product._creationTime to product.createdAt */}
                    Created: {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="ml-4">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}