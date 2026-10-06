// TODO: Implement api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // CRITICAL: Allows httpOnly cookies to be sent
});

export default api;
