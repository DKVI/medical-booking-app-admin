import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function FormLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [generalError, setGeneralError] = useState("");

  const validate = () => {
    let isValid = true;
    const newErrors = { username: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError("");
    if (validate()) {
      if (username === "admin" && password === "admin123") {
        if (onLogin) {
          onLogin({ username, password });
        }
      } else {
        setGeneralError("Username or password was wrong!");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          minWidth: 400,
          maxWidth: 440,
          borderRadius: 4,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(2px)",
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3f51b5 60%, #5c6bc0 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h3" sx={{ color: "#fff", fontWeight: 700 }}>
            <span role="img" aria-label="lock">
              🔒
            </span>
          </Typography>
        </Box>
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: 700, color: "#3f51b5", letterSpacing: 1 }}
        >
          Admin Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            label="Username"
            variant="outlined"
            size="medium"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
            sx={{ background: "#f5f7fa", borderRadius: 1 }}
          />
          <TextField
            label="Password"
            variant="outlined"
            size="medium"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ background: "#f5f7fa", borderRadius: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mt: 0.5,
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              color="primary"
              sx={{
                cursor: "pointer",
                textDecoration: "underline",
                width: "100%",
                textAlign: "center",
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: 0.2,
              }}
              onClick={() =>
                alert("Please contact admin to reset your password.")
              }
            >
              Forgot your password? Please contact the administrator to reset
              your password.
            </Typography>
          </Box>
          {generalError && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {generalError}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              fontWeight: 700,
              background: "linear-gradient(90deg, #3f51b5 60%, #5c6bc0 100%)",
              color: "#fff",
              letterSpacing: 1,
              py: 1.2,
              fontSize: 17,
              borderRadius: 2,
              boxShadow: "0 4px 16px 0 rgba(63,81,181,0.10)",
              transition: "0.2s",
              "&:hover": {
                background: "linear-gradient(90deg, #5c6bc0 60%, #3f51b5 100%)",
                boxShadow: "0 6px 24px 0 rgba(63,81,181,0.18)",
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default FormLogin;
