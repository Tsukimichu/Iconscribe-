import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // FIX: Prevent error when user.role is undefined
  const role = user.role ? user.role.toLowerCase() : "";

  // If user’s role is not allowed → redirect to Unauthorized page
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise, allow access
  return children;
};

export default ProtectedRoute;
