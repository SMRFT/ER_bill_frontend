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

// Re-use existing styled components from your file (table/modal styles omitted for brevity)
// --- (Assume the styled components in your original file are present above) ---

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

  useEffect(() => {
    fetchBilling(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

const fetchBilling = async selectedDate => {
  try {
    const result = await apiRequest(
      `${ERbaseurl}Pharmacy/?date=${selectedDate}`,  // <-- send as query param
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
    showToast(`Loaded ${processed.length} records`, "success");
  } catch (err) {
    console.error("Error fetching billing:", err);
    showToast("Failed to fetch billing records. Please try again.", "error");
  }
};

  // Open modal (only minimal fields in table; details shown in modal)
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
    // reset payment UI
    setPaymentModeType("cash");
    setSingleAmount("");
    setSingleDetails("");
    setMultiplePayments([{ method: "cash", amount: "", details: "" }]);
  };

  // Multiple payment helpers
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

  // Build payment_mode array
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
    const encoded = encodeURIComponent(selectedBill.uhid);
    const payload = {
      payment_mode: payment_mode,
      billing_status: "paid",
      total_paid: totalPaid,
    };

    // Option 1: Using apiRequest
    const response = await apiRequest(`${ERbaseurl}update-status/${encoded}/`, "PUT", {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // OR Option 2: Direct axios call (if apiRequest doesn't work)
    // const response = await axios.put(
    //   `${ERbaseurl}update-status/${encoded}/`,
    //   payload,
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     }
    //   }
    // );

    console.log("Response:", response.data); // Check response

    setBillingData(prev => 
      prev.map(it => 
        it.uhid === selectedBill.uhid 
          ? { ...it, billing_status: "paid", payment_mode, total_paid: totalPaid } 
          : it
      )
    );

    showToast(`Payment saved for ${selectedBill.uhid}`, "success");
    closePaymentModal();
  } catch (err) {
    console.error("Error updating status:", err);
    console.error("Error response:", err.response?.data); // Debug error
    showToast("Failed to process payment. Please try again.", "error");
  }
};
  // Filtering / pagination
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

  const totalPages = Math.max(1, Math.ceil(filteredData.length / perPage));
  const startIndex = (page - 1) * perPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + perPage);

  const pendingCount = billingData.filter(b => (b.billing_status || "").toString().toLowerCase() !== "paid").length;
  const billedCount = billingData.filter(b => (b.billing_status || "").toString().toLowerCase() === "paid").length;

  return (
    <PageContainer>
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

      {/* TABLE: simplified columns */}
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
      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 20 }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <div>Page {page} of {totalPages} ({filteredData.length} records)</div>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {/* Payment Modal (minimal, follows user's requirements) */}
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

            {/* Single payment UI */}
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

            {/* Multiple payments UI */}
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

            {/* Totals and submit */}
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