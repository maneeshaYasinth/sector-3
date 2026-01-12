import axios from "axios";
import { getToken } from "./authService";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/teamradio`;

/**
 * Fetch team radio for a given driber number.
 *
 * @param {string} driver_number - driver number (e.g., "1,4,23").
 */

export const getTeamRadioMessages = async (driver_number) => {
  try {
    const token = getToken();

    let url = `${API_URL}?driver_number=${driver_number}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching team radio messages:", error);
    throw error;
  }
};

