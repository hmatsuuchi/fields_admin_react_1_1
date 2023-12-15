import React, { useEffect } from "react";
import { useState } from "react";
// COMPONENTS
import Login from "./authentication/Login";
import Logout from "./authentication/Logout";
import StaffProtectedRoute from "./authentication/StaffProtectedRoute";
import CustomerProtectedRoute from "./authentication/CustomerProtectedRoute";
// COMPONENTS - STAFF
import StaffNavigation from "./staff/navigation/StaffNavigation";
import StaffDashboard from "./staff/Dashboard";
import StudentProfilesCards from "./staff/students/StudentProfilesCards";
import StudentProfilesDetails from "./staff/students/StudentProfilesDetails";
import StudentProfilesCreate from "./staff/students/StudentProfilesCreate";
import StudentProfilesUpdate from "./staff/students/StudentProfilesUpdate";
import StudentProfilesDelete from "./staff/students/StudentProfilesDelete";
// COMPNENTS - CUSTOMER
import CustomerNavigation from "./customer/navigation/CustomerNavigation";
import CustomerDashboard from "./customer/Dashboard";

// CSS
import "./App.css";
// Browser Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isStaff, setIsStaff] = useState(null);
  const [isCustomer, setIsCustomer] = useState(null);

  useEffect(() => {
    // gets authentication bool from local storage
    if (localStorage.getItem("refresh_token")) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
    // gets isStaff bool from local storage
    if (localStorage.getItem("is_staff")) {
      setIsStaff(true);
    }
    // gets isStaff bool from local storage
    if (localStorage.getItem("is_customer")) {
      setIsCustomer(true);
    }
  }, []);

  return (
    <BrowserRouter>
      {isAuth && isStaff ? (
        <StaffNavigation />
      ) : (
        isAuth && isCustomer && <CustomerNavigation />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <Login
              isAuth={isAuth}
              setIsAuth={setIsAuth}
              isStaff={isStaff}
              setIsStaff={setIsStaff}
              isCustomer={isCustomer}
              setIsCustomer={setIsCustomer}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              isAuth={isAuth}
              setIsAuth={setIsAuth}
              isStaff={isStaff}
              setIsStaff={setIsStaff}
              isCustomer={isCustomer}
              setIsCustomer={setIsCustomer}
            />
          }
        />
        <Route
          path="/logout"
          element={
            <Logout
              setIsAuth={setIsAuth}
              setIsStaff={setIsStaff}
              setIsCustomer={setIsCustomer}
            />
          }
        />
        {/* STAFF ROUTES */}
        <Route
          path="/staff/dashboard"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <StaffDashboard />
            </StaffProtectedRoute>
          }></Route>
        {/* STAFF ROUTES - STUDENT PROFILES */}
        <Route
          path="/staff/students/profiles/cards"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <StudentProfilesCards />
            </StaffProtectedRoute>
          }></Route>
        <Route
          path="/staff/students/profiles/details/:profileId"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <StudentProfilesDetails />
            </StaffProtectedRoute>
          }></Route>
        <Route
          path="/staff/students/profiles/create"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <StudentProfilesCreate />
            </StaffProtectedRoute>
          }></Route>
        <Route
          path="/staff/students/profiles/update/:profileId"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <StudentProfilesUpdate />
            </StaffProtectedRoute>
          }></Route>
        <Route
          path="/staff/students/profiles/delete/:profileId"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <StudentProfilesDelete />
            </StaffProtectedRoute>
          }></Route>
        {/* CUSTOMER ROUTES */}
        <Route
          path="/customer/dashboard"
          element={
            <CustomerProtectedRoute isAuth={isAuth} isCustomer={isCustomer}>
              <CustomerDashboard />
            </CustomerProtectedRoute>
          }></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
