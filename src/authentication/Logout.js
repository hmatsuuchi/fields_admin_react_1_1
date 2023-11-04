import { useEffect } from "react";
import instance from "../staff/axios/axios_authenticated";

function Logout({ setIsAuth }) {
  useEffect(() => {
    const logoutUser = async () => {
      const refreshToken = localStorage.getItem("refresh_token");

      try {
        await instance.post("/api/logout/", {
          refresh_token: refreshToken,
        });

        // Clear tokens from local storage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // sets auth bool to false
        setIsAuth(false);
      } catch (error) {
        // Handle error (e.g., show an error message)
      }
    };

    // calls logout function
    logoutUser();
  }, [setIsAuth]);

  return <h1>you have been logged out</h1>;
}

export default Logout;
