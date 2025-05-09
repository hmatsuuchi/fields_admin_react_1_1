import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
// Axios
import instance_public from "../axios/axios_public.js";
import instance_authenticated from "../axios/axios_authenticated.js";
// Components
import LoadingSpinner from "../staff/micro/LoadingSpinner.js";
// CSS
import "./Login.scss";
// Images
import textLogoThin from "../img/fields_text_logo_thin.svg";

function Login({
  isAuth,
  setIsAuth,
  isStaff,
  setIsStaff,
  isCustomer,
  isDisplay,
  setIsCustomer,
  setCsrfToken,
  setIsDisplay,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [displayContent, setDisplayContent] = useState(false);

  useEffect(() => {
    // clear local storage
    localStorage.clear();

    // sets auth and staff bool to false
    setIsAuth(false);
    setIsStaff(null);
    setIsCustomer(null);

    setDisplayContent(true);
  }, [setIsAuth, setIsStaff, setIsCustomer]);

  const submit = async (e) => {
    e.preventDefault();

    setDisplayContent(false);

    setErrorMessage("");

    const user = {
      username: username,
      password: password,
    };

    // create POST request
    try {
      const { data } = await instance_public.post("api/token/", user);

      if (data) {
        // is authenticated bool
        setIsAuth(true);

        // clear local storage
        localStorage.clear();

        // set csrf token as meta element in DOM head
        setCsrfToken(data["csrftoken"]);

        // get logged in user data and redirect
        const getLoggedInUserData = async () => {
          try {
            await instance_authenticated
              .get("api/logged_in_user_data/")
              .then((response) => {
                // set is_auth bool in local storage
                localStorage.setItem("is_auth", true);

                const loggedInUserGroups =
                  response.data["logged_in_user_groups"];

                const staffRedirectParameters = [
                  "Superusers",
                  "Staff",
                  "Administrators",
                ];

                if (
                  staffRedirectParameters.some((i) =>
                    loggedInUserGroups.includes(i)
                  )
                ) {
                  // set staff prop
                  setIsStaff(true);
                  // set is_staff bool in local storage
                  localStorage.setItem("is_staff", true);
                } else if (loggedInUserGroups.includes("Customers")) {
                  // set customer prop
                  setIsCustomer(true);
                  // set is_customer bool in local storage
                  localStorage.setItem("is_customer", true);
                } else if (loggedInUserGroups.includes("Displays")) {
                  // set display prop
                  setIsDisplay(true);
                  // set is_display bool in local storage
                  localStorage.setItem("is_display", true);
                }
              });
          } catch (e) {
            console.error(e);
            setDisplayContent(true);
          }
        };
        // call function
        getLoggedInUserData();
      } else {
        console.error("login error");
        setDisplayContent(true);
      }
    } catch (e) {
      if (e.response.status === 401) {
        setErrorMessage("ユーザー名またはパスワードが間違っています。");
        setDisplayContent(true);
      } else {
        alert("ログインエラー。");
        setDisplayContent(true);
      }
    }
  };

  if (isAuth && isStaff) {
    // staff redirect
    return <Navigate replace to="/staff/dashboard/" />;
  } else if (isAuth && isCustomer) {
    // customer redirect
    return <Navigate replace to="/customer/dashboard/" />;
  } else if (isAuth && isDisplay) {
    return <Navigate replace to="/display/dashboard/" />;
  } else if (displayContent === true) {
    return (
      <div className="authentication-background-container">
        <div className="authentication-container">
          <img
            src={textLogoThin}
            className="text-logo-thin"
            alt="フィールズ英会話のロゴ"
          />
          <form onSubmit={submit}>
            <input
              name="username"
              type="text"
              value={username}
              placeholder="ユーザー名"
              onChange={(e) => setUsername(e.target.value)}
              required
            ></input>
            <input
              name="password"
              type="password"
              value={password}
              placeholder="パスワード"
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
            <button type="submit" className="form-button">
              ログイン
            </button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    );
  } else {
    return <LoadingSpinner />;
  }
}

export default Login;
