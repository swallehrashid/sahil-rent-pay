import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser } from '../features/auth/authSlice';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  // 1. Unauthenticated: No valid JWT token found in Redux state
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. State Syncing: Token exists, but user profile data is still hydrating
  if (allowedRoles && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F0246]">
        <div className="w-10 h-10 border-4 border-[#B95F7B] border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  // 3. Unauthorized: Role-Based Access Control (RBAC) rejection
  // Matches the allowed roles array against the user's role_type (admin, landlord, caretaker, tenant)
  if (allowedRoles && !allowedRoles.includes(user?.role_type)) {
    // If a caretaker tries to access a landlord route, they are kicked out
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. Authorized: Render the requested nested route components
  return <Outlet />;
};

export default ProtectedRoute;