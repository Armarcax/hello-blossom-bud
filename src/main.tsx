import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n"; // Initialize i18n before app renders

const container = document.getElementById("root");

if (!container) {
  // Clear and explicit error for easier debugging when root is missing
  throw new Error("Root element with id 'root' not found in index.html");
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
