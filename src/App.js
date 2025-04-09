import React, { useEffect } from "react";
import { useState } from "react";
// Axios
import instance_authenticated from "./staff/axios/axios_authenticated";
// COMPONENTS
import Login from "./authentication/Login";
import Logout from "./authentication/Logout";
import StaffProtectedRoute from "./authentication/StaffProtectedRoute";
import CustomerProtectedRoute from "./authentication/CustomerProtectedRoute";
// COMPONENTS - STAFF - GENERAL
import StaffNavigation from "./staff/navigation/StaffNavigation";
import StaffDashboard from "./staff/dashboard/Dashboard";
// COMPONENTS - STAFF - STUDENTS
import StudentProfilesCards from "./staff/students/StudentProfilesCards";
import StudentProfilesDetails from "./staff/students/StudentProfilesDetails";
import StudentProfilesCreate from "./staff/students/StudentProfilesCreate";
import StudentProfilesUpdate from "./staff/students/StudentProfilesUpdate";
import StudentProfilesDelete from "./staff/students/StudentProfilesDelete";
// COMPONENTS - STAFF - SCHEDULE
import Calendar from "./staff/schedule/Calendar";
import CalendarEventCreate from "./staff/schedule/CalendarEventCreate";
// COMPONENTS - STAFF - ATTENDANCE
import Attendance from "./staff/attendance/Attendance";
import AttendanceCreate from "./staff/attendance/AttendanceCreate";
// COMPONENTS - CUSTOMER
import CustomerNavigation from "./customer/navigation/CustomerNavigation";
import CustomerDashboard from "./customer/Dashboard";

// CSS
import "./App.css";
// Browser Router
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [isAuth, setIsAuth] = useState(localStorage.getItem("is_auth"));
  const [isStaff, setIsStaff] = useState(localStorage.getItem("is_staff"));
  const [isCustomer, setIsCustomer] = useState(
    localStorage.getItem("is_customer")
  );
  const [csrfToken, setCsrfToken] = useState("");

  /* BACK BUTTON */
  const [backButtonText, setBackButtonText] = useState("生徒情報");
  const [backButtonLink, setBackButtonLink] = useState(
    "/staff/students/profiles/cards/"
  );

  /* SCHEDULE */
  const [highlightedEventId, setHighlightedEventId] = useState(null);

  /* STUDENT PROFILES */
  const [monthFilters, setMonthFilters] = useState({
    month0: true,
    month1: true,
    month2: true,
    month3: true,
    month4: true,
    month5: true,
    month6: true,
    month7: true,
    month8: true,
    month9: true,
    month10: true,
    month11: true,
    month12: true,
  });
  const [archiveFilters, setArchiveFilters] = useState({
    unarchived: true,
    archived: true,
  });
  const [sorts, setSorts] = useState({
    id: 1,
    birth_month_day: 0,
  });

  /* ------------------------------------------- */
  /* ---------------- FUNCTIONS ---------------- */
  /* ------------------------------------------- */

  /* SYNCHONIZES IS_AUTH, IS_STAFF AND IS_CUSTOMER LOCAL STORAGE VARIABLES WITH STATE */
  useEffect(() => {
    // gets authentication bool from local storage
    if (localStorage.getItem("is_auth")) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
    // gets isStaff bool from local storage
    if (localStorage.getItem("is_staff")) {
      setIsStaff(true);
    } else {
      setIsStaff(null);
    }
    // gets isStaff bool from local storage
    if (localStorage.getItem("is_customer")) {
      setIsCustomer(true);
    } else {
      setIsCustomer(null);
    }
  }, []);

  /* REFRESH CSRF TOKEN ON COMPONENT MOUNT */
  /* this allows csrf token to be kept in state even when page is manually refreshed */
  useEffect(() => {
    // refresh csrf token function
    const refreshCsrfToken = async () => {
      try {
        await instance_authenticated
          .get("api/csrf/refresh/")
          .then((response) => {
            setCsrfToken(response.data["csrftoken"]);
          });
      } catch (e) {
        console.error(e);
      }
    };

    // drives code if not on login page
    if (window.location.pathname !== "/login") {
      refreshCsrfToken();
    }
  }, []);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <BrowserRouter>
      {isAuth && isStaff ? (
        <StaffNavigation />
      ) : (
        isAuth && isCustomer && <CustomerNavigation />
      )}
      <Routes>
        <Route path="/" element={<Navigate replace to="/staff/dashboard/" />} />

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
              setCsrfToken={setCsrfToken}
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
              csrfToken={csrfToken}
            />
          }
        />
        {/* STAFF ROUTES - DASHBOARD */}
        <Route
          path="/staff/dashboard"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <StaffDashboard />
            </StaffProtectedRoute>
          }
        ></Route>

        {/* STAFF ROUTES - STUDENTS - ALL STUDENT PROFILES */}
        <Route
          path="/staff/students/profiles/cards"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <StudentProfilesCards
                monthFilters={monthFilters}
                setMonthFilters={setMonthFilters}
                archiveFilters={archiveFilters}
                setArchiveFilters={setArchiveFilters}
                sorts={sorts}
                setSorts={setSorts}
                setBackButtonText={setBackButtonText}
                setBackButtonLink={setBackButtonLink}
              />
            </StaffProtectedRoute>
          }
        ></Route>
        {/* STAFF ROUTES - STUDENTS - STUDENT PROFILE DETAILS */}
        <Route
          path="/staff/students/profiles/details/:profileId"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <StudentProfilesDetails
                csrfToken={csrfToken}
                backButtonText={backButtonText}
                setBackButtonText={setBackButtonText}
                backButtonLink={backButtonLink}
                setBackButtonLink={setBackButtonLink}
              />
            </StaffProtectedRoute>
          }
        ></Route>
        {/* STAFF ROUTES - STUDENTS - CREATE PROFILE */}
        <Route
          path="/staff/students/profiles/create"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <StudentProfilesCreate csrfToken={csrfToken} />
            </StaffProtectedRoute>
          }
        ></Route>
        {/* STAFF ROUTES - STUDENTS - UPDATE PROFILE */}
        <Route
          path="/staff/students/profiles/update/:profileId"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <StudentProfilesUpdate
                csrfToken={csrfToken}
                setBackButtonText={setBackButtonText}
                setBackButtonLink={setBackButtonLink}
              />
            </StaffProtectedRoute>
          }
        ></Route>
        {/* STAFF ROUTES - STUDENTS - DELETE PROFILE */}
        <Route
          path="/staff/students/profiles/delete/:profileId"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <StudentProfilesDelete
                csrfToken={csrfToken}
                setBackButtonText={setBackButtonText}
                setBackButtonLink={setBackButtonLink}
              />
            </StaffProtectedRoute>
          }
        ></Route>
        {/* STAFF ROUTES - CALENDAR - WEEK VIEW */}
        <Route
          path="/staff/schedule/events/calendar/week-view"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <Calendar
                csrfToken={csrfToken}
                highlightedEventId={highlightedEventId}
                setHighlightedEventId={setHighlightedEventId}
                setBackButtonText={setBackButtonText}
                setBackButtonLink={setBackButtonLink}
              />
            </StaffProtectedRoute>
          }
        ></Route>
        {/* STAFF ROUTES - CALENDAR - CREATE EVENT */}
        <Route
          path="/staff/schedule/events/calendar/create"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <CalendarEventCreate
                csrfToken={csrfToken}
                setHighlightedEventId={setHighlightedEventId}
              />
            </StaffProtectedRoute>
          }
        ></Route>
        {/* STAFF ROUTES - ATTENDANCE - DAY VIEW */}
        <Route
          path="/staff/attendance/day-view"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <Attendance
                csrfToken={csrfToken}
                backButtonText={backButtonText}
                setBackButtonText={setBackButtonText}
                backButtonLink={backButtonLink}
                setBackButtonLink={setBackButtonLink}
              />
            </StaffProtectedRoute>
          }
        ></Route>
        {/* STAFF ROUTES - ATTENDANCE - DAY VIEW */}
        <Route
          path="/staff/attendance/create/"
          element={
            <StaffProtectedRoute isAuth={isAuth} isStaff={isStaff}>
              <AttendanceCreate
                csrfToken={csrfToken}
                setBackButtonText={setBackButtonText}
                setBackButtonLink={setBackButtonLink}
              />
            </StaffProtectedRoute>
          }
        ></Route>
        {/* CUSTOMER ROUTES - DASHBOARD */}
        <Route
          path="/customer/dashboard"
          element={
            <CustomerProtectedRoute isAuth={isAuth} isCustomer={isCustomer}>
              <CustomerDashboard />
            </CustomerProtectedRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
