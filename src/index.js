import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// Access the redirect URL from environment variables
const REDIRECT_URL = process.env.REACT_APP_LOGIN_REDIRECT_URL;

console.log("=== ERINDEX.JS DEBUG ===");
console.log("REDIRECT_URL:", REDIRECT_URL);

// --- Function to set token for local development ---
function setforlocaldev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg2NyIsImVtYWlsIjoiUGFydGhpcGFuMzEyMTQ2MUBnbWFpbC5jb20iLCJuYW1lIjoiTS5QYXJ0aGliYW4iLCJhbGxvd2VkLWFjdGlvbnMiOlsiU0QtUC1CVEQtUlciLCJTRC1QLUdQRC1SIiwiU0hJLVAtRU1SLVJXIiwiU0hJLVAtVFJBSU4tUlciLCJTSEktUC1GMlItUlciLCJTRC1QLVNDLVIiLCJTVC1QLURFUy1SIiwiRVItUC1FUkFTLVJXIiwiU0QtQVBJLVNTLVJXIiwiU0QtQVBJLVJCLVIiLCJTVC1SLUEiLCJTSEktUC1NUkktUlciLCJTRC1QLVBCLVJXIiwiTURDLVItUERDIiwiU0QtQVBJLUNOLVIiLCJTSEktUC1QSFktUlciLCJTSEktUC1QSEFSTS1SVyIsIlNULVAtTlRGLVJXIiwiU0hJLVAtTVJELVJXIiwiRVItUi1FUkEiLCJTSEktUC1GMy1SVyIsIlNJTi1BUEktT1JSLVIiLCJTSEktUC1DSEVNT1ItUlciLCJTSU4tQVBJLUlGLVIiLCJTSEktUC1PVC1SVyIsIlNISS1QLUNIRU1PLVJXIiwiTURDLUFQSS1DR1AtUlciLCJTSEktUC1YUkFZLVJXIiwiTURDLVAtR0NQLVIiLCJTRC1QLUJBLVJXIiwiU0hJLVAtRjFTLVJXIiwiU0hJLVAtQVZBSUwtUlciLCJTRC1QLVNTLVIiLCJTRC1QLUxTRC1SVyIsIlNJTi1BUEktU0YtUiIsIlNELVAtSE1TR0ItUiIsIlNELVAtTEdTQy1SIiwiU0QtUC1VUEItUlciLCJTSEktUC1GT1JNLVJXIiwiU0QtUC1CRy1SVyIsIlNELVAtTFNDTC1SVyIsIlNISS1QLUVYUC1SVyIsIlNULUFQSS1BTUMtUlciLCJTSEktUC1OSUNVUi1SVyIsIlNISS1QLVRSQUlOUi1SVyIsIk1EQy1BUEktT0dQLVJXIiwiU0QtUC1MU0MtUlciLCJTSEktUC1GMlNSLVJXIiwiU1QtUC1UREwtUiIsIlNELVAtTEdMRC1SIiwiU1QtUC1CUkQtUiIsIlNISS1QLU1JQ1VSLVJXIiwiU0QtUC1MUEktUiIsIlNISS1QLUdFVFJBVy1SVyIsIlNISS1QLUYyLVJXIiwiU0hJLVAtSEFORFItUlciLCJTSEktUC1IQU5ELVJXIiwiU0QtUC1MUkMtUiIsIlNISS1QLUZSTlQtUlciLCJNREMtQVBJLVBEQy1SVyIsIlNULUFQSS1DUkQtUlciLCJTSEktUC1GMS1SVyIsIlNELVAtR1NQLVIiLCJTVC1QLVNOTy1SVyIsIk1EQy1BUEktUEdQLVJXIiwiTURDLVAtR1BQLVIiLCJTSEktUC1NT0NLLVJXIiwiU0QtUC1QRy1SVyIsIlNISS1QLUYxU1ItUlciLCJTSEktUC1SRUNSLVJXIiwiU1QtQVBJLUJSRC1SVyIsIlNULVAtREVTLVJXIiwiU0lOLVItQUNDIiwiTURDLVAtQUFVLVJXIiwiTURDLVAtUE5QUi1SIiwiTURDLVAtR0FQLVIiLCJTRC1QLUhNU1BCLVJXIiwiU0QtUC1QT1YtUlciLCJTSEktUC1TSUNVUi1SVyIsIlNELVAtTEJOLVIiLCJTVC1QLUNNVC1SVyIsIlNISS1QLU5JQ1UtUlciLCJTRC1SLVNNQyIsIlNISS1QLU1JQ1UtUlciLCJTVC1BUEktRU1QLVIiLCJTVC1QLVRETC1SVyIsIlNISS1QLVNJQ1UtUlciLCJHUC1QLUdDTi1SIiwiU0hJLVAtT1BELVJXIiwiU0hJLVAtRU1SUi1SVyIsIlNELVAtU1AtUiIsIk1EQy1BUEktU0dQLVJXIiwiU0hJLVAtVVBEUkFXLVJXIiwiU0QtUC1TUy1SVyIsIlNISS1QLUlOQyIsIlNISS1QLUYyUy1SVyIsIlNISS1QLUNULVJXIiwiU0QtUC1HUEItUiIsIlNISS1QLUxBQi1SVyIsIlNISS1QLUYzUi1SVyIsIlNULVAtTlRGLVIiLCJNREMtUC1HT1AtUiIsIlNISS1QLUhSLVJXIiwiU0ktUi1JTkRFIiwiTURDLUFQSS1BVC1SIiwiU1QtUC1DTVQtUiIsIk1EQy1BUEktQUdQLVJXIiwiU0hJLVAtRjFSLVJXIiwiU0QtUC1SQi1SVyIsIlNELUFQSS1URC1SIiwiU0QtUC1MVVNDRC1SVyIsIk1EQy1QLUdTUC1SIiwiU0QtQVBJLVRNLVJXIiwiU0QtUC1QRi1SVyIsIlNISS1QLVJFQy1SVyIsIlNISS1QLURJQS1SVyJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzcwNzAyMjI2LCJleHAiOjE3NzA3ODkyMjYsImp0aSI6IjQ0NDExYTI0LTQzYmQtNGY0Yy05N2NkLWQxNzA4MWI0YjRmMyJ9.NgHvk5HZEozXVhtzBGisE56P6qE2l9QSBAi9OZCiAyG0d6BRA7IV66p7seT1F5Mdd-sUivNQpBDYRCs9iLhdr0zyiSR6mxk65If-oDr8WMw0-d4IPhV3_AnlTogR2oySt1bfRp2PF214G0wgAtXW9HxxaJy_mQU-QYKYUzaHR-g-Q0NIX1jt23dWdHOL_5UEHf7DHRTypYM-l7teQSWncxsG1mbMX98ZqGMjm1OpR3q0FD_T8dqjc4jYQEzkgLLB3K2wUKPLUfeNza1tpWhcke-LlkUahTgWhg06jGrr1dX2QChKBIixeUiv2Bas5xUbCVhmIa-TkIGCGDeOfNRbWQ";
  console.log(" Using development token");
  const selectedBranch = "SHB001";
  localStorage.setItem("selected_branch", selectedBranch);
  return dev_token;
}

// --- Function to redirect to login ---
function redirectToLogin() {
  if (REDIRECT_URL) {
    console.log(" Redirecting to login URL:", REDIRECT_URL);
    window.location.href = REDIRECT_URL;
  } else {
    console.error(" REDIRECT_URL not configured");
    window.location.href = "https://shinova.in/login";
  }
}

// --- Validate JWT Token Locally ---
function validate(token) {
  if (!token || token.trim() === "") {
    throw new Error("Token is empty");
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      throw new Error("Token expired");
    }
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}

// --- Function to determine user role based on allowed-actions ---
function getUserRole(allowedActions) {
  if (!allowedActions || !Array.isArray(allowedActions)) {
    return "ER Nurse"; // Global default
  }

  /* =======================
     ER ROLES (higher priority)
     ======================= */
  if (allowedActions.includes("ER-R-ERA")) {
    return "ER Admin";
  } else if (allowedActions.includes("ER-R-ERP")) {
    return "ER Pharmacy";
  } else if (allowedActions.includes("ER-R-ERN")) {
    return "ER Nurse";
  }
}



// --- Main execution ---
(function main() {
  try {
    console.log("Starting token validation...");

    // Retrieve token from localStorage
    let accessToken = localStorage.getItem("access_token");
    console.log("Access token from localStorage exists:", !!accessToken);

    // If no token found, try development token
    if (!accessToken) {
      console.log(" No token found in localStorage, trying development token");
      accessToken = setforlocaldev();
    }

    // If still no token (development token is empty), redirect to login
    if (!accessToken || accessToken.trim() === "") {
      console.log(" No valid token available, redirecting to login");
      localStorage.removeItem("access_token");
      redirectToLogin();
      return;
    }

    // Validate the token
    const userPayload = validate(accessToken);
    console.log(" Token validated successfully");
    console.log("Decoded token payload:", userPayload);

    // Store the valid token and user information
    localStorage.setItem("access_token", accessToken);

    // Extract user information from token payload
    const employeeId = userPayload.aud;
    const name = userPayload.name;
    const userEmail = userPayload.email;
    const userRole = getUserRole(userPayload["allowed-actions"]);

    console.log("Employee ID:", employeeId);
    console.log("Name:", name);
    console.log("Email:", userEmail);
    console.log("User Role:", userRole);

    // Check if we have required data
    const isLoggedIn = !!(employeeId && name);
    console.log("Is logged in:", isLoggedIn);

    if (!isLoggedIn) {
      throw new Error("Missing required user data (employeeId or name)");
    }

    // Store user payload and extracted information
    localStorage.setItem("user_payload", JSON.stringify(userPayload));
    localStorage.setItem("employeeId", employeeId);
    localStorage.setItem("name", name);
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("role", userRole);

    // Store user object for compatibility
    localStorage.setItem("user", JSON.stringify({ name, employeeId, email: userEmail, role: userRole }));

    console.log(" User payload and extracted data stored in localStorage");
    console.log("Stored data:", { employeeId, name, userEmail, role: userRole });

    // Token is valid, render app
    console.log(" Rendering insurance app...");
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    reportWebVitals();
  } catch (error) {
    console.error(" Token validation failed:", error.message);

    // Clean up invalid token
    localStorage.removeItem("access_token");

    // If validation fails, redirect to login
    console.log(" Redirecting to login due to validation failure");
    redirectToLogin();
  }
})();
