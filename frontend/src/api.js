// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // from your .env file
  withCredentials: true,                  // needed if using cookies
});

export default api;