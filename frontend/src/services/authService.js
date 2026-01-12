import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

// Login user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user)); // ✅ Save user
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

// Register user
export const register = async ({ username, email, password }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user)); // ✅ Save user
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed";
  }
};

// Get JWT token from localStorage
export const getToken = () => localStorage.getItem("token");

// Get current logged-in user from localStorage
export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

// Logout user (client + optional server-side)
export const logout = async (notifyServer = false) => {
  try {
    // Optional: notify server to invalidate token/session
    if (notifyServer && getToken()) {
      try {
        await axios.post(`${API_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      } catch (error) {
        console.warn("Server logout failed, continuing with client cleanup:", error);
      }
    }

    // Clear all auth-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Clear any other auth-related items (add more if needed)
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiry");
    
    // Clear sessionStorage as well (in case any auth data is stored there)
    sessionStorage.clear();
    
    // Clear axios default headers if any were set
    delete axios.defaults.headers.common['Authorization'];
    
    return { success: true };
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};
