import { useEffect } from "react";
import instance from "../axios/axios_authenticated";

function Logout({
  setIsAuth,
  setIsStaff,
  setIsCustomer,
  setIsDisplay,
  csrfToken,
}) {
  useEffect(() => {
    const logoutUser = async () => {
      try {
        await instance
          .post("/api/logout/", {}, { headers: { "X-CSRFToken": csrfToken } })
          .then((response) => {
            // clear local storage
            localStorage.clear();

            // sets auth, staff, customer, and display to null
            setIsAuth(false);
            setIsStaff(null);
            setIsCustomer(null);
            setIsDisplay(null);
          });
      } catch (error) {
        console.error("logout error: ", error);
      }
    };

    // calls logout function
    logoutUser();
  }, [setIsAuth, setIsStaff, setIsCustomer, setIsDisplay, csrfToken]);

  return <h1>you have been logged out</h1>;
}

export default Logout;
