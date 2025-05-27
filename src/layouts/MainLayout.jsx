import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div>
      {/* Header bao bọc toàn bộ nội dung */}
      <Header>
        {/* Nội dung chính của các route con */}
        <main
          style={{
            minHeight: "100vh",
            padding: "80px",
            paddingTop: "64px", // Đảm bảo nội dung không bị che bởi AppBar
            overflow: "auto",
          }}
        >
          <Outlet />
        </main>
      </Header>
    </div>
  );
}

export default MainLayout;
