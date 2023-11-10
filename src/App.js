import React from "react";
import { useState } from "react";
import { useEffect } from "react";
// COMPONENTS
import Login from "./authentication/Login";
import Logout from "./authentication/Logout";
// COMPONENTS - STAFF
import StaffNavigation from "./staff/navigation/StaffNavigation";
import StaffDashboard from "./staff/Dashboard";
import StudentProfilesCards from "./staff/students/StudentProfilesCards";
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

  useEffect(() => {
    if (localStorage.getItem("refresh_token")) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }

    console.log(isAuth, isStaff);
  }, [isAuth, isStaff]);

  return (
    <BrowserRouter>
      {isAuth && isStaff ? (
        <StaffNavigation />
      ) : (
        isAuth && <CustomerNavigation />
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
            />
          }
        />
        <Route
          path="/logout"
          element={<Logout setIsAuth={setIsAuth} setIsStaff={setIsStaff} />}
        />
        {/* STAFF ROUTES */}
        <Route path="/staff/dashboard" element={<StaffDashboard />}></Route>
        <Route
          path="/staff/students/profiles/cards"
          element={<StudentProfilesCards />}></Route>
        {/* CUSTOMER ROUTES */}
        <Route
          path="/customer/dashboard"
          element={<CustomerDashboard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
