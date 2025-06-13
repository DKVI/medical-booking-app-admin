import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import AuthLayout from "./layouts/AuthenLayout";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Facilities from "./pages/Facilities";
import Appointments from "./pages/Appointments";
import Purchase from "./pages/Purchase";
import Doctor from "./pages/Doctor";
import Specialties from "./pages/Specialties";
import Users from "./pages/Users";

function AppRoutes() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Kiểm tra trạng thái đăng nhập

  return useRoutes([
    // Route mặc định ("/")
    {
      path: "/",
      element: <Navigate to={isLoggedIn ? "/dashboard" : "/login"} />,
    },
    // Routes yêu cầu đăng nhập
    {
      path: "/dashboard",
      element: isLoggedIn ? <MainLayout /> : <Navigate to="/login" />,
      children: [{ path: "", element: <Dashboard /> }],
    },
    {
      path: "/specialties",
      element: isLoggedIn ? <MainLayout /> : <Navigate to="/specialties" />,
      children: [{ path: "", element: <Specialties /> }],
    },
    {
      path: "/facilities",
      element: isLoggedIn ? <MainLayout /> : <Navigate to="/facilities" />,
      children: [{ path: "", element: <Facilities /> }],
    },
    {
      path: "/appointments",
      element: isLoggedIn ? <MainLayout /> : <Navigate to="/appointments" />,
      children: [{ path: "", element: <Appointments /> }],
    },
    {
      path: "/purchase",
      element: isLoggedIn ? <MainLayout /> : <Navigate to="/purchase" />,
      children: [{ path: "", element: <Purchase /> }],
    },
    {
      path: "/doctors",
      element: isLoggedIn ? <MainLayout /> : <Navigate to="/doctors" />,
      children: [{ path: "", element: <Doctor /> }],
    },
    {
      path: "/users",
      element: isLoggedIn ? <MainLayout /> : <Navigate to="/users" />,
      children: [{ path: "", element: <Users /> }],
    },
    // Routes không yêu cầu đăng nhập
    {
      path: "/login",
      element: <AuthLayout />,
      children: [{ path: "", element: <Login /> }],
    },
    // Route 404
    { path: "*", element: <NotFound /> },
  ]);
}

export default AppRoutes;
