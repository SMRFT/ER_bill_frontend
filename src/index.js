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
  const dev_token = "";
  console.log(" Using development token");
  const selectedBranch = "SHB001";
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
  } 
  else if (allowedActions.includes("ER-R-ERSA")) {
    return "ER Super Admin";
  }
  else if (allowedActions.includes("ER-R-ERP")) {
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
