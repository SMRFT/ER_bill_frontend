import React, { useEffect, useState, useMemo } from "react";
import apiRequest from "./apiRequest";
import styled, { css, keyframes } from "styled-components";
import * as XLSX from "xlsx";

// ─── Tokens ────────────────────────────────────────────────────────────────
const tokens = {
  bg: "#f0f4f8",
  surface: "#ffffff",
  surfaceAlt: "#f7fafc",
  border: "#e2e8f0",
  borderFocus: "#4f46e5",
  text: "#1e293b",
  textMuted: "#64748b",
  accent: "#4f46e5",
  accentHover: "#4338ca",
  accentLight: "#eef2ff",
  danger: "#ef4444",
  success: "#10b981",
  radius: "10px",
  radiusSm: "6px",
  shadow: "0 1px 3px rgba(0,0,0,.08)",
  shadowMd: "0 4px 12px rgba(0,0,0,.10)",
};

// ─── Keyframes ──────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Layout ─────────────────────────────────────────────────────────────────
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${tokens.bg};
  padding: 32px 24px;
  font-family: "Segoe UI", system-ui, sans-serif;
  color: ${tokens.text};
`;

const Card = styled.div`
  background: ${tokens.surface};
  border-radius: 16px;
  box-shadow: ${tokens.shadowMd};
  padding: 28px 28px 24px;
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeUp} .35s ease both;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${tokens.text};
  margin: 0 0 24px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "";
    display: block;
    width: 4px;
    height: 24px;
    background: ${tokens.accent};
    border-radius: 2px;
  }
`;

// ─── Top Row (Dates + Export) ───────────────────────────────────────────────
const TopRow = styled.div`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

const DateGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  flex: 1 1 auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1 1 140px;
  min-width: 140px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${tokens.textMuted};
  text-transform: uppercase;
  letter-spacing: .5px;
`;

const Input = styled.input`
  height: 38px;
  padding: 0 12px;
  border: 1.5px solid ${tokens.border};
  border-radius: ${tokens.radius};
  font-size: 14px;
  color: ${tokens.text};
  background: ${tokens.surfaceAlt};
  transition: border-color .2s, box-shadow .2s;
  outline: none;

  &:focus {
    border-color: ${tokens.borderFocus};
    box-shadow: 0 0 0 3px rgba(79,70,229,.15);
    background: #fff;
  }
`;

// ─── Buttons ────────────────────────────────────────────────────────────────
const Button = styled.button`
  height: 38px;
  padding: 0 20px;
  border: none;
  border-radius: ${tokens.radius};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
  transition: background .2s, transform .1s, box-shadow .2s;

  ${({ variant }) =>
    variant === "export"
      ? css`
          background: ${tokens.success};
          color: #fff;
          &:hover { background: #059669; box-shadow: 0 2px 8px rgba(16,185,129,.35); }
        `
      : css`
          background: ${tokens.accent};
          color: #fff;
          &:hover { background: ${tokens.accentHover}; box-shadow: 0 2px 8px rgba(79,70,229,.35); }
        `}

  &:active { transform: scale(.96); }
`;

// ─── Search Row ─────────────────────────────────────────────────────────────
const SearchRow = styled.div`
  margin-bottom: 20px;
`;

const SearchWrapper = styled.div`
  position: relative;
  max-width: 440px;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${tokens.textMuted};
  display: flex;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 14px 0 38px;
  border: 1.5px solid ${tokens.border};
  border-radius: ${tokens.radius};
  font-size: 14px;
  color: ${tokens.text};
  background: ${tokens.surfaceAlt};
  outline: none;
  box-sizing: border-box;
  transition: border-color .2s, box-shadow .2s;

  &:focus {
    border-color: ${tokens.borderFocus};
    box-shadow: 0 0 0 3px rgba(79,70,229,.15);
    background: #fff;
  }

  &::placeholder { color: ${tokens.textMuted}; }
`;

// ─── Summary Cards ──────────────────────────────────────────────────────────
const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: ${tokens.textMuted};
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: .6px;
`;

const SummaryRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 28px;
`;

const SummaryCard = styled.div`
  flex: 1 1 140px;
  background: ${({ color }) => color || tokens.accentLight};
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-left: 4px solid ${({ accent }) => accent || tokens.accent};
  animation: ${fadeUp} .4s ease both;
`;

const SummaryLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .7px;
  color: ${({ accent }) => accent || tokens.accent};
`;

const SummaryValue = styled.span`
  font-size: 26px;
  font-weight: 700;
  color: ${tokens.text};
`;

// ─── Table ──────────────────────────────────────────────────────────────────
const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid ${tokens.border};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  background: ${tokens.surfaceAlt};
  padding: 11px 14px;
  text-align: left;
  font-weight: 600;
  color: ${tokens.textMuted};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .5px;
  border-bottom: 2px solid ${tokens.border};
  white-space: nowrap;
  position: sticky;
  top: 0;
`;

const Td = styled.td`
  padding: 10px 14px;
  border-bottom: 1px solid ${tokens.border};
  color: ${tokens.text};

  tr:last-child & { border-bottom: none; }
`;

const TrStyled = styled.tr`
  transition: background .15s;
  &:hover { background: ${tokens.accentLight}; }
`;

const EmptyRow = styled.tr``;
const EmptyMsg = styled.td`
  text-align: center;
  padding: 40px;
  color: ${tokens.textMuted};
  font-size: 15px;
`;

// ─── SVG Icons (inline, no extra deps) ──────────────────────────────────────
const SearchSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ExportSVG = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

// ─── Backend URL ────────────────────────────────────────────────────────────
const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL;

// ─── Component ──────────────────────────────────────────────────────────────
export default function ERReport() {
  const today = new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate]     = useState(today);
  const [toDate, setToDate]         = useState(today);
  const [searchTerm, setSearchTerm] = useState("");

  const [summary, setSummary] = useState({ male: 0, female: 0, total: 0 });
  const [patients, setPatients] = useState([]);

  // ── Fetch (unchanged logic) ──────────────────────────────────────────────
  const fetchReport = async () => {
    try {
      const response = await apiRequest(
        `${ERbaseurl}er_report/`,
        "POST",
        { from_date: fromDate, to_date: toDate }
      );

      const res = response?.data || response;

      if (res?.success) {
        setSummary(res.summary);
        setPatients(res.patients);
      }
    } catch (error) {
      console.error("ER Report Error:", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // ── Client-side search filter ─────────────────────────────────────────────
  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;
    const q = searchTerm.trim().toLowerCase();
    return patients.filter(
      (p) =>
        (p.uhid && p.uhid.toString().toLowerCase().includes(q)) ||
        (p.billnumber && p.billnumber.toString().toLowerCase().includes(q)) ||
        (p.patientname && p.patientname.toLowerCase().includes(q))
    );
  }, [patients, searchTerm]);

  // ── Export to Excel ───────────────────────────────────────────────────────
  const handleExport = () => {
    const rows = filteredPatients.map((p) => ({
      Date: p.date,
      "Bill No": p.billnumber,
      UHID: p.uhid,
      "Patient Name": p.patientname,
      Gender: p.gender,
      Doctor: p.doctorname,
      "Total (₹)": p.total,
      "Net Amount (₹)": p.net_amount,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto-fit column widths
    const colWidths = Object.keys(rows[0] || {}).map((key) => ({
      wch: Math.max(key.length, ...rows.map((r) => String(r[key] ?? "").length), 10),
    }));
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ER Report");
    XLSX.writeFile(wb, `ER_Report_${fromDate}_to_${toDate}.xlsx`);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <PageContainer>
      <Card>
        <Title>ER Patient Report</Title>

        {/* Date Filters + Export Button — same row */}
        <TopRow>
          <DateGroup>
            <FormGroup>
              <Label>From Date</Label>
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>To Date</Label>
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </FormGroup>
            <FormGroup style={{ flex: "0 0 auto" }}>
              <Label>&nbsp;</Label>
              <Button onClick={fetchReport}>Search</Button>
            </FormGroup>
          </DateGroup>

          {/* Export sits at the right end of the same row */}
          <Button variant="export" onClick={handleExport} disabled={filteredPatients.length === 0}>
            <ExportSVG /> Export Excel
          </Button>
        </TopRow>

        {/* Search Box — UHID / Bill No / Patient Name */}
        <SearchRow>
          <Label style={{ marginBottom: 6, display: "block" }}>
            Search by UHID, Bill No or Patient Name
          </Label>
          <SearchWrapper>
            <SearchIcon><SearchSVG /></SearchIcon>
            <SearchInput
              type="text"
              placeholder="Type to search…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchWrapper>
        </SearchRow>

        {/* Summary */}
        <SectionTitle>Summary</SectionTitle>
        <SummaryRow>
          <SummaryCard color="#eef2ff" accent={tokens.accent}>
            <SummaryLabel accent={tokens.accent}>Male</SummaryLabel>
            <SummaryValue>{summary?.male}</SummaryValue>
          </SummaryCard>
          <SummaryCard color="#fdf2f8" accent="#ec4899">
            <SummaryLabel accent="#ec4899">Female</SummaryLabel>
            <SummaryValue>{summary?.female}</SummaryValue>
          </SummaryCard>
          <SummaryCard color="#ecfdf5" accent={tokens.success}>
            <SummaryLabel accent={tokens.success}>Total</SummaryLabel>
            <SummaryValue>{summary?.total}</SummaryValue>
          </SummaryCard>
        </SummaryRow>

        {/* Patient Details Table */}
        <SectionTitle>Patient Details</SectionTitle>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Bill No</Th>
                <Th>UHID</Th>
                <Th>Patient Name</Th>
                <Th>Gender</Th>
                <Th>Doctor</Th>
                <Th>Total (₹)</Th>
                <Th>Net Amount (₹)</Th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p, i) => (
                  <TrStyled key={i}>
                    <Td>{p.date}</Td>
                    <Td>{p.billnumber}</Td>
                    <Td>{p.uhid}</Td>
                    <Td>{p.patientname}</Td>
                    <Td>{p.gender}</Td>
                    <Td>{p.doctorname}</Td>
                    <Td>{p.total}</Td>
                    <Td>{p.net_amount}</Td>
                  </TrStyled>
                ))
              ) : (
                <EmptyRow>
                  <EmptyMsg colSpan="8">No Records Found</EmptyMsg>
                </EmptyRow>
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Card>
    </PageContainer>
  );
}