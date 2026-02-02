import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';
function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiRVItUC1FUkRMLVIiLCJTSU4tUi1TQSIsIlNULVAtQ01ULVJXIiwiU0lOLVAtR0RMLVIiLCJTSU4tQVBJLUZVLVJXIiwiTURDLUFQSS1HQVMtUiIsIlNULUFQSS1FTVAtUiIsIlNULVAtVERMLVJXIiwiTURDLUFQSS1MQk4tUiIsIkhNUy1QLUNTLVJXIiwiRVItUC1FUkdOQk4tUiIsIlNJTi1BUEktU0YtUiIsIkhNUy1SLVBIIiwiTURDLUFQSS1QREMtUlciLCJTVC1BUEktQ1JELVJXIiwiU1QtUC1ERVMtUiIsIlNELVItUEgiLCJNREMtQVBJLVNHUC1SVyIsIkdQLVAtR0NOLVIiLCJTVC1QLVNOTy1SVyIsIk1EQy1QLVJFRy1SIiwiU0lOLVAtR0lDLVIiLCJNREMtUC1UUkItUlciLCJNREMtQVBJLVBHUC1SVyIsIkVSLVItRVJOIiwiTURDLVAtUE5QLVIiLCJNREMtUC1TT1ItUiIsIk1EQy1QLUdQUC1SIiwiTURDLVAtQVNNLVJXIiwiU1QtQVBJLUFNQy1SVyIsIlNULVItQSIsIkVSLVAtRVJQTC1SIiwiTURDLUFQSS1QQVQtUiIsIk1EQy1QLU9TQi1SVyIsIk1EQy1BUEktQURNLVJXIiwiSE1TLVAtVkwtUlciLCJNREMtQVBJLU9HUC1SVyIsIlNULUFQSS1CUkQtUlciLCJTRC1QLVBIRC1SVyIsIk1EQy1BUEktVEhSLVIiLCJTVC1QLURFUy1SVyIsIk1EQy1QLUFBVS1SVyIsIk1EQy1QLVBOUFItUiIsIk1EQy1QLVJFRy1SVyIsIk1EQy1QLUdPUC1SIiwiTURDLUFQSS1DRFItUiIsIlNULVAtTlRGLVIiLCJNREMtUi1BRE0iLCJNREMtUC1HQVAtUiIsIlNULVAtTlRGLVJXIiwiRVItUC1FUlJFUC1SVyIsIk1EQy1BUEktQVQtUiIsIlNULVAtQ01ULVIiLCJTVC1QLVRETC1SIiwiTURDLUFQSS1BVC1SVyIsIk1EQy1QLVBOUC1SVyIsIlNJTi1BUEktSUYtUlciLCJITVMtUC1IU04tUlciLCJTRC1QLVBIUi1SVyIsIlNJTi1BUEktT1JSLVIiLCJTRC1QLUdQVC1SIiwiU0QtUC1QT1YtUlciLCJNREMtUC1HU1AtUiIsIk1EQy1BUEktQUdQLVJXIiwiU1QtUC1CUkQtUiIsIk1EQy1BUEktUlRTLVIiLCJTSU4tQVBJLU9SLVJXIiwiU0QtQVBJLVRNLVJXIiwiRVItUC1FUlBCLVJXIiwiTURDLUFQSS1SREwtUlciLCJNREMtQVBJLUNHUC1SVyIsIk1EQy1BUEktUEFUIiwiTURDLVAtR0NQLVIiLCJFUi1QLUVSQi1SVyJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzcwMDAxOTAzLCJleHAiOjE3NzAwODg5MDMsImp0aSI6IjYwMmJhYjc5LTc0ZmQtNDUwNS1iYmViLTlhMzdiOWIyNmUxMiJ9.Os2PcrWbBvYEtd5T0IOHsm5K4lKoTQ_zugHu4wGmBp8M8HI3l2Yg6g1HBx9Q_Dz82CYxMpNQEqERdPDa5QVSQ9fxc4tw7HSQuFNe3zcSKdVb1wV1X1vV4OQ3s695QQNxV2zxaHkaYKBe99ciDJPrGr1EUEf0lC--7XhqVTJZ40dy5Z2BMh352N82p6sDdsCrf1ja7GR1Ju98oN1b7bp_eTURC7zSBQGf59MX2Sagz3fOlpdGxYENyyXZyXfgOeZHIPaxUGMTj7Lqkmx-VuFwufDhwUC-apRL6yJXejYKmNViXmEdcdr55zJOTGjPQkFGXDy4XWO2akY4g1uBZRbjLA";
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