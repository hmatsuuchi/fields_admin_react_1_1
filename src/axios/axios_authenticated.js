import axios from "axios";

// authenticated axios instance
const instance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  // baseURL: "https://fieldsadmin.dev/",
  withCredentials: true,
});

export default instance;
