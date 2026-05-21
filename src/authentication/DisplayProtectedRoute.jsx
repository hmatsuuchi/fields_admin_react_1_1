import React from "react";
import { Navigate } from "react-router-dom";

// protects display routes bye checking if use is authenticated and is display
function DisplayProtectedRoute({ isAuth, isDisplay, children }) {
  if (!isAuth | !isDisplay) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default DisplayProtectedRoute;
