import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api", // use your real backend endpoint
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
