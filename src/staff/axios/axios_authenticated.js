import axios from "axios";

// authenticated axios instance
const instance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  // baseURL: "http://64.176.53.171/",
  // headers: {
  //   "Content-Type": "application/json",
  //   Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  // },
});

export default instance;
