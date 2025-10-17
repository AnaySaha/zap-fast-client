import React from 'react';
import { useEffect } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", // ✅ adjust as needed
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();

  useEffect(() => {
    // Add authorization header if token exists
    axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle unauthorized (401) or forbidden (403) errors
    axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && [401, 403].includes(error.response.status)) {
          await logOut();
        }
        return Promise.reject(error);
      }
    );
  }, [logOut, user]);

  return axiosSecure;
};

export default useAxiosSecure;
