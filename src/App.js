import React from "react";
import { useState } from "react";
import { useEffect } from "react";
// COMPONENTS
import Login from "./authentication/Login";
import Logout from "./authentication/Logout";
// COMPONENTS - STAFF
import Navigation from "./staff/navigation/Navigation";
import Dashboard from "./staff/Dashboard";
import StudentProfilesCards from "./staff/students/StudentProfilesCards";

// CSS
import "./App.css";
// Browser Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("refresh_token")) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []);

  return (
    <BrowserRouter>
      {isAuth && <Navigation setIsAuth={setIsAuth} />}
      <Routes>
        <Route path="/" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/logout" element={<Logout setIsAuth={setIsAuth} />} />
        <Route path="/staff/dashboard" element={<Dashboard />}></Route>
        <Route
          path="/staff/students/profiles/cards"
          element={<StudentProfilesCards />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
