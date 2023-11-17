import instance from "./axios_authenticated";
// import { Navigate } from "react-router-dom";

// request interceptor
instance.interceptors.request.use(
  async (config) => {
    // get access token
    const accessToken = localStorage.getItem("access_token");

    // if access token is in local storage, attaches token to request header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // saves original request
    const originalRequest = error.config;

    // 401 unauthorized error
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        // send refresh token to API endpoint and get new access token
        const response = await instance.post("api/token/refresh/", {
          refresh: refreshToken,
        });

        // new access and refresh token
        const newAccessToken = response.data.access;
        const newRefreshToken = response.data.refresh;

        // saves new access and refresh token to local storage
        localStorage.setItem("access_token", newAccessToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        // attach new access and refresh token to original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.data = { refresh_token: newRefreshToken };

        // if access token refresh successful
        if (response.status === 200) {
          // retry original requst
          return instance(originalRequest);
        } else {
          // if error refreshing access token, redirect to login page
          // window.location.href = "/login/";

          // Clear tokens from local storage
          console.error(
            "request retry error, removing access and refresh tokens from local storage"
          );
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      } else {
        // if refresh token not in local storage, redirect to login page
        // window.location.href = "/login/";

        // Clear tokens from local storage
        console.error(
          "refresh token not found in local storage, removing access and refresh tokens from local storage"
        );
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
