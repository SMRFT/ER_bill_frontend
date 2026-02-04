import React, { useState, useEffect } from "react";
import styled from "styled-components";
import apiRequest from "./apiRequest";
import * as XLSX from "xlsx";

const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL;

/* ================== STYLES ================== */

const Container = styled.div`
  padding: 32px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  padding: 28px 32px;
  border-radius: 16px;
  margin-bottom: 32px;
  box-shadow: 0 8px 24px rgba(192, 111, 162, 0.3);
`;

const Title = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: 28px;
  font-weight: 600;
`;

const FilterCard = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

const FilterBar = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
`;

const Input = styled.input`
  padding: 10px 14px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-size: 14px;
`;

/* ✅ DEFINE BUTTON FIRST */
const Button = styled.button`
  padding: 10px 24px;
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(192, 111, 162, 0.3);

  &:hover {
    transform: translateY(-2px);
  }
`;

const ExportButton = styled(Button)`
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
`;

const TableContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  color: white;
  padding: 16px;
  text-align: center;
`;

const Td = styled.td`
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #faf5f9;
  }
`;

const FooterRow = styled.tr`
  background: rgba(192, 111, 162, 0.1);
  font-weight: 600;
`;

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #718096;
`;

const CurrencyText = styled.span`
  font-weight: 500;
`;

/* ================== DATE FORMATTER (IST SAFE) ================== */

const formatDate = (dt) => {
  if (!dt) return "-";

  let dateObj;

  if (typeof dt === "object" && dt.$date) {
    dateObj = new Date(dt.$date);
  } else if (typeof dt === "string" && !dt.endsWith("Z")) {
    dateObj = new Date(dt + "Z"); // force UTC
  } else {
    dateObj = new Date(dt);
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(dateObj);
};

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

/* ================== COMPONENT ================== */

const PharmacistShiftReport = () => {
  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());
  const [report, setReport] = useState([]);

  const fetchReport = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates");
      return;
    }

    try {
      const res = await apiRequest(
        `${ERbaseurl}get_pharmacist_shiftreport/`,
        "POST",
        { from_date: fromDate, to_date: toDate }
      );
      setReport(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const exportToExcel = () => {
    if (report.length === 0) return alert("No data to export");

    const excelData = report.map((row) => ({
      "Shift No": row.shiftno,
      "Start Time": formatDate(row.starttime),
      "End Time": formatDate(row.endtime),
      "Cash (₹)": row.cash_total,
      "Bank (₹)": row.bank_total,
      "Grand Total (₹)": row.grand_total,
    }));

    const totalCash = report.reduce((s, r) => s + r.cash_total, 0);
    const totalBank = report.reduce((s, r) => s + r.bank_total, 0);

    excelData.push({
      "Shift No": "TOTAL",
      "Start Time": "",
      "End Time": "",
      "Cash (₹)": totalCash.toFixed(2),
      "Bank (₹)": totalBank.toFixed(2),
      "Grand Total (₹)": (totalCash + totalBank).toFixed(2),
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Shift Report");
    XLSX.writeFile(wb, `Pharmacist_Report_${fromDate}_to_${toDate}.xlsx`);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const totalCash = report.reduce((s, r) => s + r.cash_total, 0);
  const totalBank = report.reduce((s, r) => s + r.bank_total, 0);

  return (
    <Container>
      <Header>
        <Title>Pharmacist Shift Collection Report</Title>
      </Header>

      <FilterCard>
        <FilterBar>
          <Label>From:</Label>
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <Label>To:</Label>
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <Button onClick={fetchReport}>Get Report</Button>
          {report.length > 0 && (
            <ExportButton onClick={exportToExcel}>Export Excel</ExportButton>
          )}
        </FilterBar>
      </FilterCard>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Shift No</Th>
              <Th>Start</Th>
              <Th>End</Th>
              <Th>Cash</Th>
              <Th>Bank</Th>
              <Th>Grand Total</Th>
            </tr>
          </thead>
          <tbody>
            {report.length === 0 ? (
              <tr>
                <td colSpan="6"><EmptyState>No data found</EmptyState></td>
              </tr>
            ) : (
              report.map((row, i) => (
                <Tr key={i}>
                  <Td>{row.shiftno}</Td>
                  <Td>{formatDate(row.starttime)}</Td>
                  <Td>{formatDate(row.endtime)}</Td>
                  <Td><CurrencyText>₹ {row.cash_total}</CurrencyText></Td>
                  <Td><CurrencyText>₹ {row.bank_total}</CurrencyText></Td>
                  <Td><CurrencyText>₹ {row.grand_total}</CurrencyText></Td>
                </Tr>
              ))
            )}

            {report.length > 0 && (
              <FooterRow>
                <Td colSpan="3">TOTAL</Td>
                <Td>₹ {totalCash.toFixed(2)}</Td>
                <Td>₹ {totalBank.toFixed(2)}</Td>
                <Td>₹ {(totalCash + totalBank).toFixed(2)}</Td>
              </FooterRow>
            )}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PharmacistShiftReport;
