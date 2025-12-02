import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';
function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiU0QtUC1HRC1SIiwiU0QtUC1SRC1SVyIsIlNISS1QLVJFQy1SVyIsIlNISS1QLUVYUC1SVyIsIlNULVItQ0RSIiwiTURDLUFQSS1BRE0tUlciLCJNREMtQVBJLUFULVJXIiwiU0QtUC1UREUtUlciLCJTSEktUC1GMlNSLVJXIiwiTURDLUFQSS1QQVQtUiIsIk1EQy1QLVBOUC1SIiwiU0hJLVAtU0lDVS1SVyIsIlNISS1QLUYxU1ItUlciLCJTSEktUC1VUERSQVctUlciLCJTSEktUC1NT0NLLVJXIiwiU0hJLVAtTUlDVS1SVyIsIlNULVAtQlJELVIiLCJTVC1QLUNNVC1SVyIsIlNISS1QLVhSQVktUlciLCJTSEktUC1GT1JNLVJXIiwiU0hJLVAtQVZBSUwtUlciLCJFUi1SLUVSTiIsIlNISS1QLVRSQUlOLVJXIiwiU1QtUC1OVEYtUiIsIlNISS1QLUxBQi1SVyIsIlNISS1QLUYzLVJXIiwiTURDLVAtU09SLVIiLCJTSEktUC1DVC1SVyIsIlNISS1QLUYyLVJXIiwiU0hJLVAtRjFTLVJXIiwiU0QtUC1ITVNHQy1SIiwiRVItUC1FUkRMLVIiLCJTRC1QLVJHLVJXIiwiU1QtUi1FTVAiLCJTSEktUC1UUkFJTlItUlciLCJNREMtQVBJLUdBUy1SIiwiU0hJLVAtRjJTLVJXIiwiU0hJLVAtRjNSLVJXIiwiU0hJLVAtUEhZLVJXIiwiU0QtUC1ITVNMRC1SIiwiU1QtQVBJLUNSRC1SIiwiU0QtUC1ITVNDUy1SIiwiU0ktUi1JTkRFIiwiU0hJLVAtSEFORFItUlciLCJTVC1BUEktQU1DLVIiLCJTSEktUC1GMVItUlciLCJNREMtQVBJLVRIUi1SIiwiU0hJLVAtQ0hFTU9SLVJXIiwiTURDLUFQSS1SVFMtUiIsIlNISS1QLU5JQ1UtUlciLCJNREMtUC1BU00tUlciLCJTSEktUC1JTkMiLCJTRC1QLUhNU1VDLVJXIiwiU0QtUC1ITVNHUC1SIiwiTURDLVAtUkVHLVIiLCJTVC1BUEktQlJELVJXIiwiTURDLVAtUE5QLVJXIiwiTURDLVAtUE5QUi1SIiwiRVItUC1FUlBCLVJXIiwiU0hJLVAtT1QtUlciLCJTRC1QLUhNU1NQLVIiLCJTRC1QLVNBLVJXIiwiU0QtUC1ITVNTUEItUlciLCJTRC1QLUhNU0JELVJXIiwiU0QtUC1ITVNTRC1SIiwiU0QtUi1MVCIsIlNELVAtSE1TU1MtUlciLCJTSEktUC1FTVItUlciLCJTSEktUC1PUEQtUlciLCJNREMtQVBJLUFULVIiLCJNREMtUi1BRE0iLCJTRC1QLUhNU1RELVIiLCJHUC1QLUdDTi1SIiwiTURDLUFQSS1MQk4tUiIsIlNISS1QLU1JQ1VSLVJXIiwiU0QtUC1UTS1SVyIsIlNISS1QLUYxLVJXIiwiU0hJLVAtSEFORC1SVyIsIlNISS1QLUYyUi1SVyIsIlNISS1QLUdFVFJBVy1SVyIsIlNELVAtVEUtUlciLCJNREMtUC1PU0ItUlciLCJTVC1QLU5URi1SVyIsIlNISS1QLUZSTlQtUlciLCJTSEktUC1OSUNVUi1SVyIsIlNISS1QLURJQS1SVyIsIlNULVAtU05PLVJXIiwiU1QtUC1ERVMtUiIsIk1EQy1BUEktUEFUIiwiU0hJLVAtTVJELVJXIiwiU0hJLVAtUEhBUk0tUlciLCJTSEktUC1FTVJSLVJXIiwiU1QtUC1DTVQtUiIsIkVSLVAtRVJCLVJXIiwiU0hJLVAtTVJJLVJXIiwiU0hJLVAtUkVDUi1SVyIsIlNELVAtSE1TQlBMLVIiLCJTRC1QLUhNU1BTLVJXIiwiTURDLUFQSS1DRFItUiIsIlNISS1QLUNIRU1PLVJXIiwiTURDLVAtVFJCLVJXIiwiTURDLVAtUkVHLVJXIiwiTURDLUFQSS1QREMtUlciLCJTVC1QLVRETC1SIiwiU0hJLVAtU0lDVVItUlciLCJNREMtQVBJLVJETC1SVyIsIkVSLVAtRVJQTC1SIiwiU0hJLVAtSFItUlciXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSJdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc2NDY3MTY3MiwiZXhwIjoxNzY0NzU4NjcyLCJqdGkiOiIzMGEyMmNjZi00ZDIzLTRmNTItOTJkMS1jODc4MzhiZjVlMTAifQ.Rxq6Fgx9ajpU_pPdW3wHCEwS5-YK_LnoOBtrZameozVVAsH52s-xKvHFJfwJzGK9C8jeE3PrIwlB9vv30Ux2rx5YuPV9sSzN1qXhOIJIxNs8mIrAXTnMm4thmL7EP7vVeErHlWpVb3Yo25pDw3OKiQiDxD5Ve1-xtNDytO0QXf_eYdzklMlpHZc5pYwc-T5okCakn_lNv9m6EP78q6AMchJokImV69SF508e6x3C7ZnDYJFVHUSn8UicjkMT0O795unUQQ2Tvr0Ru6hJqbEC59FrYYO7MIjhG-1Mhy4UnBEtaa1egWUP6tLFZOzvFaYWbDDBE0BrtF4Ap67zJrW60g";
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