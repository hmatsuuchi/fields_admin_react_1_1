import React from "react";
import { useState } from "react";
import instance_public from "../axios/axios_public";

function Login({ setIsAuth }) {
  const [username, setUsername] = useState("fields_admin");
  const [password, setPassword] = useState(
    "znH8Cd5i!BN*gHYCj5*KsW6Cf9gqEfqypvM8W&dGjmGQED2tKqBQJBd@bKMVkRVn*kGPB64oH%dLF9A^@RjNFQ%mfu9MJ%P&cqdgxS!U!omZS$d7dBX3V9&vRQJd2hxD"
  );

  const submit = async (e) => {
    e.preventDefault();
    const user = {
      username: username,
      password: password,
    };

    // create POST request
    const { data } = await instance_public.post("api/token/", user);

    if (data) {
      // initialize access and refresh tokens in localstorage
      localStorage.clear();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // redirect
      window.location.href = "/students/profiles/cards";
      // is authenticated bool
      setIsAuth(true);
    } else {
      console.log("login error");
    }
  };

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

export default Login;
