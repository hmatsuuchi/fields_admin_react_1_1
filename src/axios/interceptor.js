import instance from "./axios_authenticated";

let isRefreshing = false;
let refreshPromise = null;
let subscribers = [];

function onRefreshed(token) {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const originalRequestData = error.config.data;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "api/token/refresh/"
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = instance
          .post("api/token/refresh/")
          .then((response) => {
            if (response.status === 200) {
              onRefreshed(response.data.access); // Notify all subscribers
              return response;
            }
            throw new Error("Failed to refresh token");
          })
          .catch((err) => {
            window.location.href = "/login";
            throw err;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      // Return a promise that resolves when the token is refreshed
      return new Promise((resolve, reject) => {
        addSubscriber((token) => {
          // Optionally update the Authorization header here if needed
          originalRequest.data = originalRequestData;
          resolve(instance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default instance;
