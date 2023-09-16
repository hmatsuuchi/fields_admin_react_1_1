import React from "react";
import { useState } from "react";
import { useEffect } from "react";
// COMPONENTS
import Navigation from "./navigation/Navigation";
import Login from "./authentication/Login";
import StudentProfilesCards from "./staff/students/StudentProfilesCards";
import StudentProfilesList from "./staff/students/StudentProfilesList";

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
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route
          path="/students/profiles/cards"
          element={<StudentProfilesCards />}></Route>
        <Route
          path="/students/profiles/list"
          element={<StudentProfilesList />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
