import axios from "axios";

// create authenticated axios instance
const instance_public = axios.create({
  baseURL: "http://127.0.0.1:8000",
  // baseURL: "https://fieldsadmin.dev/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default instance_public;
