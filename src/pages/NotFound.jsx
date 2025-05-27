import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circle */}
      <Box
        sx={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(33,150,243,0.08)",
          top: 40,
          left: -100,
          zIndex: 0,
        }}
      />
      {/* Decorative circle */}
      <Box
        sx={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(33,150,243,0.10)",
          bottom: 60,
          right: -60,
          zIndex: 0,
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          size="4x"
          color="#1976d2"
          style={{ marginBottom: 24 }}
        />
        <Typography
          variant="h1"
          fontWeight={700}
          color="#1976d2"
          gutterBottom
          sx={{
            fontSize: { xs: 80, md: 120 },
            letterSpacing: 8,
            textShadow: "0 4px 24px rgba(33,150,243,0.10)",
          }}
        >
          404
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          mb={2}
          sx={{ fontWeight: 600, fontSize: { xs: 22, md: 28 } }}
        >
          Oops! Page Not Found
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          mb={4}
          sx={{ maxWidth: 400, mx: "auto" }}
        >
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>
        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          sx={{
            background: "#2196f3",
            color: "#fff",
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            fontSize: 18,
            boxShadow: "0 4px 24px 0 rgba(33,150,243,0.10)",
            textTransform: "none",
            letterSpacing: 1,
            "&:hover": {
              background: "#1976d2",
            },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
}
