import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

function AuthenLayout() {
  useEffect(() => {
    localStorage.clear();
  });
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Welcome to Medical Booking App</h1>
      <Outlet />
    </div>
  );
}

export default AuthenLayout;
