

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "sweetalert2/dist/sweetalert2.min.css";
import App from "./App";

import { AuthProvider } from "./auth/AuthContext";
import { AppSettingsProvider } from "./context/AppSettingsContext";
import { LogoSettingsProvider } from "./context/LogoSettingsContext";
import { ProfileProvider } from "./context/ProfileContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthProvider>
      <AppSettingsProvider>
        <LogoSettingsProvider>
          <ProfileProvider>
            <App />
          </ProfileProvider>
        </LogoSettingsProvider>
      </AppSettingsProvider>
    </AuthProvider>
  </ThemeProvider>,
);
