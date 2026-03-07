import React, { useEffect, useState } from "react";
import styled from "styled-components";
import apiRequest from "./apiRequest";

const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL;

// ==================== STYLED COMPONENTS ====================

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  padding: 40px 20px;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;

  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  padding: 40px;
  border-radius: 24px;
  margin-bottom: 40px;
  box-shadow: 0 20px 40px rgba(192, 111, 162, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
    border-radius: 50%;
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  color: white;
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin: 0;
  font-weight: 400;
`;

const FilterSection = styled.div`
  background: white;
  padding: 28px 32px;
  border-radius: 20px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 2px solid #f3e8ff;
  transition: all 0.3s ease;

  &:hover {
    border-color: #C06FA2;
    box-shadow: 0 8px 24px rgba(192, 111, 162, 0.12);
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DateInput = styled.input`
  padding: 12px 16px;
  border: 2px solid #e9d5ff;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
  font-family: 'JetBrains Mono', monospace;
  transition: all 0.2s ease;
  background: #faf5ff;

  &:focus {
    outline: none;
    border-color: #C06FA2;
    background: white;
    box-shadow: 0 0 0 3px rgba(192, 111, 162, 0.1);
  }

  &:hover {
    border-color: #d8b4fe;
  }
`;

const ViewButton = styled.button`
  padding: 12px 32px;
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(192, 111, 162, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(192, 111, 162, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BackButton = styled(ViewButton)`
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);

  &:hover {
    box-shadow: 0 8px 20px rgba(100, 116, 139, 0.4);
  }
`;

const SearchInput = styled.input`
  padding: 12px 16px;
  border: 2px solid #e9d5ff;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
  font-family: 'Outfit', sans-serif;
  transition: all 0.2s ease;
  background: #faf5ff;
  min-width: 250px;

  &:focus {
    outline: none;
    border-color: #C06FA2;
    background: white;
    box-shadow: 0 0 0 3px rgba(192, 111, 162, 0.1);
  }

  &:hover {
    border-color: #d8b4fe;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SelectInput = styled.select`
  padding: 12px 16px;
  border: 2px solid #e9d5ff;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  font-family: 'Outfit', sans-serif;
  transition: all 0.2s ease;
  background: #faf5ff;
  cursor: pointer;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #C06FA2;
    background: white;
    box-shadow: 0 0 0 3px rgba(192, 111, 162, 0.1);
  }

  &:hover {
    border-color: #d8b4fe;
  }
`;

const TotalsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding-top: 24px;
  border-top: 2px solid #f3e8ff;
`;

const TotalCard = styled.div`
  background: ${props => props.primary ? 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)' : '#faf5ff'};
  padding: 20px 24px;
  border-radius: 16px;
  border: 2px solid ${props => props.primary ? '#C06FA2' : '#e9d5ff'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(192, 111, 162, 0.15);
  }
`;

const TotalLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
`;

const TotalValue = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: ${props => props.large ? '28px' : '24px'};
  font-weight: 800;
  color: ${props => props.primary ? '#C06FA2' : '#0f172a'};
  letter-spacing: -0.02em;
`;

const ShiftsContainer = styled.div`
  display: grid;
  gap: 24px;
`;

const ShiftCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border: 2px solid ${props => props.expanded ? '#C06FA2' : '#f3e8ff'};
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ShiftHeader = styled.div`
  padding: 24px 32px;
  background: ${props => props.expanded ? 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)' : '#fafafa'};
  cursor: pointer;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  align-items: center;
  transition: all 0.3s ease;
  border-bottom: 2px solid ${props => props.expanded ? '#C06FA2' : 'transparent'};

  &:hover {
    background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%);
  }
`;

const ShiftInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InfoValue = styled.span`
  font-size: ${props => props.large ? '18px' : '15px'};
  font-weight: ${props => props.bold ? '700' : '600'};
  color: ${props => props.primary ? '#C06FA2' : '#0f172a'};
  font-family: ${props => props.mono ? "'JetBrains Mono', monospace" : 'inherit'};
`;

const PatientsSection = styled.div`
  padding: 0;
  max-height: ${props => props.expanded ? '2000px' : '0'};
  opacity: ${props => props.expanded ? '1' : '0'};
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
`;

const PatientsGrid = styled.div`
  display: grid;
  gap: 16px;
  padding: 24px;
  background: #faf5ff;
`;

const PatientCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #e9d5ff;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;

  &:hover {
    border-color: #C06FA2;
    box-shadow: 0 8px 20px rgba(192, 111, 162, 0.15);
    transform: translateY(-4px);
  }
`;

const PatientHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3e8ff;
`;

const PatientInfo = styled.div`
  flex: 1;
`;

const PatientName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  letter-spacing: -0.01em;
`;

const UHID = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  color: #C06FA2;
  background: #fdf4ff;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #fae8ff;
  display: inline-block;
`;

const PatientTotal = styled.div`
  text-align: right;
`;

const PatientTotalLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const TotalAmount = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailSection = styled.div`
  background: #faf5ff;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e9d5ff;
`;

const SectionTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 3px;
    height: 16px;
    background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
    border-radius: 2px;
  }
`;

const ProcedureItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid #e9d5ff;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d8b4fe;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProcedureName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  flex: 1;
`;

const ProcedureAmount = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  margin-left: 12px;
`;

const PaymentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid #e9d5ff;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d8b4fe;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const PaymentMethod = styled.span`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${props => {
    switch (props.method?.toLowerCase()) {
      case 'upi': return '#eff6ff';
      case 'cash': return '#f0fdf4';
      case 'card': return '#fdf4ff';
      case 'bank': return '#fef3c7';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.method?.toLowerCase()) {
      case 'upi': return '#2563eb';
      case 'cash': return '#16a34a';
      case 'card': return '#C06FA2';
      case 'bank': return '#d97706';
      default: return '#64748b';
    }
  }};
  border: 1px solid ${props => {
    switch (props.method?.toLowerCase()) {
      case 'upi': return '#bfdbfe';
      case 'cash': return '#bbf7d0';
      case 'card': return '#fae8ff';
      case 'bank': return '#fde68a';
      default: return '#e2e8f0';
    }
  }};
`;

const PaymentAmount = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 40px;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
`;

const EmptyText = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: #475569;
  margin: 0;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px;

  &::after {
    content: '';
    width: 50px;
    height: 50px;
    border: 4px solid #e9d5ff;
    border-top-color: #C06FA2;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ExpandIndicator = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.expanded ? '#C06FA2' : '#f3e8ff'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: ${props => props.expanded ? 'white' : '#64748b'};
  font-size: 20px;
  font-weight: 700;
  transform: rotate(${props => props.expanded ? '180deg' : '0deg'});
`;

// ==================== TABLE VIEW STYLES ====================

const TableContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 2px solid #f3e8ff;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
`;

const Thead = styled.thead`
  background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%);
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 700;
  font-size: 12px;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #C06FA2;
  white-space: nowrap;

  &:first-child {
    border-top-left-radius: 12px;
  }

  &:last-child {
    border-top-right-radius: 12px;
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  transition: all 0.2s ease;

  &:hover {
    background: #faf5ff;
  }

  &:not(:last-child) td {
    border-bottom: 1px solid #f3e8ff;
  }
`;

const Td = styled.td`
  padding: 16px;
  color: #0f172a;
  font-weight: 500;
  vertical-align: top;

  &.mono {
    font-family: 'JetBrains Mono', monospace;
  }

  &.primary {
    color: #C06FA2;
    font-weight: 700;
  }

  &.bold {
    font-weight: 700;
  }
`;

const NestedTable = styled.div`
  margin-top: 8px;
  padding: 12px;
  background: #faf5ff;
  border-radius: 8px;
  border: 1px solid #e9d5ff;
`;

const NestedRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
  
  &:not(:last-child) {
    border-bottom: 1px solid #e9d5ff;
  }
`;

const NestedLabel = styled.span`
  color: #64748b;
  font-weight: 600;
`;

const NestedValue = styled.span`
  color: #0f172a;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
`;

// ==================== MAIN COMPONENT ====================

export default function AccountSummaryWithDetails() {
  const [data, setData] = useState([]);
  const [expandedShift, setExpandedShift] = useState(null);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [searchText, setSearchText] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all"); // 'all', 'cash', 'bank'

  useEffect(() => {
    fetchSummary();
  }, [fromDate, toDate]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await apiRequest(
        `${ERbaseurl}AccountSummary/?from=${fromDate}&to=${toDate}`,
        "GET"
      );

      if (res && res.success && Array.isArray(res.data?.data)) {
        setData(res.data.data);
      } else {
        setData([]);
        console.error("Unexpected API response:", res);
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall totals
  const calculateOverallTotals = () => {
    const totals = data.reduce(
      (acc, shift) => {
        acc.cash += shift.cash_total || 0;
        acc.bank += shift.digital_total || 0;
        acc.total += shift.total_amount || 0;
        return acc;
      },
      { cash: 0, bank: 0, total: 0 }
    );
    return totals;
  };

  const overallTotals = calculateOverallTotals();

  // Filter data based on search text and payment filter
  const filteredData = data.filter(shift => {
    // Search filter - check employee name and patient names
    const searchLower = searchText.toLowerCase();
    const matchesSearch = searchText === "" || 
      shift.employee_name?.toLowerCase().includes(searchLower) ||
      shift.patients?.some(patient => 
        patient.patientname?.toLowerCase().includes(searchLower)
      );

    // Payment filter
    let matchesPayment = true;
    if (paymentFilter === "cash") {
      matchesPayment = shift.cash_total > 0;
    } else if (paymentFilter === "bank") {
      matchesPayment = shift.digital_total > 0;
    }

    return matchesSearch && matchesPayment;
  });

  // Calculate filtered totals
  const calculateFilteredTotals = () => {
    const totals = filteredData.reduce(
      (acc, shift) => {
        acc.cash += shift.cash_total || 0;
        acc.bank += shift.digital_total || 0;
        acc.total += shift.total_amount || 0;
        return acc;
      },
      { cash: 0, bank: 0, total: 0 }
    );
    return totals;
  };

  const displayTotals = searchText || paymentFilter !== "all" ? calculateFilteredTotals() : overallTotals;

 const formatDateTime = (dt) => {
  if (!dt) return "-";

  let dateObj;

  // If datetime already has timezone info
  if (dt.includes("Z") || dt.includes("+")) {
    dateObj = new Date(dt);
  } else {
    // Assume UTC if timezone missing
    dateObj = new Date(dt + "Z");
  }

  return dateObj.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};



  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  const toggleShift = (idx) => {
    setExpandedShift(expandedShift === idx ? null : idx);
  };

  const getTableRows = () => {
  const rows = [];

  data.forEach((shift) => {
    if (!shift.patients || shift.patients.length === 0) {
      rows.push({
        shiftno: shift.shiftno,
        employee: shift.employee_name,
        start: shift.starttime,
        end: shift.endtime,
        patientname: "-",
        uhid: "-",
        procedures: [],
        payments: [],
        patientTotal: 0,
        cashTotal: shift.cash_total,
        bankTotal: shift.digital_total,
        grandTotal: shift.total_amount,
        isFirstPatient: true,
        patientCount: 1,
      });
    } else {
      shift.patients.forEach((patient, index) => {
        rows.push({
          shiftno: shift.shiftno,
          employee: shift.employee_name,
          start: shift.starttime,
          end: shift.endtime,
          patientname: patient.patientname,
          uhid: patient.uhid,
          procedures: patient.procedures || [],
          payments: patient.payments || [],
          patientTotal: patient.total,
          cashTotal: shift.cash_total,
          bankTotal: shift.digital_total,
          grandTotal: shift.total_amount,
          isFirstPatient: index === 0,
          patientCount: shift.patients.length,
        });
      });
    }
  });

  return rows;
};


  // Handle Print
  const handlePrint = () => {
  const tableRows = getTableRows();
  const newWindow = window.open("", "_blank");

  newWindow.document.write(`
    <html>
      <head>
        <title>ER-ShiftWise Summary Table</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h2 {
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
            vertical-align: top;
          }
          th {
            background: #f3e8ff;
          }
          .mono { font-family: monospace; }
          .bold { font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>ER-ShiftWise Account Summary (${fromDate} to ${toDate})</h2>
        <table>
          <thead>
            <tr>
              <th>Shift No</th>
              <th>Employee</th>
              <th>Start</th>
              <th>End</th>
              <th>Patient</th>
              <th>UHID</th>
              <th>Procedures</th>
              <th>Payments</th>
              <th>Patient Total</th>
              <th>Cash</th>
              <th>Bank</th>
              <th>Grand Total</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows.map(row => `
              <tr>
                ${row.isFirstPatient ? `
                  <td rowspan="${row.patientCount}" class="mono">${row.shiftno}</td>
                  <td rowspan="${row.patientCount}">${row.employee}</td>
                  <td rowspan="${row.patientCount}">${formatDateTime(row.start)}</td>
                  <td rowspan="${row.patientCount}">${formatDateTime(row.end)}</td>
                ` : ""}

                <td class="bold">${row.patientname}</td>
                <td class="mono">${row.uhid}</td>

                <td>
                  ${row.procedures.length
                    ? row.procedures.map(p => `${p.procedure_name} (${formatCurrency(p.total)})`).join("<br>")
                    : "-"}
                </td>

                <td>
                  ${row.payments.length
                    ? row.payments.map(p => `${p.method} (${formatCurrency(p.amount)})`).join("<br>")
                    : "-"}
                </td>

                <td class="mono bold">${formatCurrency(row.patientTotal)}</td>

                ${row.isFirstPatient ? `
                  <td rowspan="${row.patientCount}" class="mono">${formatCurrency(row.cashTotal)}</td>
                  <td rowspan="${row.patientCount}" class="mono">${formatCurrency(row.bankTotal)}</td>
                  <td rowspan="${row.patientCount}" class="mono bold">${formatCurrency(row.grandTotal)}</td>
                ` : ""}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
    </html>
  `);

  newWindow.document.close();
};


  // Generate Print HTML
  const generatePrintHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Shift Account Summary - ${fromDate} to ${toDate}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      padding: 20px;
      color: #1a1a1a;
      background: white;
    }
    
    .print-header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #C06FA2;
    }
    
    .print-header h1 {
      font-size: 28px;
      font-weight: 800;
      color: #C06FA2;
      margin-bottom: 8px;
    }
    
    .print-header .subtitle {
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
    }
    
    .date-range {
      font-size: 16px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .totals-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
      padding: 20px;
      background: #faf5ff;
      border-radius: 12px;
      border: 2px solid #e9d5ff;
    }
    
    .total-item {
      text-align: center;
      padding: 15px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e9d5ff;
    }
    
    .total-item.primary {
      background: #fdf4ff;
      border-color: #C06FA2;
    }
    
    .total-label {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    
    .total-value {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
    }
    
    .total-value.primary {
      color: #C06FA2;
      font-size: 28px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-top: 20px;
    }
    
    thead {
      background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%);
    }
    
    th {
      padding: 12px 10px;
      text-align: left;
      font-weight: 700;
      font-size: 10px;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #C06FA2;
      border-right: 1px solid #e9d5ff;
    }
    
    th:last-child {
      border-right: none;
    }
    
    td {
      padding: 10px;
      border-bottom: 1px solid #f3e8ff;
      border-right: 1px solid #f3e8ff;
      vertical-align: top;
    }
    
    td:last-child {
      border-right: none;
    }
    
    tbody tr:hover {
      background: #faf5ff;
    }
    
    tbody tr:last-child td {
      border-bottom: 2px solid #C06FA2;
    }
    
    .mono {
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }
    
    .bold {
      font-weight: 700;
    }
    
    .primary {
      color: #C06FA2;
      font-weight: 700;
    }
    
    .nested-data {
      margin: 4px 0;
      padding: 8px;
      background: #faf5ff;
      border-radius: 4px;
      font-size: 11px;
    }
    
    .nested-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px solid #e9d5ff;
    }
    
    .nested-row:last-child {
      border-bottom: none;
    }
    
    .nested-label {
      color: #64748b;
      font-weight: 600;
    }
    
    .nested-value {
      color: #0f172a;
      font-weight: 700;
      font-family: 'Courier New', monospace;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e9d5ff;
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
    
    @media print {
      body {
        padding: 10px;
      }
      
      .print-header h1 {
        font-size: 24px;
      }
      
      table {
        font-size: 10px;
      }
      
      th {
        font-size: 9px;
        padding: 8px 6px;
      }
      
      td {
        padding: 6px;
      }
      
      .totals-summary {
        page-break-inside: avoid;
      }
      
      @page {
        margin: 0.5cm;
      }
    }
  </style>
</head>
<body>
  <div class="print-header">
    <h1>Shift Account Summary Report</h1>
    <p class="subtitle">Comprehensive overview of shift closings and patient transactions</p>
  </div>
  
  <div class="date-range">
    Report Period: ${formatDateTime(fromDate)} to ${formatDateTime(toDate)}
  </div>
  
  <div class="totals-summary">
    <div class="total-item">
      <div class="total-label">Overall Cash Total</div>
      <div class="total-value">${formatCurrency(overallTotals.cash)}</div>
    </div>
    <div class="total-item">
      <div class="total-label">Overall Bank Total</div>
      <div class="total-value">${formatCurrency(overallTotals.bank)}</div>
    </div>
    <div class="total-item primary">
      <div class="total-label">Overall Grand Total</div>
      <div class="total-value primary">${formatCurrency(overallTotals.total)}</div>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Shift No</th>
        <th>Employee</th>
        <th>Start Date & Time</th>
        <th>End Date & Time</th>
        <th>Patient Name</th>
        <th>UHID</th>
        <th>Procedures</th>
        <th>Payments</th>
        <th>Patient Total</th>
        <th>Cash Total</th>
        <th>Bank Total</th>
        <th>Grand Total</th>
      </tr>
    </thead>
    <tbody>
      ${data.map((shift, shiftIdx) => {
        const patientCount = shift.patients?.length || 0;
        
        return shift.patients?.map((patient, patIdx) => `
          <tr>
            ${patIdx === 0 ? `
              <td class="mono" rowspan="${patientCount}">${shift.shiftno}</td>
              <td rowspan="${patientCount}">${shift.employee_name}</td>
              <td rowspan="${patientCount}">${formatDateTime(shift.starttime)}</td>
              <td rowspan="${patientCount}">${formatDateTime(shift.endtime)}</td>
            ` : ''}
            <td class="bold">${patient.patientname}</td>
            <td class="mono primary">${patient.uhid}</td>
            <td>
              ${patient.procedures?.length > 0 ? `
                <div class="nested-data">
                  ${patient.procedures.map(proc => `
                    <div class="nested-row">
                      <span class="nested-label">${proc.procedure_name}</span>
                      <span class="nested-value">${formatCurrency(proc.total)}</span>
                    </div>
                  `).join('')}
                </div>
              ` : '-'}
            </td>
            <td>
              ${patient.payments?.length > 0 ? `
                <div class="nested-data">
                  ${patient.payments.map(payment => `
                    <div class="nested-row">
                      <span class="nested-label">${payment.method}</span>
                      <span class="nested-value">${formatCurrency(payment.amount)}</span>
                    </div>
                  `).join('')}
                </div>
              ` : '-'}
            </td>
            <td class="mono bold">${formatCurrency(patient.total)}</td>
            ${patIdx === 0 ? `
              <td class="mono primary" rowspan="${patientCount}">${formatCurrency(shift.cash_total)}</td>
              <td class="mono primary" rowspan="${patientCount}">${formatCurrency(shift.digital_total)}</td>
              <td class="mono bold primary" rowspan="${patientCount}">${formatCurrency(shift.total_amount)}</td>
            ` : ''}
          </tr>
        `).join('');
      }).join('')}
    </tbody>
  </table>
  
  <div class="footer">
    <p>Generated on ${new Date().toLocaleString('en-IN', { 
      dateStyle: 'full', 
      timeStyle: 'medium' 
    })}</p>
    <p style="margin-top: 8px;">This is a computer-generated report. For manager submission.</p>
  </div>
</body>
</html>
    `;
  };

  // Render Table View
  const renderTableView = () => {
    return (
      <>
        <FilterSection>
          <FilterRow>
            <BackButton onClick={() => setViewMode('cards')}>
              ← Back to Card View
            </BackButton>
          </FilterRow>

          {data.length > 0 && (
            <TotalsRow>
              <TotalCard>
                <TotalLabel>Overall Cash Total</TotalLabel>
                <TotalValue>{formatCurrency(displayTotals.cash)}</TotalValue>
              </TotalCard>
              <TotalCard>
                <TotalLabel>Overall Bank Total</TotalLabel>
                <TotalValue>{formatCurrency(displayTotals.bank)}</TotalValue>
              </TotalCard>
              <TotalCard primary>
                <TotalLabel>Overall Grand Total</TotalLabel>
                <TotalValue large primary>{formatCurrency(displayTotals.total)}</TotalValue>
              </TotalCard>
            </TotalsRow>
          )}
        </FilterSection>

        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Shift No</Th>
                <Th>Employee</Th>
                <Th>Start Date & Time</Th>
                <Th>End Date & Time</Th>
                <Th>Patient Name</Th>
                <Th>UHID</Th>
                <Th>Procedures</Th>
                <Th>Payments</Th>
                <Th>Patient Total</Th>
                <Th>Cash Total</Th>
                <Th>Bank Total</Th>
                <Th>Grand Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((shift, shiftIdx) => {
                const patientCount = shift.patients?.length || 0;
                
                return shift.patients?.map((patient, patIdx) => (
                  <Tr key={`${shiftIdx}-${patIdx}`}>
                    {patIdx === 0 && (
                      <>
                        <Td className="mono" rowSpan={patientCount}>{shift.shiftno}</Td>
                        <Td rowSpan={patientCount}>{shift.employee_name}</Td>
                        <Td rowSpan={patientCount}>{formatDateTime(shift.starttime)}</Td>
                        <Td rowSpan={patientCount}>{formatDateTime(shift.endtime)}</Td>
                      </>
                    )}
                    <Td className="bold">{patient.patientname}</Td>
                    <Td className="mono primary">{patient.uhid}</Td>
                    <Td>
                      {patient.procedures?.length > 0 && (
                        <NestedTable>
                          {patient.procedures.map((proc, procIdx) => (
                            <NestedRow key={procIdx}>
                              <NestedLabel>{proc.procedure_name}</NestedLabel>
                              <NestedValue>{formatCurrency(proc.total)}</NestedValue>
                            </NestedRow>
                          ))}
                        </NestedTable>
                      )}
                    </Td>
                    <Td>
                      {patient.payments?.length > 0 && (
                        <NestedTable>
                          {patient.payments.map((payment, payIdx) => (
                            <NestedRow key={payIdx}>
                              <NestedLabel>{payment.method}</NestedLabel>
                              <NestedValue>{formatCurrency(payment.amount)}</NestedValue>
                            </NestedRow>
                          ))}
                        </NestedTable>
                      )}
                    </Td>
                    <Td className="mono bold">{formatCurrency(patient.total)}</Td>
                    {patIdx === 0 && (
                      <>
                        <Td className="mono primary" rowSpan={patientCount}>{formatCurrency(shift.cash_total)}</Td>
                        <Td className="mono primary" rowSpan={patientCount}>{formatCurrency(shift.digital_total)}</Td>
                        <Td className="mono bold primary" rowSpan={patientCount}>{formatCurrency(shift.total_amount)}</Td>
                      </>
                    )}
                  </Tr>
                ));
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </>
    );
  };

  // Render Card View
  const renderCardView = () => {
    return (
      <>
        <FilterSection>
          <FilterRow>
            <FilterLabel>
              From Date
              <DateInput
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </FilterLabel>
            <FilterLabel>
              To Date
              <DateInput
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </FilterLabel>
            <ViewButton onClick={() => setViewMode('table')}>
              📊 View Table
            </ViewButton>
            <ViewButton onClick={handlePrint}>
              🖨️ Print Report
            </ViewButton>
          </FilterRow>

          <FilterRow>
            <FilterLabel>
              Search
              <SearchInput
                type="text"
                placeholder="Search by Employee or Patient Name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </FilterLabel>
            <FilterLabel>
              Payment Type
              <SelectInput
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
              </SelectInput>
            </FilterLabel>
          </FilterRow>

          {!loading && data.length > 0 && (
            <TotalsRow>
              <TotalCard>
                <TotalLabel>Overall Cash Total</TotalLabel>
                <TotalValue>{formatCurrency(displayTotals.cash)}</TotalValue>
              </TotalCard>
              <TotalCard>
                <TotalLabel>Overall Bank Total</TotalLabel>
                <TotalValue>{formatCurrency(displayTotals.bank)}</TotalValue>
              </TotalCard>
              <TotalCard primary>
                <TotalLabel>Overall Grand Total</TotalLabel>
                <TotalValue large primary>{formatCurrency(displayTotals.total)}</TotalValue>
              </TotalCard>
            </TotalsRow>
          )}
        </FilterSection>

        {loading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📊</EmptyIcon>
            <EmptyText>No shifts found for the selected date range</EmptyText>
          </EmptyState>
        ) : filteredData.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🔍</EmptyIcon>
            <EmptyText>No results match your search criteria</EmptyText>
          </EmptyState>
        ) : (
          <ShiftsContainer>
            {filteredData.map((shift, idx) => (
              <ShiftCard key={idx} expanded={expandedShift === idx}>
                <ShiftHeader
                  expanded={expandedShift === idx}
                  onClick={() => toggleShift(idx)}
                >
                  <ShiftInfoItem>
                    <InfoLabel>Shift No</InfoLabel>
                    <InfoValue mono>{shift.shiftno}</InfoValue>
                  </ShiftInfoItem>

                  <ShiftInfoItem>
                    <InfoLabel>Employee</InfoLabel>
                    <InfoValue>{shift.employee_name}</InfoValue>
                  </ShiftInfoItem>

                  <ShiftInfoItem>
                    <InfoLabel>Start Date & Time</InfoLabel>
                    <InfoValue>{formatDateTime(shift.starttime)}</InfoValue>
                  </ShiftInfoItem>

                  <ShiftInfoItem>
                    <InfoLabel>End Date & Time</InfoLabel>
                    <InfoValue>{formatDateTime(shift.endtime)}</InfoValue>
                  </ShiftInfoItem>

                  <ShiftInfoItem>
                    <InfoLabel>Cash Total</InfoLabel>
                    <InfoValue mono primary>{formatCurrency(shift.cash_total)}</InfoValue>
                  </ShiftInfoItem>

                  <ShiftInfoItem>
                    <InfoLabel>Bank Total(Card + UPI)</InfoLabel>
                    <InfoValue mono primary>{formatCurrency(shift.digital_total)}</InfoValue>
                  </ShiftInfoItem>

                  <ShiftInfoItem>
                    <InfoLabel>Grand Total</InfoLabel>
                    <InfoValue large bold mono primary>{formatCurrency(shift.total_amount)}</InfoValue>
                  </ShiftInfoItem>

                  <ExpandIndicator expanded={expandedShift === idx}>
                    ▼
                  </ExpandIndicator>
                </ShiftHeader>

                <PatientsSection expanded={expandedShift === idx}>
                  <PatientsGrid>
                    {shift.patients?.map((patient, pIdx) => (
                      <PatientCard key={pIdx}>
                        <PatientHeader>
                          <PatientInfo>
                            <PatientName>{patient.patientname}</PatientName>
                            <UHID>{patient.uhid}</UHID>
                          </PatientInfo>
                          <PatientTotal>
                            <PatientTotalLabel>Total</PatientTotalLabel>
                            <TotalAmount>{formatCurrency(patient.total)}</TotalAmount>
                          </PatientTotal>
                        </PatientHeader>

                        <DetailsGrid>
                          <DetailSection>
                            <SectionTitle>Procedures</SectionTitle>
                            {patient.procedures?.map((proc, procIdx) => (
                              <ProcedureItem key={procIdx}>
                                <ProcedureName>{proc.procedure_name}</ProcedureName>
                                <ProcedureAmount>{formatCurrency(proc.total)}</ProcedureAmount>
                              </ProcedureItem>
                            ))}
                          </DetailSection>

                          <DetailSection>
                            <SectionTitle>Payments</SectionTitle>
                            {patient.payments?.map((payment, payIdx) => (
                              <PaymentItem key={payIdx}>
                                <PaymentMethod method={payment.method}>
                                  {payment.method}
                                </PaymentMethod>
                                <PaymentAmount>{formatCurrency(payment.amount)}</PaymentAmount>
                              </PaymentItem>
                            ))}
                          </DetailSection>
                        </DetailsGrid>
                      </PatientCard>
                    ))}
                  </PatientsGrid>
                </PatientsSection>
              </ShiftCard>
            ))}
          </ShiftsContainer>
        )}
      </>
    );
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <HeaderContent>
            <Title>Shift Account Summary</Title>
            <Subtitle>Comprehensive overview of shift closings and patient transactions</Subtitle>
          </HeaderContent>
        </Header>

        {viewMode === 'cards' ? renderCardView() : renderTableView()}
      </ContentWrapper>
    </PageContainer>
  );
}