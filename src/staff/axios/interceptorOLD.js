import instance from "./axios_authenticated";

let refresh = false;

instance.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    // get refresh token
    const refreshToken = localStorage.getItem("refresh_token");

    if (error.response.status === 401 && !refresh && refreshToken) {
      refresh = true;
      const response = await instance.post("api/token/refresh/", {
        refresh: refreshToken,
      });

      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        // attaches new access token and retries original request
        error.config.headers[
          "Authorization"
        ] = `Bearer ${response.data.access}`;

        // updates refresh token in Axios instance only when logging out
        // this is necessary because we must blacklist the updated refresh
        // token and not the token from the original request
        if (window.location.pathname === "api/logout/") {
          error.config.data["refresh_token"] = response.data.refresh;
        }

        return instance(error.config);
      }
    }

    refresh = false;
    console.log(error);
  }
);
