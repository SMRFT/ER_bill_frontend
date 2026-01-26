import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- add this
import App from './App';
import './index.css';
function setForLocalDev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NiIsImVtYWlsIjoiY2hhbmRyYXNtcmZ0QGdtYWlsLmNvbSIsIm5hbWUiOiJDaGFuZHJhIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNELVAtU0dBQy1SIiwiU0QtUC1TSEYtUlciLCJFUi1QLUVSQVMtUlciLCJHTC1QLUVMLVJXIiwiRkUtUC1GUy1SVyIsIkZFLVItRkEtUlciLCJGRS1QLUZTQi1SVyIsIkZFLVAtRkdMLVIiLCJGRS1QLUZVUy1SVyIsIlNELVAtU0lSLVIiLCJHTC1QLUVELVJXIiwiRkUtUC1GR0YtUiIsIkZFLVAtRkYtUlciLCJTRC1QLVNWUkktUiIsIlNELVAtUE8tUiIsIkdMLVAtQU5ELVJXIiwiRVItUi1FUkEiLCJGRS1QLUZHLVJXIiwiTURDLUFQSS1BVC1SIiwiR0wtUC1FQUQtUlciLCJTRC1QLVNDVS1SVyIsIlNELVItTFMiLCJTSEktUC1UUkFJTi1SVyIsIlNISS1QLUVYUC1SVyIsIlNISS1QLUlOQyIsIlNELVAtU1ZGLVJXIiwiRkUtUi1GQSIsIlNELVAtTEdTQy1SIiwiTURDLVItUERDIiwiTURDLVAtUE5QUi1SIiwiRkUtUC1GQUwtUiIsIlNELVAtUkVHLVJXIiwiU0QtUC1CRy1SVyIsIkZFLVAtRlVCLVJXIiwiR0wtUC1QLVJXIiwiU0QtUi1TRSIsIkdQLVAtR0NOLVIiLCJHTC1QLVJTRS1SVyIsIkdMLVAtRUJULVJXIiwiTURDLUFQSS1QREMtUlciLCJHTC1QLUVQLVJXIiwiR0wtUC1OREMtUlciLCJGRS1QLUZSLVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NjczMjgxNzMsImV4cCI6MTc2NzQxNTE3MywianRpIjoiYmU5NjZmZWYtNGI5Yi00MjJhLWE2MWUtNzBlN2I5MjA0MzFiIn0.RAysGa970dzjph000S3Q_75wz_rZz5HgPlvl3g5i16FssKqKWzFriA3Tl6cbci4oiucbSv3YnJ5xj1YjVS_ygyixc36-1YJFiECDAHw7Nmrwqf1Duax6VI-e4HA1UiVaLSomafIl-c4XC4UeYIxu7HeYrLI8IGO8qGDMwHGN50cte1IQrfca1HCMUMjO2yFogql57eVYFsQM3_B_LGhbI488gpWI3HNbAy3yFiKmME3M9ZPKKPFegO8eV1S-8vm5i5QZVWY2AvxI7qUC7xbuBY5gcO8eIk_cwFQLbRBsk0Lw4g5DUWY7p6Y9vLGasLe6xZSBKJasMvy6oj4Kd8zPDA";
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