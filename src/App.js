import ERBilling from './Components/ERBilling';
import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from './Components/Sidebar';
import Pharmacy from './Components/pharmacy';
import AccountSummary from './Components/AccountSummary';
import PrintBill from './Components/PrintBill';



function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const hasVisited = localStorage.getItem("hasVisited");

    // Redirect only on first load
    if (!hasVisited && role) {
      if (role === "ER Admin") {
        navigate("/AccountSummary", { replace: true });
      } else if (role === "ER Nurse") {
        navigate("/ERBilling", { replace: true });
      } else if (role === "ER Pharmacy") {
        navigate("/Pharmacy", { replace: true });
      }

      localStorage.setItem("hasVisited", "true");
    }
  }, [navigate]);
  return (
    <>
    

        <Sidebar>
          <Routes>
            <Route path="/ERBilling" element={<ERBilling />} />
            <Route path="/Pharmacy" element={<Pharmacy />} />
            <Route path="/AccountSummary" element={<AccountSummary />} />
            <Route path="/PrintBill" element={<PrintBill />} />

          </Routes>
        </Sidebar>
    </>
  );
}

export default App;
