import axios from "axios";
import { getToken } from "./authService";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/scores/leaderboard`;

/**
 * 
 * @param {string} season 
 * @returns {Promise<Array>} 
 */
export const getLeaderboard = async (season) => {
  try {
    const token = getToken();
    const url = `${API_URL}?season=${season}`; // send season as query param
    const res = await axios.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
};
