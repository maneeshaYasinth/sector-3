import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth(); // ✅ get context function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password); // login via authService
      loginUser(data.user);                     // ✅ update context immediately
      navigate("/");                             // redirect after login
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#1a0000] to-[#120000]">
      <form
        onSubmit={handleSubmit}
        className="bg-white/30 backdrop-blur-lg shadow-lg p-8 rounded-2xl w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
        >
          Login
        </button>
        
        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-400" />
          <span className="px-3 text-white text-sm">OR</span>
          <hr className="flex-grow border-gray-400" />
        </div>
        
        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>
        
        <p className="text-sm text-center mt-4 text-white">
          Don't have an account?{" "}
          <Link to="/register" className="text-red-300 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
