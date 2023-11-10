import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import instance_public from "../staff/axios/axios_public";
import instance_authenticated from "../staff/axios/axios_authenticated";

function Login({ isAuth, setIsAuth, isStaff, setIsStaff }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const user = {
      username: username,
      password: password,
    };

    // create POST request
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
              const loggedInUserGroups = response.data["logged_in_user_groups"];
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
              } else {
                // set sfaff bool
                setIsStaff(false);
              }
            });
        } catch (e) {
          console.error(e);
        }
      };
      // call function
      getLoggedInUserData();
    } else {
      console.error("login error");
    }
  };

  if (isAuth && isStaff) {
    // staff redirect
    return <Navigate replace to="/staff/dashboard" />;
  } else if (isAuth && isStaff === false) {
    // customer redirect
    return <Navigate replace to="/customer/dashboard" />;
  } else {
    return (
      <div className="authentication-container">
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
      </div>
    );
  }
}

export default Login;
