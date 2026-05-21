import React from "react";
import { Navigate } from "react-router-dom";

// protects staff routes bye checking if use is authenticated and is staff
function StaffProtectedRoute({ isAuth, isStaff, children }) {
  if (!isAuth | !isStaff) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default StaffProtectedRoute;
