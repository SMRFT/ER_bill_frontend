import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';
function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg2NyIsImVtYWlsIjoiUGFydGhpcGFuMzEyMTQ2MUBnbWFpbC5jb20iLCJuYW1lIjoiTS5QYXJ0aGliYW4iLCJhbGxvd2VkLWFjdGlvbnMiOlsiU0QtUC1CVEQtUlciLCJTRC1BUEktVE0tUiIsIlNELVAtR1BELVIiLCJTSEktUC1FTVItUlciLCJTRC1QLUJURC1SIiwiU0hJLVAtVFJBSU4tUlciLCJTSEktUC1GMlItUlciLCJTRC1QLVNDLVIiLCJTVC1QLURFUy1SIiwiRVItUC1FUkFTLVJXIiwiU0QtUC1DSEMtUlciLCJTRC1BUEktU1MtUlciLCJTRC1QLVNTVS1SIiwiU0QtUC1QT1YtUiIsIlNELUFQSS1SQi1SIiwiU1QtUi1BIiwiU0hJLVAtTVJJLVJXIiwiU0QtUC1QQi1SVyIsIk1EQy1SLVBEQyIsIlNELUFQSS1DTi1SIiwiU0hJLVAtUEhZLVJXIiwiU0QtUC1NSVMtUiIsIlNISS1QLVBIQVJNLVJXIiwiU1QtUC1OVEYtUlciLCJTSEktUC1NUkQtUlciLCJFUi1SLUVSQSIsIlNISS1QLUYzLVJXIiwiU0hJLVAtQ0hFTU9SLVJXIiwiR0wtUC1SU0UtUlciLCJTRC1QLVRELVIiLCJTSEktUC1PVC1SVyIsIlNISS1QLUNIRU1PLVJXIiwiTURDLUFQSS1DR1AtUlciLCJTSEktUC1YUkFZLVJXIiwiTURDLVAtR0NQLVIiLCJTRC1QLUJBLVJXIiwiU0hJLVAtRjFTLVJXIiwiU0hJLVAtQVZBSUwtUlciLCJTRC1QLVNTLVIiLCJTRC1QLUxTRC1SVyIsIlNELVAtSE1TR0ItUiIsIkdMLVAtRVAtUlciLCJTRC1QLUxHU0MtUiIsIlNELVAtVVBCLVJXIiwiU0hJLVAtRk9STS1SVyIsIlNELVAtQkctUlciLCJTRC1QLUxTQ0wtUlciLCJTSEktUC1FWFAtUlciLCJTRC1QLVBMLVIiLCJTVC1BUEktQU1DLVJXIiwiU0hJLVAtTklDVVItUlciLCJTSEktUC1UUkFJTlItUlciLCJNREMtQVBJLU9HUC1SVyIsIlNELVAtTFNDLVJXIiwiU0hJLVAtRjJTUi1SVyIsIlNELVAtREYtUlciLCJTRC1QLUJHLVIiLCJTVC1QLVRETC1SIiwiU0QtUC1MR0xELVIiLCJTRC1QLVRELVJXIiwiR0wtUC1OREMtUlciLCJTVC1QLUJSRC1SIiwiU0hJLVAtTUlDVVItUlciLCJTRC1QLUxQSS1SIiwiU0hJLVAtR0VUUkFXLVJXIiwiU0hJLVAtRjItUlciLCJTSEktUC1IQU5EUi1SVyIsIlNELVAtU1NVLVJXIiwiU0hJLVAtSEFORC1SVyIsIlNELVAtTFJDLVIiLCJTSEktUC1GUk5ULVJXIiwiTURDLUFQSS1QREMtUlciLCJTVC1BUEktQ1JELVJXIiwiU0QtUi1DRU8iLCJTSEktUC1GMS1SVyIsIlNELVAtR1NQLVIiLCJTRC1QLVBELVIiLCJTVC1QLVNOTy1SVyIsIk1EQy1BUEktUEdQLVJXIiwiTURDLVAtR1BQLVIiLCJHTC1QLUVBRC1SVyIsIlNELVAtQ0hDLVIiLCJTSEktUC1NT0NLLVJXIiwiU0QtUC1QRy1SVyIsIlNISS1QLUYxU1ItUlciLCJTSEktUC1SRUNSLVJXIiwiU1QtQVBJLUJSRC1SVyIsIlNULVAtREVTLVJXIiwiU0QtUC1ERi1SIiwiTURDLVAtQUFVLVJXIiwiTURDLVAtUE5QUi1SIiwiTURDLVAtR0FQLVIiLCJTRC1QLUhNU1BCLVJXIiwiU0QtUC1QT1YtUlciLCJTSEktUC1TSUNVUi1SVyIsIlNELVAtTEJOLVIiLCJTVC1QLUNNVC1SVyIsIlNISS1QLU5JQ1UtUlciLCJTRC1SLVNNQyIsIlNISS1QLU1JQ1UtUlciLCJTVC1BUEktRU1QLVIiLCJTVC1QLVRETC1SVyIsIlNISS1QLVNJQ1UtUlciLCJHUC1QLUdDTi1SIiwiU0hJLVAtT1BELVJXIiwiU0hJLVAtRU1SUi1SVyIsIlNELVAtU1AtUiIsIk1EQy1BUEktU0dQLVJXIiwiU0hJLVAtVVBEUkFXLVJXIiwiR0wtUC1QLVJXIiwiR0wtUC1BTkQtUlciLCJTRC1QLVNTLVJXIiwiU0hJLVAtSU5DIiwiR0wtUC1FRC1SVyIsIlNISS1QLUYyUy1SVyIsIlNISS1QLUNULVJXIiwiU0QtUC1HUEItUiIsIlNISS1QLUxBQi1SVyIsIlNISS1QLUYzUi1SVyIsIlNULVAtTlRGLVIiLCJNREMtUC1HT1AtUiIsIlNISS1QLUhSLVJXIiwiU0ktUi1JTkRFIiwiTURDLUFQSS1BVC1SIiwiU1QtUC1DTVQtUiIsIlNELUFQSS1UVi1SIiwiR0wtUC1FQlQtUlciLCJNREMtQVBJLUFHUC1SVyIsIlNISS1QLUYxUi1SVyIsIlNELVAtUkItUlciLCJTRC1BUEktVEQtUiIsIlNELVAtTFVTQ0QtUlciLCJNREMtUC1HU1AtUiIsIlNELUFQSS1UTS1SVyIsIlNELVAtUEYtUlciLCJTSEktUC1SRUMtUlciLCJTSEktUC1ESUEtUlciLCJHTC1QLUVMLVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NzAxODgwOTIsImV4cCI6MTc3MDI3NTA5MiwianRpIjoiMmM2M2UzODUtMDI3OC00MmMzLTg3ODItNDllZGQ2NzJkYTYzIn0.cBojkLNGSpG5cQuBvDbBqAMeKV49yV_Rtout-oBODniDXRw2L1n4lYtEpy3q5Ck7AMD2L4Yb-LOVuz2lViapU14kbwfYRAmImP1McpqvQnSmOmc8rtJrSiqVL7Hsqc0bVkOH9-FPfWmq9pL9W2HUYOhCyd3a1QFjNmEIgRs6xyLiEr3i8xfx6ji9Ksv_43q56Fx2ogAKprG-M4p1h956NrHJ0pSyB5SjLSleNBqF4ZMfvPzrCRKGiucXmRgMCE5S1PYCFoUFNgkjZ67W_It7tBcmDZncUyCNZPK0dieoBSXbCi8Ona2Y4CrI3ENAQ8m2fHS8DaOJhsxq8cBfKW3M1Q";
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

  return isValidToken ? <App /> : null;
}


const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <StrictMode>
    <RootRenderer />
  </StrictMode>
);