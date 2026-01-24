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
  EmptyState,
  LoadingOverlay,
  Spinner,
  PatientInfo,
  PatientName,
  UhidTag,
} from "../Styles/globalStyles";

import apiRequest from "./apiRequest";
const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL;

// Modern Download Button Component
const DownloadButton = ({ type, onClick }) => {
  const styles = {
    excel: {
      bg: 'linear-gradient(135deg, #558068ff 0%, #23864F 100%)',
      hoverBg: 'linear-gradient(135deg, #155633 0%, #1D6F42 100%)',
      icon: '📊'
    },
    pdf: {
      bg: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
      hoverBg: 'linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)',
      icon: '📄'
    }
  };

  const style = styles[type];

  return (
    <button
      onClick={onClick}
      style={{
        background: style.bg,
        border: 'none',
        borderRadius: '8px',
        padding: '8px 16px',
        color: 'white',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}
      onMouseEnter={(e) => {
        e.target.style.background = style.hoverBg;
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = style.bg;
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
      }}
    >
      <span style={{ fontSize: '16px' }}>{style.icon}</span>
      {type.toUpperCase()}
    </button>
  );
};

// Modern Stat Card Component
const ModernStatCard = ({ title, amount, onExcel, onPdf, color }) => {
  const gradients = {
    cash: 'white',
    card: 'white',
    upi: 'white',
    total: 'white',
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #d6a3c3ff 0%, #e773bbff 100%)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
        border: '1px solid #E5E7EB',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '1600',
            color: '#432323',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: '32px',
            fontWeight: '700',
            background: gradients[color],
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {amount}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <DownloadButton type="excel" onClick={onExcel} />
        <DownloadButton type="pdf" onClick={onPdf} />
      </div>
    </div>
  );
};

export default function AccountSummary() {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [fromDate, setFromDate] = useState(getCurrentDate());
  const [toDate, setToDate] = useState(getCurrentDate());
  const [paymentMode, setPaymentMode] = useState("all");

  /* ---------------- FETCH DATA ---------------- */

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
          payment_mode:
            typeof item.payment_mode === "string"
              ? JSON.parse(item.payment_mode)
              : item.payment_mode,
        }));
        setSummaryData(processed);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HELPERS ---------------- */

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  /* ---------------- MODE-WISE SPLITTER (CRITICAL) ---------------- */

  const getModeWiseData = (mode) => {
    return summaryData
      .map((item) => {
        const pm = item.payment_mode?.find((p) => p.method === mode);
        if (!pm) return null;

        return {
          patientname: item.patientname,
          uhid: item.uhid,
          doctorname: item.doctorname,
          date: item.date,
          amount: Number(pm.amount),
          billing_status: item.billing_status,
        };
      })
      .filter(Boolean);
  };

  /* ---------------- MODE TOTALS ---------------- */

  const calculatePaymentTotals = () => {
    const totals = { cash: 0, card: 0, upi: 0 };

    summaryData.forEach((item) => {
      item.payment_mode?.forEach((pm) => {
        if (totals.hasOwnProperty(pm.method)) {
          totals[pm.method] += Number(pm.amount);
        }
      });
    });

    return totals;
  };

  const paymentTotals = calculatePaymentTotals();
  const grandTotal = paymentTotals.cash + paymentTotals.card + paymentTotals.upi;

  /* ---------------- EXCEL DOWNLOAD ---------------- */

  const downloadExcelByMode = (mode) => {
    import("xlsx").then((xlsx) => {
      const data = getModeWiseData(mode).map((row) => ({
        Patient: row.patientname,
        UHID: row.uhid,
        Doctor: row.doctorname,
        Date: formatDate(row.date),
        Amount: row.amount,
        Mode: mode.toUpperCase(),
        Status: row.billing_status,
      }));

      const sheet = xlsx.utils.json_to_sheet(data);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, sheet, mode.toUpperCase());
      xlsx.writeFile(wb, `${mode.toUpperCase()}_Collection.xlsx`);
    });
  };

  const downloadExcelTotal = () => {
    import("xlsx").then((xlsx) => {
      const data = summaryData.map((row) => ({
        Patient: row.patientname,
        UHID: row.uhid,
        Doctor: row.doctorname,
        Date: formatDate(row.date),
        'Payment Modes': row.payment_mode.map(pm => `${pm.method.toUpperCase()}: ${pm.amount}`).join(', '),
        'Total Amount': row.payment_mode.reduce((sum, pm) => sum + Number(pm.amount), 0),
        Status: row.billing_status,
      }));

      const sheet = xlsx.utils.json_to_sheet(data);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, sheet, "Total Collection");
      xlsx.writeFile(wb, `Total_Collection.xlsx`);
    });
  };

  /* ---------------- PDF DOWNLOAD ---------------- */

  const downloadPDFByMode = async (mode) => {
    const jsPDFModule = await import("jspdf");
    const autoTable = await import("jspdf-autotable");

    const doc = new jsPDFModule.jsPDF();
    doc.text(`${mode.toUpperCase()} Collection Report`, 14, 15);

    autoTable.default(doc, {
      startY: 25,
      head: [["Patient", "UHID", "Doctor", "Date", "Amount"]],
      body: getModeWiseData(mode).map((row) => [
        row.patientname,
        row.uhid,
        row.doctorname,
        formatDate(row.date),
        row.amount,
      ]),
      styles: { fontSize: 8 },
    });

    doc.save(`${mode.toUpperCase()}_Collection.pdf`);
  };

  const downloadPDFTotal = async () => {
    const jsPDFModule = await import("jspdf");
    const autoTable = await import("jspdf-autotable");

    const doc = new jsPDFModule.jsPDF();
    doc.text("Total Collection Report", 14, 15);

    autoTable.default(doc, {
      startY: 25,
      head: [["Patient", "UHID", "Doctor", "Date", "Payment Modes", "Total"]],
      body: summaryData.map((row) => [
        row.patientname,
        row.uhid,
        row.doctorname,
        formatDate(row.date),
        row.payment_mode.map(pm => `${pm.method}: ${pm.amount}`).join('\n'),
        row.payment_mode.reduce((sum, pm) => sum + Number(pm.amount), 0),
      ]),
      styles: { fontSize: 7 },
    });

    doc.save("Total_Collection.pdf");
  };

  /* ---------------- UI ---------------- */

  return (
    <PageContainer>
      <HeaderSection>
        <div>
          <PageTitle>Account Summary</PageTitle>
          <Subtitle>Mode-wise accurate billing report</Subtitle>
        </div>
      </HeaderSection>

      {/* FILTERS */}
      <FilterCard>
        <FilterGrid>
          <FormGroup>
            <Label>From</Label>
            <StyledInput type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <Label>To</Label>
            <StyledInput type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </FormGroup>

          <ClearButton onClick={() => { setFromDate(""); setToDate(""); setPaymentMode("all"); }}>
            Clear
          </ClearButton>
        </FilterGrid>
      </FilterCard>

      {/* PAYMENT CARDS */}
      <StatsRow>
        <ModernStatCard
          title="Cash"
          amount={formatCurrency(paymentTotals.cash)}
          onExcel={() => downloadExcelByMode("cash")}
          onPdf={() => downloadPDFByMode("cash")}
          color="cash"
        />
        
        <ModernStatCard
          title="Card"
          amount={formatCurrency(paymentTotals.card)}
          onExcel={() => downloadExcelByMode("card")}
          onPdf={() => downloadPDFByMode("card")}
          color="card"
        />
        
        <ModernStatCard
          title="UPI"
          amount={formatCurrency(paymentTotals.upi)}
          onExcel={() => downloadExcelByMode("upi")}
          onPdf={() => downloadPDFByMode("upi")}
          color="upi"
        />

        <ModernStatCard
          title="Total Amount"
          amount={formatCurrency(grandTotal)}
          onExcel={downloadExcelTotal}
          onPdf={downloadPDFTotal}
          color="total"
        />
      </StatsRow>

      {/* TABLE */}
      <TableCard>
        <TableHeader>
          <TableTitle>Billing Records</TableTitle>
          <RecordCount>{summaryData.length}</RecordCount>
        </TableHeader>

        <TableWrapper>
          {loading ? (
            <LoadingOverlay><Spinner /></LoadingOverlay>
          ) : (
            <StyledTable>
              <thead>
                <tr>
                  <StyledTh>Patient</StyledTh>
                  <StyledTh>Doctor</StyledTh>
                  <StyledTh>Date</StyledTh>
                  <StyledTh>Payment</StyledTh>
                  <StyledTh>Status</StyledTh>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((item, i) => (
                  <tr key={i}>
                    <StyledTd>
                      <PatientInfo>
                        <PatientName>{item.patientname}</PatientName>
                        <UhidTag>{item.uhid}</UhidTag>
                      </PatientInfo>
                    </StyledTd>
                    <StyledTd>{item.doctorname}</StyledTd>
                    <StyledTd>{formatDate(item.date)}</StyledTd>
                    <StyledTd>
                      {item.payment_mode.map((pm, idx) => (
                        <div key={idx}>
                          {pm.method.toUpperCase()} : {formatCurrency(pm.amount)}
                        </div>
                      ))}
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