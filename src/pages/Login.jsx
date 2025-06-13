import React from "react";
import { useNavigate } from "react-router-dom";
import FormLogin from "../components/FormLogin";
import { Box, Typography, Paper, GlobalStyles } from "@mui/material";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    navigate("/dashboard");
  };

  return (
    <>
      {/* Ẩn scroll bar và đảm bảo banner full màn hình */}
      <GlobalStyles
        styles={{
          body: {
            overflow: "hidden",
          },
          html: {
            height: "100%",
          },
          "#root": {
            height: "100%",
          },
        }}
      />

      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <div
          elevation={10}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            minWidth: { xs: 320, md: 400 },
            maxWidth: 420,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FormLogin onLogin={handleLogin} />
        </div>
      </Box>
    </>
  );
}

export default Login;
