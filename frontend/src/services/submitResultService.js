import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/scores/manual`;

// Submit a race result manuely
export const submitResult = async (season, round, qualifyingWinner, raceTopThree) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not logged in");

  const res = await axios.post(
    API_URL,
    { season, round, qualifyingWinner, raceTopThree },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};