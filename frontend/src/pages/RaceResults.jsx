import { useEffect, useState } from "react";
import { getRaceResults } from "../services/raceResultService";
import TeamRadioNavigate from "../components/TeamRadioButton";

export default function RaceResults() {
  const [results, setResults] = useState([]);
  const [season, setSeason] = useState("2025"); // default season
  const [round, setRound] = useState("1"); // default round
  const [loading, setLoading] = useState(true);
  const [raceName, setRaceName] = useState(""); // store current race name

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRaceResults(season, round);
        setResults(data);

        // Set race name if data exists
        if (data.length > 0) {
          setRaceName(data[0].raceName);
        } else {
          setRaceName("");
        }
      } catch (error) {
        console.error("Failed to load race results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [season, round]);

  const handleSeasonChange = (e) => setSeason(e.target.value);
  const handleRoundChange = (e) => setRound(e.target.value);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0000] to-[#120000] text-white flex flex-col items-center py-12">
      <TeamRadioNavigate />
      <h2 className="text-4xl font-extrabold mt-18 mb-8 tracking-wide text-red-600 drop-shadow-lg">
        {loading
          ? "Loading Race Results..."
          : raceName
          ? `${raceName} Race Results`
          : "Race Results"}
      </h2>

      {/* Season Selector with glass effect */}
      <div className="mb-6 w-48">
        <select
          value={season}
          onChange={handleSeasonChange}
          className="w-full p-2 rounded-lg text-white bg-red-800 backdrop-blur-md border border-red-600  transition duration-300"
        >
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
      </div>

      {/* Round Selector with glass effect */}
      <div className="mb-6 w-48">
        <select
          value={round}
          onChange={handleRoundChange}
          className="w-full p-2 rounded-lg text-white bg-red-800 backdrop-blur-md border border-red-600  transition duration-300"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Round {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Results Table */}
      <div className="w-11/12 md:w-4/5 overflow-x-auto rounded-xl bg-white/10 backdrop-blur-md border border-red-600 shadow-lg">
        <table className="w-full text-center min-w-max md:min-w-full">
          <thead>
            <tr className="bg-red-700/30 backdrop-blur-md">
              <th className="p-3">Position</th>
              <th className="p-3">Driver</th>
              <th className="p-3">Constructor</th>
              <th className="p-3">Points</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-gray-400">
                  Loading race results...
                </td>
              </tr>
            ) : results.length > 0 ? (
              results.flatMap((race) =>
                race.results.map((r) => (
                  <tr
                    key={`${race.raceName}-${r.driver}`}
                    className="even:bg-white/5 hover:bg-red-600/20 transition-colors duration-300"
                  >
                    <td className="p-3">{r.position}</td>
                    <td className="p-3">{r.driver}</td>
                    <td className="p-3">{r.constructor}</td>
                    <td className="p-3">{r.points}</td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-gray-400">
                  No results available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
