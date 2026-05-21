import React from "react";
import { Navigate } from "react-router-dom";

// protects display routes bye checking if use is authenticated and is superuser
function SuperuserProtectedRoute({ isAuth, isSuperuser, children }) {
  if (!isAuth | !isSuperuser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default SuperuserProtectedRoute;
