import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import styled from "styled-components";

import {
  PageContainer,
  Title,
  Label,
  Input,
  Select,
  Card,
  Button,
  FormGrid,
  FormGroup,
  PageTitle,
  Table,
  Th,
  Td,
  SectionTitle,
  ToastContainer,
  Toast,
  ToastIcon,
  ToastMessage,
  ToastClose,
} from "../Styles/globalStyles";
import apiRequest from "./apiRequest";

const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL;


export default function Pharmacy() {
  const [billingData, setBillingData] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [toasts, setToasts] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Shift state
  const [isActiveShift, setIsActiveShift] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentShiftNo, setCurrentShiftNo] = useState(null);
  const [currentShiftOwner, setCurrentShiftOwner] = useState(null);

  // Payment UI state
  const [paymentModeType, setPaymentModeType] = useState("cash");
  const [singleAmount, setSingleAmount] = useState("");
  const [singleDetails, setSingleDetails] = useState("");
  const [multiplePayments, setMultiplePayments] = useState([
    { method: "cash", amount: "", details: "" },
  ]);

  const perPage = 10;

  // Toast helpers
  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };
  const removeToast = id => setToasts(prev => prev.filter(t => t.id !== id));

  const loggedInUserId = localStorage.getItem("auth-user-id");

  useEffect(() => {
    fetchBilling(date);
  }, [date]);

  useEffect(() => {
    checkActiveShift();
  }, []);

const checkActiveShift = async () => {
  setLoading(true);
  try {
    const res = await apiRequest(`${ERbaseurl}get_active_shift/`, "GET");
    
    // ✅ FIXED: Accessing res.data based on your shared JSON structure
    if (res.success && res.data && res.data.is_active) {
      setIsActiveShift(true);
      setCurrentShiftNo(res.data.shiftno);
      setCurrentShiftOwner(res.data.created_by);
    } else {
      setIsActiveShift(false);
      setCurrentShiftNo(null);
    }
  } catch (err) {
    console.error("Shift check failed:", err);
    setIsActiveShift(false);
  } finally {
    setLoading(false);
  }
};

  const startShift = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(
        `${ERbaseurl}shiftdetails/`,
        "POST",
        { action: "start" }
      );
      if (res.success) {
        setIsActiveShift(true);
        setCurrentShiftNo(res.data.shiftno);
        setCurrentShiftOwner(res.data.created_by);
        showToast(`Shift Start successfully`, "success");
      }
    } catch (err) {
      showToast(`Shift Start successfully`, "success");
    } finally {
      setLoading(false);
    }
  };

  const endShift = async () => {
 

    setLoading(true);
    try {
      const res = await apiRequest(
        `${ERbaseurl}shiftdetails/`,
        "POST",
        { action: "end" }
      );
      if (res.success) {
        setIsActiveShift(false);
        setCurrentShiftNo(null);
        setCurrentShiftOwner(null);
        showToast(`Shift ended successfully`, "success");
        fetchBilling(date);
      }
    } catch (err) {
      showToast(err.response?.data?.error || "Error ending shift", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchBilling = async selectedDate => {
    try {
      const result = await apiRequest(
        `${ERbaseurl}Pharmacy/?date=${selectedDate}`,
        "GET"
      );

      const processed = result.data.map(item => ({
        ...item,
        procedures:
          typeof item.procedures === "string"
            ? JSON.parse(item.procedures)
            : item.procedures,
      }));
      setBillingData(processed);
    } catch (err) {
      console.error("Error fetching billing:", err);
      showToast("Failed to fetch billing records. Please try again.", "error");
    }
  };

  // Payment functions (unchanged)
  const openPaymentModal = bill => {
    setSelectedBill(bill);
    setPaymentModeType("cash");
    setSingleAmount(bill.net_amount != null ? String(bill.net_amount) : String(bill.total || ""));
    setSingleDetails("");
    setMultiplePayments([{ method: "cash", amount: "", details: "" }]);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedBill(null);
    setPaymentModeType("cash");
    setSingleAmount("");
    setSingleDetails("");
    setMultiplePayments([{ method: "cash", amount: "", details: "" }]);
  };

  const updateMultiPayment = (index, field, value) => {
    setMultiplePayments(prev => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };
  const addMultiPayment = () => setMultiplePayments(prev => [...prev, { method: "cash", amount: "", details: "" }]);
  const removeMultiPayment = index => setMultiplePayments(prev => prev.filter((_, i) => i !== index));

  const calculateTotalPaidFromUI = () => {
    if (paymentModeType === "multiple") {
      return multiplePayments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
    }
    return parseFloat(singleAmount || 0) || 0;
  };

  const markAsBilled = async () => {
    if (!selectedBill) return;

    let payment_mode = [];
    if (paymentModeType === "multiple") {
      payment_mode = multiplePayments.map(p => ({ 
        method: p.method, 
        amount: Number(p.amount), 
        details: p.details || "" 
      }));
    } else {
      payment_mode = [{ 
        method: paymentModeType, 
        amount: Number(singleAmount || 0), 
        details: singleDetails || "" 
      }];
    }

    const totalPaid = payment_mode.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const billAmount = Number(selectedBill.net_amount ?? selectedBill.total ?? 0);

    if (Math.abs(totalPaid - billAmount) > 0.01) {
      showToast(`Total paid (₹${totalPaid.toFixed(2)}) must equal bill amount (₹${billAmount.toFixed(2)})`, "error");
      return;
    }

    const invalid = payment_mode.filter(pm => 
      pm.method !== "cash" && (!pm.details || pm.details.toString().trim().length === 0)
    );
    if (invalid.length > 0) {
      showToast("Please provide payment details for non-cash methods.", "error");
      return;
    }

    try {
      const encoded = encodeURIComponent(selectedBill.billnumber);
      const payload = {
        payment_mode: payment_mode,
        billing_status: "paid",
        total_paid: totalPaid,
      };

      const response = await apiRequest(`${ERbaseurl}update-status/${encoded}/`, "PUT", {
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setBillingData(prev => 
        prev.map(it => 
          it.billnumber === selectedBill.billnumber 
            ? { ...it, billing_status: "paid", payment_mode, total_paid: totalPaid } 
            : it
        )
      );

      showToast(`Payment saved for ${selectedBill.billnumber}`, "success");
      closePaymentModal();
    } catch (err) {
      console.error("Error updating status:", err);
      showToast("Failed to process payment. Please try again.", "error");
    }
  };

  const filteredData = useMemo(() => {
    let data = [...billingData];
    if (search.trim() !== "") {
      data = data.filter(item => item.uhid?.toLowerCase().includes(search.toLowerCase()) || item.patientname?.toLowerCase().includes(search.toLowerCase()));
    }
    if (doctorFilter !== "") data = data.filter(item => item.doctorname === doctorFilter);
    if (sortBy === "name") data.sort((a, b) => a.patientname.localeCompare(b.patientname));
    else if (sortBy === "uhid") data.sort((a, b) => (a.uhid || "").localeCompare(b.uhid || ""));
    return data;
  }, [billingData, search, doctorFilter, sortBy]);

  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage);

  const pendingCount = billingData.filter(b => String(b.billing_status).toLowerCase() !== "paid").length;
  const billedCount = billingData.filter(b => String(b.billing_status).toLowerCase() === "paid").length;

  return (
    <PageContainer>
      {/* ✅ PERFECT LOGIC: Show ONLY ONE button based on shift status */}
      <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 10, flexDirection: "column", alignItems: "flex-end" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {loading ? (
            <div style={{ 
              background: "#6c757d", 
              color: "white", 
              padding: "10px 20px", 
              borderRadius: "6px",
              fontWeight: "bold"
            }}>
              Checking shift...
            </div>
          ) : (
            <>
              {/* ✅ SHOW START SHIFT ONLY when NO active shift */}
              {!isActiveShift && (
                <button
                  onClick={startShift}
                  disabled={loading}
                  style={{
                    background: "#28a745",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                >
                  Start Shift
                </button>
              )}

              {/* ✅ SHOW END SHIFT ONLY when ACTIVE shift */}
              {isActiveShift && (
                <button
                  onClick={endShift}
                  disabled={loading}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                >
                  End Shift
                </button>
              )}
            </>
          )}
        </div>

        {/* ✅ Status badge ONLY when active */}
        {isActiveShift && currentShiftNo && (
          <div style={{ 
            fontSize: "12px", 
            color: "#155724", 
            background: "#d4edda", 
            padding: "6px 12px", 
            borderRadius: "20px", 
            border: "1px solid #c3e6cb",
            fontWeight: "500"
          }}>
            ● Active Shift: <strong>{currentShiftNo}</strong> by <strong>{currentShiftOwner}</strong>
          </div>
        )}
      </div>

      <ToastContainer>
        {toasts.map(t => (
          <Toast key={t.id} type={t.type}>
            <ToastIcon>{t.type === "success" ? "✓" : "✕"}</ToastIcon>
            <ToastMessage>{t.message}</ToastMessage>
            <ToastClose onClick={() => removeToast(t.id)}>×</ToastClose>
          </Toast>
        ))}
      </ToastContainer>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title>ER Billing Records</Title>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ fontWeight: 700 }}>{pendingCount} Pending</div>
          <div style={{ fontWeight: 700 }}>{billedCount} Billed</div>
        </div>
      </div>

      <Card>
        <SectionTitle style={{ marginTop: 0 }}>Filters & Search</SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>Select Date</Label>
            <Input type="date" value={date} onChange={e => { setPage(1); setDate(e.target.value); }} />
          </FormGroup>
          <FormGroup>
            <Label>Search Patient</Label>
            <Input type="text" value={search} placeholder="Search by UHID or Name..." onChange={e => { setPage(1); setSearch(e.target.value); }} />
          </FormGroup>
          <FormGroup>
            <Label>Filter by Doctor</Label>
            <Select value={doctorFilter} onChange={e => { setPage(1); setDoctorFilter(e.target.value); }}>
              <option value="">All Doctors</option>
              {[...new Set(billingData.map(b => b.doctorname))].map((doc, i) => (
                <option key={i} value={doc}>{doc}</option>
              ))}
            </Select>
          </FormGroup>
        </FormGrid>
      </Card>

      <div style={{ marginTop: 20, overflowX: "auto" }}>
        {paginatedData.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", fontSize: "16px", color: "#666" }}>
            There is no billing today
          </div>
        ) : (
          <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>UHID</Th>
                <Th>Patient Name</Th>
                <Th>Age / Gender</Th>
                <Th>Phone</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(bill => (
                <tr key={bill._id}>
                  <Td style={{ fontWeight: 700 }}>{bill.uhid}</Td>
                  <Td style={{ fontWeight: 700 }}>{bill.patientname}</Td>
                  <Td>{bill.age} / {bill.gender}</Td>
                  <Td>{bill.phonenumber}</Td>
                  <Td>
                    {String(bill.billing_status).toLowerCase() !== "paid" ? (
                      <Button onClick={() => openPaymentModal(bill)}>Process Payment</Button>
                    ) : (
                      <Button disabled>✓ Completed</Button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 20 }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <div>Page {page} of {totalPages} ({filteredData.length} records)</div>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }} onClick={closePaymentModal}>
          <div style={{ width: 760, maxWidth: "calc(100% - 32px)", background: "white", borderRadius: 12, padding: 20 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Payment Details</h3>
              <button onClick={closePaymentModal} style={{ fontSize: 20, border: "none", background: "transparent" }}>×</button>
            </div>

            <div style={{ marginBottom: 12 }}>
              <Label>Patient: {selectedBill.patientname} ({selectedBill.uhid})</Label>
              <div style={{ marginTop: 6, marginBottom: 6 }}>
                <Label>Bill Amount: ₹{selectedBill.net_amount ?? selectedBill.total}</Label>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <Label>Payment Mode</Label>
              <Select value={paymentModeType} onChange={e => setPaymentModeType(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="multiple">Multiple Payment</option>
              </Select>
            </div>

            {paymentModeType !== "multiple" && (
              <div style={{ marginBottom: 12 }}>
                <Label>Amount</Label>
                <Input type="number" step="0.01" value={singleAmount} onChange={e => setSingleAmount(e.target.value)} />
                {paymentModeType !== "cash" && (
                  <>
                    <Label style={{ marginTop: 8 }}>Payment Details</Label>
                    <Input type="text" value={singleDetails} placeholder="Transaction ID / Reference" onChange={e => setSingleDetails(e.target.value)} />
                  </>
                )}
              </div>
            )}

            {paymentModeType === "multiple" && (
              <div style={{ marginBottom: 12 }}>
                {multiplePayments.map((p, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <Label>Amount</Label>
                      <Input type="number" step="0.01" value={p.amount} onChange={e => updateMultiPayment(idx, "amount", e.target.value)} />
                    </div>
                    <div style={{ width: 140 }}>
                      <Label>Method</Label>
                      <Select value={p.method} onChange={e => updateMultiPayment(idx, "method", e.target.value)}>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="upi">UPI</option>
                      </Select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <Label>Payment Details</Label>
                      <Input type="text" value={p.details} placeholder="TXN / Ref" onChange={e => updateMultiPayment(idx, "details", e.target.value)} />
                    </div>
                    <div>
                      {multiplePayments.length > 1 && (
                        <Button onClick={() => removeMultiPayment(idx)}>Remove</Button>
                      )}
                    </div>
                  </div>
                ))}
                <div>
                  <Button onClick={addMultiPayment}>+ Add Payment</Button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eee", paddingTop: 12 }}>
              <div>
                <div style={{ fontWeight: 700 }}>Bill Amount: ₹{selectedBill.net_amount ?? selectedBill.total}</div>
                <div style={{ marginTop: 6 }}>Total Paid: ₹{calculateTotalPaidFromUI().toFixed(2)}</div>
                <div style={{ marginTop: 6 }}>Balance: ₹{((selectedBill.net_amount ?? selectedBill.total) - calculateTotalPaidFromUI()).toFixed(2)}</div>
              </div>
              <div>
                <Button onClick={markAsBilled}>Confirm Payment</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}