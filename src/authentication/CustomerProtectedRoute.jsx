import React from "react";
import { Navigate } from "react-router-dom";

// protects staff routes bye checking if use is authenticated and is staff
function CustomerProtectedRoute({ isAuth, isCustomer, children }) {
  if (!isAuth | !isCustomer) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default CustomerProtectedRoute;
