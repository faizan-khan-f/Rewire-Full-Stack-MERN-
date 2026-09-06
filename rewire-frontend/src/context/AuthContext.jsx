/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Safe JSON parse helper
const safeParse = (str) => {
  try {
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    safeParse(localStorage.getItem("user")),
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // The base URL for your backend API
  const API_URL = `${import.meta.env.VITE_API_URL}/auth`;
  // const API_URL = "http://localhost:5000/api/auth";

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        // Navigation is handled by the calling component (AuthPage) to allow animations
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message,
      );
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        // Navigation is handled by the calling component (AuthPage) to allow animations
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message,
      );
      throw error;
    }
  };

  const updateUser = (updatedData) => {
    setUser(updatedData);
    localStorage.setItem("user", JSON.stringify(updatedData));
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser: updateUser, register, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
