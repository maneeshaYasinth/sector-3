import axios from "axios";
import { getToken } from "./authService";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/results`;

/**
 * Fetch race results for a given season and round.
 *
 * @param {string} season - F1 season year (e.g., "2025").
 * @param {string|number} [round] - Specific round (optional).
 * @returns {Promise<Array>} - Race results data from backend.
 */
export const getRaceResults = async (season, round) => {
  try {
    const token = getToken();

    // Build query params dynamically
    let url = `${API_URL}?season=${season}`;
    if (round) {
      url += `&round=${round}`;
    }

    const res = await axios.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching race results:", error);
    throw error;
  }
};
