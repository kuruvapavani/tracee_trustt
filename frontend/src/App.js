import { useState } from "react";
// Remove Convex imports: Authenticated, Unauthenticated, useQuery, api
import { Toaster } from "sonner";
import { AdminDashboard } from "./components/AdminDashboard";
import { ConsumerDashboard } from "./components/ConsumerDashboard";
import { LandingPage } from "./components/LandingPage";
import { SignInForm } from "./components/SignInForm"; // Updated import path if moved
import { SignOutButton } from "./components/SignOutButton"; // Updated import path if moved
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import AuthProvider and useAuth

export default function App() {
  const [userRole, setUserRole] = useState(null); // 'admin' or 'consumer'
  const [showAuth, setShowAuth] = useState(false);

  return (
    // Wrap the entire app with AuthProvider
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header
          userRole={userRole}
          setUserRole={setUserRole}
          setShowAuth={setShowAuth}
          showAuth={showAuth} // Pass showAuth as prop to Header
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

// Separated Header component for clarity and to use useAuth hook
function Header({ userRole, setUserRole, setShowAuth, showAuth }) {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => {
            setUserRole(null);
            setShowAuth(false);
            // Optionally, if authenticated, you might want to logout
            // or just navigate to landing page with current session
          }}
          className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          🔗 TraceChain
        </button>
        {isLoggedIn && ( // Conditional rendering based on isLoggedIn
          <div className="text-sm text-gray-600">
            {userRole === 'admin' ? '👨‍💼 Admin Panel' : '👤 Consumer View'}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        {isLoggedIn ? ( // Conditional rendering based on isLoggedIn
          <SignOutButton onSignOut={() => {
            setUserRole(null);
            setShowAuth(false);
            logout(); // Explicitly call logout
          }} />
        ) : (
          !showAuth && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setUserRole('admin');
                  setShowAuth(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Admin Login
              </button>
              <button
                onClick={() => {
                  setUserRole('consumer');
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
  const { user, isLoggedIn, loadingAuth } = useAuth(); // Get user, isLoggedIn, and loadingAuth from AuthContext

  // Show loading indicator while authentication status is being determined
  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show landing page when no role is selected and not showing auth
  if (!userRole && !showAuth) {
    return <LandingPage onSelectRole={setUserRole} onShowAuth={setShowAuth} />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {isLoggedIn ? ( // Conditional rendering based on isLoggedIn
        user && user.role === 'admin' ? ( // Check user.role directly
          <AdminDashboard user={user} />
        ) : (
          <ConsumerDashboard />
        )
      ) : ( // Render sign-in form if not logged in
        <div className="max-w-md mx-auto mt-20">
          <div className="text-center mb-8">
            <button
              onClick={() => {
                setShowAuth(false);
                setUserRole(null); // Reset role when going back to home
              }}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to Home
            </button>
            <h1 className="text-4xl font-bold text-blue-600 mb-4">🔗 TraceChain</h1>
            <p className="text-xl text-gray-600 mb-2">
              {userRole === 'admin' ? 'Admin Login' : 'Consumer Access'}
            </p>
            <p className="text-gray-500">
              {userRole === 'admin'
                ? 'Sign in to manage product tracking'
                : 'Access product traceability information'
              }
            </p>
          </div>
          <SignInForm userRole={userRole} />
        </div>
      )}
    </div>
  );
}