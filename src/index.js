import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';
function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4OCIsImVtYWlsIjoiY2hhbmRyYXNtcmZ0QGdtYWlsLmNvbSIsIm5hbWUiOiJMYWtzaGl2IiwiYWxsb3dlZC1hY3Rpb25zIjpbIkVSLVAtRVJQLVIiLCJFUi1SLUVSUCIsIlNELVItTFMiLCJHUC1QLUdDTi1SIiwiRVItUC1FUkFTLVIiLCJFUi1QLUVSVVMtUlciLCJTRC1QLVNHQUMtUiIsIlNELVAtTEdTQy1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDIiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NjUxODUxMTEsImV4cCI6MTc2NTI3MjExMSwianRpIjoiYjdlZGY4NDctNzJmNS00NTMxLTllYmUtOWNjNDg3MWMxZTA5In0.IJHqvUTf3GAIx0TBngOCR0E3qTFiL3xWjWlg7a6I0ZnWqg1qLaIHAumJQymFhxGhd2gN0ejzbmZ2rp1J8HidaaN9kPS1z_EI1nmXYnQ_8ZXQMwgAcCTvaUrvPD68HA0MhA7Oq8BWQ-vnL9p27thRlfgRwfWf9QCDt9BZHv3QtZtQegLRBfZ59VbIP5KzLrWNZWjN5QGW19k0Rymehp2HAKZlIJ-oJCzwOiBl3j8BUpSs94RSN9LQHI2RNe46LArJ2HVEF5smPkYf-mZ0nB8sX_GxXDWkBPiNLNgAf0a2mW9F7RqLAj-x0qOaytNm8Nux3Mh2pCysta_l7eBo4kkz7w";
  const selectedBranch = "SHB001"
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