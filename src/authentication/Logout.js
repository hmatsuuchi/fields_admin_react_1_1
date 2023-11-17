import { useEffect } from "react";
import instance from "../staff/axios/axios_authenticated";

function Logout({ setIsAuth, setIsStaff, setIsCustomer }) {
  useEffect(() => {
    const logoutUser = async () => {
      const refreshToken = localStorage.getItem("refresh_token");

      try {
        await instance.post("/api/logout/", {
          refresh_token: refreshToken,
        });

        // clear local storage
        localStorage.clear();

        // sets auth and staff bool to false
        setIsAuth(false);
        setIsStaff(null);
        setIsCustomer(null);
      } catch (error) {
        console.error("logout error: ", error);
      }
    };

    // calls logout function
    logoutUser();
  }, [setIsAuth, setIsStaff, setIsCustomer]);

  return <h1>you have been logged out</h1>;
}

export default Logout;
