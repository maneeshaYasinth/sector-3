import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/predictions`;

// Submit a prediction
export const submitPrediction = async (season, round, qualifyingWinner, raceTopThree) => {
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

// Get user's predictions
export const getMyPredictions = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not logged in");

  const res = await axios.get(`${API_URL}/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
