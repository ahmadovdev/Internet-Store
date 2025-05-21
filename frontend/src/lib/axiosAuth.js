// src/lib/axiosAuth.js
import axios from "axios";

const axiosAuth = axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:5221/api" : "/api",
    withCredentials: true, 
});

export default axiosAuth;
