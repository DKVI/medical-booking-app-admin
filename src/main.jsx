import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./App";
import "./index.css"; // Import TailwindCSS

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
