import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
// Axios
import instance_public from "../staff/axios/axios_public";
import instance_authenticated from "../staff/axios/axios_authenticated";
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
  setIsCustomer,
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

        // initialize access and refresh tokens in localstorage
        localStorage.clear();
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        // get logged in user data and redirect
        const getLoggedInUserData = async () => {
          try {
            await instance_authenticated
              .get("api/logged_in_user_data")
              .then((response) => {
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
                  // set staff bool
                  setIsStaff(true);
                  // set staff bool in local storage
                  localStorage.setItem("is_staff", true);
                } else {
                  // set customer bool
                  setIsCustomer(true);
                  // set customer bool in local storage
                  localStorage.setItem("is_customer", true);
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
    return <Navigate replace to="/staff/dashboard" />;
  } else if (isAuth && isCustomer) {
    // customer redirect
    return <Navigate replace to="/customer/dashboard" />;
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
              required></input>
            <input
              name="password"
              type="password"
              value={password}
              placeholder="パスワード"
              onChange={(e) => setPassword(e.target.value)}
              required></input>
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
