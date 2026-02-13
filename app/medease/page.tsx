"use client";

import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "./_contexts/AuthContext";
import AppRouter from "./_components/AppRouter";
import "./_components/../medease-app.css";

export default function MedEasePage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "auto",
        background: "#ffffff",
        zIndex: 50,
      }}
    >
      <MemoryRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </MemoryRouter>
    </div>
  );
}
