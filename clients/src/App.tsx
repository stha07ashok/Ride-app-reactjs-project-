import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import MobileSidebar from "./components/MobileSidebar";
import AppRoutes from "./router/routes";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Header onSidebarOpen={() => setSidebarOpen(true)} />
          <AppRoutes />
          <MobileSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "8px",
                background: "#eab308",
                color: "#000",
                fontSize: "14px",
                fontWeight: 500,
              },
            }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
