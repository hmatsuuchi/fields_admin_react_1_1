import instance from "../staff/axios/axios_authenticated";

function Logout({ setIsAuth }) {
  try {
    instance
      .post("api/logout/", {
        refresh_token: localStorage.getItem("refresh_token"),
      })
      .then(() => {
        localStorage.clear();
        setIsAuth(false);
      })
      .catch((e) => {});
  } catch (e) {
    console.log("logout not working", e);
  }

  return <h1>you have been logged out</h1>;
}

export default Logout;
