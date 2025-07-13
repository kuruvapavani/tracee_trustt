import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AdminDashboard } from "./components/AdminDashboard";
import { ConsumerDashboard } from "./components/ConsumerDashboard";
import { LandingPage } from "./components/LandingPage";
import { SignInForm } from "./components/SignInForm";
import { SignOutButton } from "./components/SignOutButton";
import { QRScanner } from "./components/QRScanner";
import { ProductDetails } from "./components/ProductDetails";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { QRCodeRedirectHandler } from "./components/QRCodeRedirectHandler";

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header
          userRole={userRole}
          setUserRole={setUserRole}
          setShowAuth={setShowAuth}
          showAuth={showAuth}
        />
        <main className="flex-1">
          <Content
            userRole={userRole}
            showAuth={showAuth}
            setShowAuth={setShowAuth}
            setUserRole={setUserRole}
          />
        </main>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

function Header({ userRole, setUserRole, setShowAuth, showAuth }) {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setUserRole(null);
            setShowAuth(false);
          }}
          className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          🔗 TraceChain
        </button>
        {isLoggedIn && (
          <div className="text-sm text-gray-600">
            {userRole === "admin" ? "👨‍💼 Admin Panel" : "👤 Consumer View"}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <SignOutButton
            onSignOut={() => {
              setUserRole(null);
              setShowAuth(false);
              logout();
            }}
          />
        ) : (
          !showAuth && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setUserRole("admin");
                  setShowAuth(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Admin Login
              </button>
              <button
                onClick={() => {
                  setUserRole("consumer");
                  setShowAuth(true);
                }}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-sm"
              >
                Consumer Access
              </button>
            </div>
          )
        )}
      </div>
    </header>
  );
}

function Content({ userRole, showAuth, setShowAuth, setUserRole }) {
  const { user, isLoggedIn, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Routes>
        <Route
          path="/"
          element={
            !userRole && !showAuth ? (
              <LandingPage
                onSelectRole={setUserRole}
                onShowAuth={setShowAuth}
              />
            ) : !isLoggedIn ? (
              <div className="max-w-md mx-auto mt-20">
                <div className="text-center mb-8">
                  <button
                    onClick={() => {
                      setShowAuth(false);
                      setUserRole(null);
                    }}
                    className="text-blue-600 hover:text-blue-800 mb-4"
                  >
                    ← Back to Home
                  </button>
                  <h1 className="text-4xl font-bold text-blue-600 mb-4">
                    🔗 TraceChain
                  </h1>
                  <p className="text-xl text-gray-600 mb-2">
                    {userRole === "admin" ? "Admin Login" : "Consumer Access"}
                  </p>
                  <p className="text-gray-500">
                    {userRole === "admin"
                      ? "Sign in to manage product tracking"
                      : "Access product traceability information"}
                  </p>
                </div>
                <SignInForm userRole={userRole} />
              </div>
            ) : user?.role === "admin" ? (
              <AdminDashboard user={user} />
            ) : (
              <ConsumerDashboard />
            )
          }
        />

        {/* 👇 QR Scanner Page */}
        <Route path="/scanner" element={<QRScanner />} />

        {/* 👇 Product details by QR code */}
        <Route path="/product/:qrCode" element={<ProductDetails />} />
        <Route path="/verify" element={<QRCodeRedirectHandler />} />
        <Route path="/consumer" element={<ConsumerDashboard />} />
      </Routes>
    </div>
  );
}
