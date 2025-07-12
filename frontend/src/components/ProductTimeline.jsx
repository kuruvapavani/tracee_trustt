import { useState } from "react";

export function ProductTimeline({ product, onBack }) {
  const [selectedStep, setSelectedStep] = useState(null);

  const getStepIcon = (stepType) => {
    const icons = {
      farming: '🌱',
      processing: '⚙️',
      packaging: '📦',
      shipping: '🚚',
      retail: '🏪',
      quality_check: '✅',
      certification: '📜'
    };
    return icons[stepType] || '📋';
  };

  const getStepColor = (stepType) => {
    const colors = {
      farming: 'bg-green-100 border-green-300',
      processing: 'bg-blue-100 border-blue-300',
      packaging: 'bg-purple-100 border-purple-300',
      shipping: 'bg-yellow-100 border-yellow-300',
      retail: 'bg-pink-100 border-pink-300',
      quality_check: 'bg-emerald-100 border-emerald-300',
      certification: 'bg-indigo-100 border-indigo-300'
    };
    return colors[stepType] || 'bg-gray-100 border-gray-300';
  };

  // Guard clause for when product is not yet loaded or is null/undefined
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <p className="text-xl text-gray-700">Loading product details...</p>
          <button
            onClick={onBack}
            className="mt-4 text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            ← Back to Scanner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
          >
            ← Back to Scanner
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ✅ Product Verified
          </h1>
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Manufacturer:</span>
                <span className="ml-2 text-gray-600">{product.manufacturer}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Batch:</span>
                <span className="ml-2 text-gray-600">{product.batchNumber}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Scanned:</span>
                {/* Changed product.scanCount to product.scannedCount for consistency with typical MongoDB fields */}
                <span className="ml-2 text-gray-600">{product.scannedCount || 0} times</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            🕐 Product Journey
          </h3>
          
          {product.steps && product.steps.length > 0 ? (
            <div className="space-y-8">
              {product.steps.map((step, index) => (
                <div key={step._id || index} className="flex"> {/* Added index as fallback key */}
                  <div className="flex flex-col items-center mr-6">
                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl ${getStepColor(step.stepType)}`}>
                      {getStepIcon(step.stepType)}
                    </div>
                    {index < product.steps.length - 1 && (
                      <div className="w-1 h-20 bg-gradient-to-b from-blue-300 to-blue-500 mt-4 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div 
                      className={`rounded-xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${getStepColor(step.stepType)} ${
                        selectedStep === step._id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedStep(selectedStep === step._id ? null : step._id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xl font-bold text-gray-900 capitalize">
                          {step.stepType.replace('_', ' ')}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(step.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3 text-lg">{step.description}</p>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <span className="mr-2">📍</span>
                        <span className="font-medium">{step.location}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">🕐</span>
                        <span>{new Date(step.timestamp).toLocaleString()}</span>
                      </div>

                      {selectedStep === step._id && (
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          {step.certification && (
                            <div className="mb-3">
                              <span className="font-medium text-gray-700">Certification:</span>
                              <span className="ml-2 text-gray-600">{step.certification}</span>
                            </div>
                          )}
                          
                          {step.metadata && (
                            <div className="grid md:grid-cols-2 gap-3 mb-3">
                              {step.metadata.temperature && (
                                <div>
                                  <span className="font-medium text-gray-700">Temperature:</span>
                                  <span className="ml-2 text-gray-600">{step.metadata.temperature}</span>
                                </div>
                              )}
                              {step.metadata.humidity && (
                                <div>
                                  <span className="font-medium text-gray-700">Humidity:</span>
                                  <span className="ml-2 text-gray-600">{step.metadata.humidity}</span>
                                </div>
                              )}
                              {step.metadata.quality_score && (
                                <div>
                                  <span className="font-medium text-gray-700">Quality Score:</span>
                                  <span className="ml-2 text-gray-600">{step.metadata.quality_score}/10</span>
                                </div>
                              )}
                              {step.metadata.inspector && (
                                <div>
                                  <span className="font-medium text-gray-700">Inspector:</span>
                                  <span className="ml-2 text-gray-600">{step.metadata.inspector}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {step.blockchainTxHash && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <span className="text-green-600 mr-2">⛓️</span>
                                <span className="font-medium text-green-800">Blockchain Verified</span>
                              </div>
                              <p className="text-sm font-mono text-green-700 break-all">
                                {step.blockchainTxHash}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Journey Data</h3>
              <p className="text-gray-600">
                This product doesn't have any traceability steps recorded yet.
              </p>
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-bold text-gray-900 mb-2">Blockchain Secured</h3>
            <p className="text-gray-600 text-sm">
              {product.steps?.filter(s => s.blockchainTxHash).length || 0} steps verified on blockchain
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="font-bold text-gray-900 mb-2">Authenticity Verified</h3>
            <p className="text-gray-600 text-sm">
              Product authenticity confirmed through immutable records
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="font-bold text-gray-900 mb-2">Full Transparency</h3>
            <p className="text-gray-600 text-sm">
              Complete supply chain visibility from origin to consumer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}