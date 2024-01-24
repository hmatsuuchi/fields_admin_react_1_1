import instance from "./axios_authenticated";
import { Navigate } from "react-router-dom";

// response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // saves original request
    const originalRequest = error.config;
    const originalRequestData = error.config.data;

    // 401 unauthorized error
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "api/token/refresh/" // prevents requests to refresh token endpoint from being retried
    ) {
      originalRequest._retry = true;
      try {
        // send refresh token to API endpoint and get new access token
        const response = await instance.post("api/token/refresh/");

        // if access token refresh successful
        if (response.status === 200) {
          // reset data payload and retry original requst
          originalRequest.data = originalRequestData;
          return instance(originalRequest);
        }
      } catch (error) {
        // Clear tokens from local storage
        console.error(
          "request retry error, removing access and refresh tokens from local storage"
        );

        // if error refreshing access token, redirect to login page
        return <Navigate replace to="/login" />;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
