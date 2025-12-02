import React, { useEffect, useState } from "react";
import {
  PageContainer,
  Label,
  FormGroup,
  ToastContainer,
  Toast,
  ToastIcon,
  ToastMessage,
  ToastClose,
  HeaderSection,
  PageTitle,
  Subtitle,
  FilterCard,
  FilterGrid,
  StyledInput,
  ClearButton,
  StatsRow,
  StatCard,
  StatValue,
  StatLabel,
  TableCard,
  TableHeader,
  TableTitle,
  RecordCount,
  TableWrapper,
  StyledTable,
  StyledTh,
  StyledTd,
  StatusBadge,
  AmountCell,
  DiscountedAmount,
  EmptyState,
  EmptyIcon,
  EmptyText,
  EmptySubtext,
  LoadingOverlay,
  Spinner,
  PatientInfo,
  PatientName,
  UhidTag,
} from "../Styles/globalStyles";

import apiRequest from "./apiRequest";

const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL;

export default function AccountSummary() {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("all");

  useEffect(() => {
    fetchSummary();
  }, [fromDate, toDate, paymentMode]);

  const fetchSummary = async () => {
    setLoading(true);

    try {
      let query = "?";

      if (fromDate && toDate) {
        query += `from_date=${fromDate}&to_date=${toDate}&`;
      }

      if (paymentMode !== "all") {
        query += `payment_mode=${paymentMode}`;
      }

      const result = await apiRequest(`${ERbaseurl}AccountSummary/${query}`, "GET");

      if (result.success) {
        const processed = result.data.map((item) => ({
          ...item,
          procedures:
            typeof item.procedures === "string"
              ? JSON.parse(item.procedures)
              : item.procedures,
          payment_mode:
            typeof item.payment_mode === "string" && item.payment_mode
              ? JSON.parse(item.payment_mode)
              : item.payment_mode,
        }));

        setSummaryData(processed);
      } else {
        showToast("Failed to fetch account summary", "error");
      }
    } catch (err) {
      showToast("API Error", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setPaymentMode("all");
  };

  const calculateStats = () => {
    const totalRecords = summaryData.length;
    const totalAmount = summaryData.reduce((sum, item) => sum + (item.total || 0), 0);
    const totalDiscounted = summaryData.reduce(
      (sum, item) => sum + (item.net_amount || 0),
      0
    );

    return { totalRecords, totalAmount, totalDiscounted };
  };

  const stats = calculateStats();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format payment methods for display
  const formatPaymentMethods = (paymentMode) => {
    if (!paymentMode || (Array.isArray(paymentMode) && paymentMode.length === 0)) {
      return "Not Paid";
    }

    if (Array.isArray(paymentMode)) {
      return paymentMode
        .map((pm) => `${pm.method.toUpperCase()}: ${formatCurrency(pm.amount)}`)
        .join(", ");
    }

    return "Not Paid";
  };

  // Format payment methods for Excel (plain text)
  const formatPaymentMethodsExcel = (paymentMode) => {
    if (!paymentMode || (Array.isArray(paymentMode) && paymentMode.length === 0)) {
      return "Not Paid";
    }

    if (Array.isArray(paymentMode)) {
      return paymentMode
        .map((pm) => `${pm.method.toUpperCase()}: ₹${pm.amount}`)
        .join(", ");
    }

    return "Not Paid";
  };

  // ⭐⭐⭐ EXCEL DOWNLOAD
  const downloadExcel = () => {
    import("xlsx").then((xlsx) => {
      const sheetData = summaryData.map((item) => ({
        PatientName: item.patientname,
        UHID: item.uhid,
        Doctor: item.doctorname,
        Date: formatDate(item.date),
        Total: item.total,
        Discount: item.discount_amount,
        NetAmount: item.net_amount,
        PaymentMethod: formatPaymentMethodsExcel(item.payment_mode),
        Status: item.billing_status,
      }));

      const worksheet = xlsx.utils.json_to_sheet(sheetData);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "AccountSummary");

      xlsx.writeFile(workbook, "AccountSummary.xlsx");
    });
  };

  // ⭐⭐⭐ PDF DOWNLOAD
  const downloadPDF = async () => {
    const jsPDFModule = await import("jspdf");
    const autoTable = await import("jspdf-autotable");

    const doc = new jsPDFModule.jsPDF();

    doc.text("Account Summary", 14, 15);

    const tableColumn = [
      "Patient Name",
      "UHID",
      "Doctor",
      "Date",
      "Total",
      "Discount",
      "Net Amount",
      "Payment Method",
      "Status",
    ];

    const tableRows = summaryData.map((item) => [
      item.patientname,
      item.uhid,
      item.doctorname,
      formatDate(item.date),
      item.total,
      item.discount_amount,
      item.net_amount,
      formatPaymentMethodsExcel(item.payment_mode),
      item.billing_status,
    ]);

    autoTable.default(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("AccountSummary.pdf");
  };

  return (
    <PageContainer>
      {toast && (
        <ToastContainer>
          <Toast type={toast.type}>
            <ToastIcon>{toast.type === "success" ? "✓" : "✕"}</ToastIcon>
            <ToastMessage>{toast.message}</ToastMessage>
            <ToastClose onClick={() => setToast(null)}>×</ToastClose>
          </Toast>
        </ToastContainer>
      )}

      {/* ---------------- Header + Download Buttons ---------------- */}
      <HeaderSection>
        <div>
          <PageTitle>Account Summary</PageTitle>
          <Subtitle>View billed records</Subtitle>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={downloadExcel}
            style={{
              padding: "10px 18px",
              background: "#059669",
              color: "#fff",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              height: "44px",
            }}
          >
            Download Excel
          </button>

          <button
            onClick={downloadPDF}
            style={{
              padding: "10px 18px",
              background: "#dc2626",
              color: "#fff",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              height: "44px",
            }}
          >
            Download PDF
          </button>
        </div>
      </HeaderSection>

      {/* ---------------- Filters ---------------- */}
      <FilterCard>
        <FilterGrid>
          <FormGroup>
            <Label>From Date</Label>
            <StyledInput
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>To Date</Label>
            <StyledInput
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Payment Mode</Label>
            <select
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="all">All</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
            </select>
          </FormGroup>

          <ClearButton onClick={clearFilters}>Clear Filters</ClearButton>
        </FilterGrid>
      </FilterCard>

      {/* ---------------- Stats ---------------- */}
      <StatsRow>
        <StatCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
          <StatValue>{stats.totalRecords}</StatValue>
          <StatLabel>Total Records</StatLabel>
        </StatCard>

        <StatCard gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)">
          <StatValue>{formatCurrency(stats.totalAmount)}</StatValue>
          <StatLabel>Total Amount</StatLabel>
        </StatCard>

        <StatCard gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)">
          <StatValue>{formatCurrency(stats.totalDiscounted)}</StatValue>
          <StatLabel>Net Total</StatLabel>
        </StatCard>
      </StatsRow>

      {/* ---------------- Table ---------------- */}
      <TableCard>
        <TableHeader>
          <TableTitle>Billing Records</TableTitle>
          <RecordCount>{stats.totalRecords} records</RecordCount>
        </TableHeader>

        <TableWrapper>
          {loading ? (
            <LoadingOverlay>
              <Spinner />
            </LoadingOverlay>
          ) : summaryData.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📋</EmptyIcon>
              <EmptyText>No records found</EmptyText>
              <EmptySubtext>Try adjusting filters</EmptySubtext>
            </EmptyState>
          ) : (
            <StyledTable>
              <thead>
                <tr>
                  <StyledTh>Patient</StyledTh>
                  <StyledTh>Doctor</StyledTh>
                  <StyledTh>Date</StyledTh>
                  <StyledTh>Total</StyledTh>
                  <StyledTh>Discount</StyledTh>
                  <StyledTh>Net Amount</StyledTh>
                  <StyledTh>Payment Method</StyledTh>
                  <StyledTh>Status</StyledTh>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((item, idx) => (
                  <tr key={idx}>
                    <StyledTd>
                      <PatientInfo>
                        <PatientName>{item.patientname}</PatientName>
                        <UhidTag>{item.uhid}</UhidTag>
                      </PatientInfo>
                    </StyledTd>

                    <StyledTd>{item.doctorname}</StyledTd>
                    <StyledTd>{formatDate(item.date)}</StyledTd>

                    <StyledTd>
                      <AmountCell>{formatCurrency(item.total)}</AmountCell>
                    </StyledTd>

                    <StyledTd>
                      <DiscountedAmount>
                        {formatCurrency(item.discount_amount)}
                      </DiscountedAmount>
                    </StyledTd>

                    <StyledTd>
                      <DiscountedAmount>
                        {formatCurrency(item.net_amount)}
                      </DiscountedAmount>
                    </StyledTd>

                    <StyledTd>
                      <div style={{ 
                        fontSize: "13px", 
                        color: "#374151",
                        lineHeight: "1.5"
                      }}>
                        {formatPaymentMethods(item.payment_mode)}
                      </div>
                    </StyledTd>

                    <StyledTd>
                      <StatusBadge status={item.billing_status}>
                        {item.billing_status}
                      </StatusBadge>
                    </StyledTd>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          )}
        </TableWrapper>
      </TableCard>
    </PageContainer>
  );
}