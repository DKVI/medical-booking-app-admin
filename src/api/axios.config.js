import axios from "axios";

// Tạo một instance của Axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1/",
  timeout: 10000, //
  headers: {
    "Content-Type": "application/json",
  },
  "Access-Control-Allow-Origin": "*",
});

export default axiosInstance;
