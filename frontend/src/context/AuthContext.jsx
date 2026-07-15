/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";
import api, { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return JSON.parse(userData);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return null;
  });
  const [loading] = useState(false);

  const login = async (credentialsOrEmail, password) => {
    const credentials =
      typeof credentialsOrEmail === "object" && credentialsOrEmail !== null
        ? credentialsOrEmail
        : { email: credentialsOrEmail, password };

    try {
      const response = await authAPI.login(credentials);

      const { token, user: userData, verificationRequired } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);

      return {
        success: userData ? true : false,
        verificationRequired: Boolean(verificationRequired),
        email: userData?.email,
        user: userData,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      };
    }
  };
  const googleLogin = async (accessToken) => {
    try {
      const response = await authAPI.googleLogin(accessToken);

      const { token, user: userData } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);

      return {
        success: userData ? true : false,
        user: userData,
        message: response.data.message || "Successfully logged in with Google!",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Google login failed. Please try again.",
      };
    }
  };

  const register = async (credentials) => {
    try {
      const response = await authAPI.register( credentials);
      const { token, user: newUser, verificationRequired } = response.data;

      if (token && newUser) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(newUser));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(newUser);
      }

      return {
        success: !verificationRequired,
        verificationRequired: Boolean(verificationRequired),
        email: newUser?.email || credentials.email,
        user: newUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed.",
      };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put("/users/profile", profileData);
      const updatedUser = response.data;

      if (updatedUser?.id) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const nextUser = { ...currentUser, ...updatedUser };
        localStorage.setItem("user", JSON.stringify(nextUser));
        setUser(nextUser);
      }

      return {
        success: !response.data?.requiresVerification,
        requiresVerification: Boolean(response.data?.requiresVerification),
        message: response.data?.message,
        data: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update profile.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    setUser,
    login,
    googleLogin,
    register,
    updateProfile,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
