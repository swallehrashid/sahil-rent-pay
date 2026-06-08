import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // Crucial for preventing route flashing during the initial token check
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Attempt to retrieve the token on initial app load
    const token = localStorage.getItem("sahil_access_token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // 2. Security Check: Validate token expiration
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          console.warn("Sahil Rent Pay Security: Token has expired.");
          logout(); // Force clean up
        } else {
          // 3. Hydrate User State
          // Note: The decoded payload from Flask must contain the 'role_type' 
          // (admin, landlord, caretaker, tenant) for the RBAC system to function.
          setUser(decoded);
        }
      } catch (error) {
        // If the token is malformed or tampered with, wipe it.
        console.error("Sahil Rent Pay Security: Invalid JWT token detected.");
        logout();
      }
    }
    
    // Conclude the initialization phase
    setIsLoading(false);
  }, []);

  /**
   * Called by the login component after a successful API request.
   * @param {string} token - The JWT string returned from the Flask backend.
   */
  const login = (token) => {
    localStorage.setItem("sahil_access_token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  /**
   * Called to terminate the session. 
   * Removes credentials and wipes the current user state.
   */
  const logout = () => {
    localStorage.removeItem("sahil_access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for clean imports in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a Sahil AuthProvider");
  }
  return context;
};