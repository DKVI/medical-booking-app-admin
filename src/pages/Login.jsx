import React from "react";
import { useNavigate } from "react-router-dom";
import FormLogin from "../components/FormLogin";
function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <FormLogin onLogin={handleLogin} />
    </div>
  );
}

export default Login;
