import axios from "axios";

// create authenticated axios instance
const instance_public = axios.create({
  baseURL: "http://127.0.0.1:8000",
  // baseURL: "http://64.176.53.171/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance_public;
