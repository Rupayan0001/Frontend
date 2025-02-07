import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://renokon-backend.onrender.com/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
