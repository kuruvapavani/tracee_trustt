// src/SignOutButton.js
import React from "react";
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

export function SignOutButton({ onSignOut }) { // onSignOut prop is now optional
  const { logout } = useAuth(); // Use the logout function from AuthContext

  const handleSignOut = () => {
    logout(); // Call the logout function
    if (onSignOut) {
      onSignOut(); // Execute additional actions if provided
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 text-sm"
    >
      Sign Out
    </button>
  );
}