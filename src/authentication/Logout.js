import { useEffect } from "react";
import instance from "../staff/axios/axios_authenticated";

function Logout({ setIsAuth, setIsStaff, setIsCustomer }) {
  useEffect(() => {
    const logoutUser = async () => {
      // get csrf token from DOM head
      const csrfToken = document
        .querySelector("[name=csrftoken]")
        .getAttribute("content");

      try {
        await instance.post(
          "/api/logout/",
          {},
          { headers: { "X-CSRFToken": csrfToken } }
        );

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
