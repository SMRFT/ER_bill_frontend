import React, { useState, useEffect } from "react";
import styled from "styled-components";
import apiRequest from "./apiRequest";

const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL;

/* ===================== STYLES ===================== */

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  margin-bottom: 24px;
`;

const FilterSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3748;
  background: white;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #C06FA2;
    box-shadow: 0 0 0 3px rgba(192, 111, 162, 0.1);
  }

  &:hover {
    border-color: #cbd5e0;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3748;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #C06FA2;
    box-shadow: 0 0 0 3px rgba(192, 111, 162, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const SearchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Button = styled.button`
  padding: 12px 32px;
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(192, 111, 162, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(192, 111, 162, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Message = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #fff5f5;
  border-left: 4px solid #fc8181;
  border-radius: 8px;
  color: #c53030;
  font-weight: 500;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;

  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.875rem;
    letter-spacing: 0.5px;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  tbody tr {
    transition: all 0.2s ease;

    &:hover {
      background: #f7fafc;
      transform: scale(1.001);
    }

    &:last-child td {
      border-bottom: none;
    }
  }

  td {
    color: #2d3748;
    font-size: 0.9rem;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => props.status === 'paid' ? `
    background: #c6f6d5;
    color: #22543d;
  ` : `
    background: #fed7d7;
    color: #742a2a;
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #718096;
  
  svg {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 8px;
    color: #4a5568;
  }
  
  p {
    font-size: 0.95rem;
  }
`;

/* ===================== HELPERS ===================== */

const today = new Date().toISOString().split("T")[0];

const formatPaymentMode = (payment_mode) => {
  if (!payment_mode) return "-";

  try {
    const modes = JSON.parse(payment_mode);
    return modes
      .map(m => `${m.method.toUpperCase()} - ₹${m.amount}`)
      .join(", ");
  } catch {
    return "-";
  }
};

/* ===================== COMPONENT ===================== */

const ViewBills = () => {
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [searchBy, setSearchBy] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");

  /* ===================== API CALL ===================== */

  useEffect(() => {
    console.log("ROWS:", rows);
  }, [rows]);

  const fetchBills = async (applySearch = false) => {
    setMessage("");

    const payload = {
      from_date: fromDate,
      to_date: toDate,
      search_by: applySearch ? searchBy : "",
      search_value: applySearch ? searchValue : ""
    };

    try {
      const response = await apiRequest(
        `${ERbaseurl}View_bills_report/`,
        "POST",
        payload
      );

      console.log("API Response:", response);

      const data = response?.data || response;

      if (data?.message) {
        setRows([]);
        setMessage(data.message);
      } else if (Array.isArray(data)) {
        setRows(data);
      } else {
        setRows([]);
        setMessage("Unexpected response format");
      }
    } catch (error) {
      console.error("API Error:", error);
      setRows([]);
      setMessage(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong"
      );
    }
  };

  /* ===================== AUTO LOAD & DATE CHANGE ===================== */

  useEffect(() => {
    if (fromDate && toDate) {
      fetchBills(false);
    }
  }, [fromDate, toDate]);

  /* ===================== RENDER ===================== */

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <h1>📋 Bills Report</h1>
        </Header>

        <Card>
          {/* DATE FILTERS */}
          <FilterSection>
            <InputGroup>
              <Label>From Date</Label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <Label>To Date</Label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </InputGroup>
          </FilterSection>

          {/* SEARCH CONTROLS */}
          <SearchRow>
            <InputGroup>
              <Label>Search By</Label>
              <Select
                value={searchBy}
                onChange={(e) => {
                  setSearchBy(e.target.value);
                  setSearchValue("");
                }}
              >
                <option value="">Select Filter</option>
                <option value="uhid">UHID</option>
                <option value="patientname">Patient Name</option>
                <option value="status">Status</option>
                <option value="paymentmode">Payment Mode</option>
              </Select>
            </InputGroup>

            <InputGroup>
              <Label>Search Value</Label>
              {(searchBy === "uhid" || searchBy === "patientname") && (
                <Input
                  placeholder="Enter value"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              )}

              {searchBy === "status" && (
                <Select value={searchValue} onChange={(e) => setSearchValue(e.target.value)}>
                  <option value="">Select Status</option>
                  <option value="Billed">Billed</option>
                  <option value="paid">Paid</option>
                </Select>
              )}

              {searchBy === "paymentmode" && (
                <Select value={searchValue} onChange={(e) => setSearchValue(e.target.value)}>
                  <option value="">Select Mode</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                </Select>
              )}

              {!searchBy && <Input disabled placeholder="Select a filter first" />}
            </InputGroup>

            <Button onClick={() => fetchBills(true)}>🔍 Search</Button>
          </SearchRow>

          {message && <Message>{message}</Message>}
        </Card>

        {/* RESULT TABLE */}
        {rows.length > 0 ? (
          <Card>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Bill Date</th>
                    <th>Bill Time</th>
                    <th>Patient Name</th>
                    <th>UHID No</th>
                    <th>Payment Mode</th>
                    <th>Status</th>
                    <th>Bill Number</th>
                    <th>Total Amount</th>
                    <th>Shift No</th>
                    <th>Billed By</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td>{row.bill_date}</td>
                      <td>{row.bill_time}</td>
                      <td>{row.patientname}</td>
                      <td>{row.uhid}</td>
                      <td>{formatPaymentMode(row.payment_mode)}</td>
                      <td>
                        <StatusBadge status={row.status?.toLowerCase()}>
                          {row.status}
                        </StatusBadge>
                      </td>
                      <td>{row.billnumber}</td>
                      <td>₹{row.total}</td>
                      <td>{row.shiftno}</td>
                      <td>{row.billed_by}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </Card>
        ) : !message && (
          <Card>
            <EmptyState>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3>No Bills Found</h3>
              <p>Try adjusting your date range or search filters</p>
            </EmptyState>
          </Card>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default ViewBills;