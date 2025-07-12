import { useState } from "react";

export function LandingPage({ onSelectRole, onShowAuth }) {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: "🔗",
      title: "Blockchain Security",
      description: "Every step recorded on Ethereum blockchain with immutable proof"
    },
    {
      icon: "📱",
      title: "QR Code Scanning",
      description: "Instant product verification through simple QR code scanning"
    },
    {
      icon: "🌍",
      title: "Supply Chain Transparency",
      description: "Complete journey visibility from origin to consumer"
    },
    {
      icon: "✅",
      title: "Authenticity Verification",
      description: "Tamper-proof certification and quality assurance"
    }
  ];

  const useCases = [
    { icon: "🍎", title: "Food & Agriculture", desc: "Farm to table traceability" },
    { icon: "💊", title: "Pharmaceuticals", desc: "Drug authenticity & safety" },
    { icon: "👕", title: "Fashion & Luxury", desc: "Anti-counterfeiting protection" },
    { icon: "🔧", title: "Manufacturing", desc: "Quality control & compliance" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            🔗 TraceChain
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100">
            Blockchain-Powered Product Traceability
          </p>
          <p className="text-lg mb-8 text-blue-200 max-w-3xl mx-auto">
            Ensure product authenticity, transparency, and supply chain accountability. 
            Protect against fraud and earn customer trust with immutable blockchain records.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                onSelectRole('admin');
                onShowAuth(true);
              }}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              👨‍💼 Start as Business Admin
            </button>
            <button
              onClick={() => {
                onSelectRole('consumer');
                onShowAuth(true);
              }}
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg"
            >
              👤 Access as Consumer
            </button>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-red-800 mb-6">
            🚨 The Problem We Solve
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="font-bold text-gray-900 mb-2">Lack of Transparency</h3>
              <p className="text-gray-600">Consumers can't verify product origins or authenticity</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-4">⚠️</div>
              <h3 className="font-bold text-gray-900 mb-2">Counterfeiting</h3>
              <p className="text-gray-600">Fake products damage brand reputation and consumer safety</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="font-bold text-gray-900 mb-2">Compliance Issues</h3>
              <p className="text-gray-600">Difficulty meeting regulatory requirements and recalls</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            🚀 Key Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg cursor-pointer transition-all mb-4 ${
                    activeFeature === index
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-8 rounded-xl">
              <div className="text-center">
                <div className="text-6xl mb-4">{features[activeFeature].icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {features[activeFeature].title}
                </h3>
                <p className="text-gray-700 text-lg">
                  {features[activeFeature].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            🏭 Industry Applications
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4 text-center">{useCase.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            ⚙️ How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Record Journey</h3>
              <p className="text-gray-600">
                Businesses record each step of product journey on blockchain
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Generate QR Code</h3>
              <p className="text-gray-600">
                Unique QR codes link physical products to blockchain records
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Verify Authenticity</h3>
              <p className="text-gray-600">
                Consumers scan QR codes to view complete, verified product history
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Technology */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">⛓️ Powered by Blockchain</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Immutable Records</h3>
              <p className="text-purple-100">
                Data cannot be altered once recorded on blockchain
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-2">Decentralized</h3>
              <p className="text-purple-100">
                No single point of failure or control
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Transparent</h3>
              <p className="text-purple-100">
                All stakeholders can verify authenticity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the future of supply chain transparency and product authenticity
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                onSelectRole('admin');
                onShowAuth(true);
              }}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Managing Products
            </button>
            <button
              onClick={() => {
                onSelectRole('consumer');
                onShowAuth(true);
              }}
              className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Try Product Scanning
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-4">🔗 TraceChain</div>
          <p className="mb-4">
            Blockchain-powered product traceability for the modern supply chain
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <span>🔒 Secure</span>
            <span>🌍 Transparent</span>
            <span>✅ Verified</span>
            <span>⚡ Real-time</span>
          </div>
        </div>
      </footer>
    </div>
  );
}