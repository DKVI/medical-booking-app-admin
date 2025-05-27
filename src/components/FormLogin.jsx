import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Alert,
} from "@mui/material";

function FormLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [generalError, setGeneralError] = useState(""); // State cho lỗi tổng quát

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
    setGeneralError(""); // Reset lỗi tổng quát trước khi validate
    if (validate()) {
      // Giả lập kiểm tra username và password
      if (username === "admin" && password === "admin123") {
        if (onLogin) {
          onLogin({ username, password });
        }
      } else {
        setGeneralError("Username or password was wrong!"); // Hiển thị lỗi tổng quát
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username} // Hiển thị lỗi nếu có
            helperText={errors.username} // Hiển thị thông báo lỗi
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password} // Hiển thị lỗi nếu có
            helperText={errors.password} // Hiển thị thông báo lỗi
          />
          {generalError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {generalError}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default FormLogin;
