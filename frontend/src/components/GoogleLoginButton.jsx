import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSuccess = async (response) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google-login`,
        { token: response.credential }
      );

      // Save token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // Update auth context
      loginUser(res.data.user);
      
      // Navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Google Login Failed:", error);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.log("Google Login Failed");
        alert("Google login failed. Please try again.");
      }}
    />
  );
};

export default GoogleLoginButton;
