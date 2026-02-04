import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Sidebar from "./Components/Sidebar";
import ERBilling from "./Components/ERBilling";
import Pharmacy from "./Components/pharmacy";
import AccountSummary from "./Components/AccountSummary";
import PrintBill from "./Components/PrintBill";
import ERReport from "./Components/ERReport";
import PHReport from "./Components/PHReport";

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited && role) {
      if (role === "ER Admin") {
        navigate("/AccountSummary", { replace: true });
      } else if (role === "ER Nurse") {
        navigate("/", { replace: true }); // ERBilling default
      } else if (role === "ER Pharmacy") {
        navigate("/Pharmacy", { replace: true });
      }

      localStorage.setItem("hasVisited", "true");
    }
  }, [navigate]);

  return (
    <Sidebar>
      <Routes>
        <Route path="/" element={<ERBilling />} />
        <Route path="/Pharmacy" element={<Pharmacy />} />
        <Route path="/AccountSummary" element={<AccountSummary />} />
        <Route path="/PrintBill" element={<PrintBill />} />
        <Route path="/ERReport" element={<ERReport />} />
        <Route path="/PHReport" element={<PHReport />} />
      </Routes>
    </Sidebar>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/ERBilling">
      <AppRoutes />
    </BrowserRouter>
  );
}
