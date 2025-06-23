import instance from "./axios_authenticated";

// Flag to indicate if a token refresh is in progress
let isRefreshing = false;
// Array to hold callbacks for requests waiting for a new token
let subscribers = [];

// Calls all subscriber callbacks with the new token and clears the queue.
function onRefreshed(token) {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
}

// Adds a callback to the subscribers queue.
function addSubscriber(callback) {
  subscribers.push(callback);
}

// Attach a response interceptor to the Axios instance
instance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;
    const originalRequestData = error.config.data;

    // Check if the error is a 401 (Unauthorized), not already retried, and not the refresh endpoint itself
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "api/token/refresh/"
    ) {
      originalRequest._retry = true;

      // If not already refreshing, start the refresh process
      if (!isRefreshing) {
        isRefreshing = true;
        instance
          .post("api/token/refresh/")
          .then((response) => {
            if (response.status === 200) {
              // Notify all waiting requests with the new token
              onRefreshed(response.data.access);
              return response;
            }
            throw new Error("Failed to refresh token");
          })
          .catch((err) => {
            // Redirect to login if refresh fails
            window.location.href = "/login";
            throw err;
          })
          .finally(() => {
            // Reset the refreshing flag
            isRefreshing = false;
          });
      }

      // Return a promise that resolves when the token is refreshed
      return new Promise((resolve) => {
        addSubscriber(() => {
          // Optionally update the Authorization header here if needed
          originalRequest.data = originalRequestData;
          resolve(instance(originalRequest));
        });
      });
    }

    // For all other errors, reject as usual
    return Promise.reject(error);
  }
);

export default instance;
