import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';
function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4OCIsImVtYWlsIjoiY2hhbmRyYXNtcmZ0QGdtYWlsLmNvbSIsIm5hbWUiOiJMYWtzaGl2IiwiYWxsb3dlZC1hY3Rpb25zIjpbIkVSLVItRVJQIiwiU0QtUi1MUyIsIkdQLVAtR0NOLVIiLCJFUi1QLUVSUC1SVyIsIkVSLVAtRVJVUy1SVyIsIlNELVAtU0dBQy1SIiwiU0QtUC1MR1NDLVIiXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMiJdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc2NDU2Mjk1NSwiZXhwIjoxNzY0NjQ5OTU1LCJqdGkiOiIzN2ZhMTA0ZC02NWY4LTRjODgtYTkzYy1kMjkwMzliYTYwNDYifQ.VBoJvgvJKxAfP-9PZDFsPswKuR1tVS0KSU3TTreMoTuipqmCCeKeX2FZaEAFPvPTM3MNh8WIqpVfjO8Br4pUbWF71bjbNex01GpjOvs3N9Ve1j2TeNdEh_a2MDs8Hm8_UysF-nVGDfJLgZ-4aOStpvfIxQCeM2TCkkCGbalSACOv6URTAfI_9Wn_jC_QjCr-AuRgVqMLDxuwL6l36WoKCLGBY8WVorCieytutacQzwG_iwcv8WDBbPxS7I__tR33N9x4jpAE3yOBSWjwf0DNgwGRhPwwXOnbvrIGlLZNCk-BZbxx_PGQ0jA694jmT9E3BvIqCOYK2v4ranQTU6aSGQ";
  const selectedBranch = "SHB001";
  localStorage.setItem("access_token", dev_token);
  localStorage.setItem("selected_branch", selectedBranch);
  return dev_token;
}

function validate(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      throw new Error("Token expired");
    }
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}
function RootRenderer() {
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    let accessToken = localStorage.getItem("access_token");
    // For local development environment
    if (!accessToken && process.env.REACT_APP_LOCAL_DEV_ENVIRONMENT === 'true') {
      accessToken = setForLocalDev();
    }

    try {
      if (!accessToken) throw new Error("No token found");
      const payload = validate(accessToken);

      // Store full payload as user_payload (for use elsewhere)
      localStorage.setItem("user_payload", JSON.stringify(payload));
      
      // Extract allowedActions as array (defensively)
      let allowedActions = [];
      if (Array.isArray(payload["allowed-actions"])) {
        allowedActions = payload["allowed-actions"];
      } else if (typeof payload["allowed-actions"] === "string") {
        try {
          allowedActions = JSON.parse(payload["allowed-actions"]);
        } catch {
          allowedActions = [payload["allowed-actions"]];
        }
      }

      
              // Determine role based on allowedActions
        let role = 'ER Nurse'; // Default fallback

        if (allowedActions.includes('ER-R-ERA')) {
          role = 'ER Admin';
        } else if (allowedActions.includes('ER-R-ERN')) {
          role = 'ER Nurse';
        } else if (allowedActions.includes('ER-R-ERP')) {
          role = 'ER Pharmacy';
        }


      localStorage.setItem('role', role);
      setIsValidToken(true);

    } catch (err) {
      // Clean up any invalid tokens or roles
      console.error("Token validation failed:", err.message);
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_payload");
      localStorage.removeItem("role");
    }
  }, []);

  return isValidToken ? (
    <BrowserRouter basename='/ERBilling'>
      <App />
    </BrowserRouter>
  ) : null;
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <StrictMode>
    <RootRenderer />
  </StrictMode>
);