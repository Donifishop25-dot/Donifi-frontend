import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import { RefreshProvider } from "./context/RefreshContext";
import { HelmetProvider } from "react-helmet-async";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Tooltip } from "bootstrap";
import { LoadingProvider } from "./context/LoadingContext";
import { BookmarkProvider } from "./context/BookmarkContext"; // ✅ ADD THIS


function BootstrapInit() {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );

    tooltipTriggerList.forEach(el => {
      new Tooltip(el);
    });
  }, []);

  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <RefreshProvider>
          <LoadingProvider>
            <BookmarkProvider>   {/* ✅ ADD THIS */}
              <BootstrapInit />
              <App />
            </BookmarkProvider> {/* ✅ ADD THIS */}
          </LoadingProvider>
        </RefreshProvider>
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>
);
