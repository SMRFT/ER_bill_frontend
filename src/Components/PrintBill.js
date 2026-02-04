import React, { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiRequest from "./apiRequest";
import {
  PageContainer,
  Card,
  Title,
  Table,
  Th,
  Td,
  Button,
  EmptyState,
  EmptyIcon,
  EmptyText,
  EmptySubtext,
} from "../Styles/globalStyles";
import styled from "styled-components";

const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL;

// Custom styled components for PrintBill-specific needs
const Header = styled.div`
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(192, 111, 162, 0.2);
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeaderTitle = styled.h2`
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  font-size: 24px;
  letter-spacing: 0.5px;
`;

const Subtitle = styled.div`
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-weight: 500;
`;

const DateFilterCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  flex-wrap: wrap;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #1A202C;
  margin: 0;
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: auto;
    
    input {
      padding: 10px 16px;
      border-radius: 6px;
      border: 2px solid #e0e0e0;
      font-size: 14px;
      transition: all 0.2s;
      cursor: pointer;
      min-width: 200px;
      color: #1A202C;
      background: #FFFFFF;

      &:focus {
        outline: none;
        border-color: #C06FA2;
        box-shadow: 0 0 0 3px rgba(192, 111, 162, 0.2);
      }

      &:hover {
        border-color: #b8b8b8;
      }
    }
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 8px;
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
  font-size: 14px;
  transition: all 0.2s;
  min-width: 220px;
  color: #1A202C;
  background: #FFFFFF;
  outline: none;

  &:focus {
    border-color: #C06FA2;
    box-shadow: 0 0 0 3px rgba(192, 111, 162, 0.2);
  }

  &:hover {
    border-color: #b8b8b8;
  }

  &::placeholder {
    color: #A0AEC0;
  }
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: linear-gradient(135deg, #b05a8f 0%, #8a3f6d 100%);
    box-shadow: 0 2px 8px rgba(192, 111, 162, 0.35);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const ClearButton = styled.button`
  padding: 10px 14px;
  background: #F0F0F0;
  color: #718096;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: #E2E8F0;
    border-color: #CBD5E0;
    color: #4A5568;
  }
`;

const TableContainer = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #E2E8F0;
`;

const Tr = styled.tr`
  transition: all 0.2s;
  
  &:hover {
    background: #F4F7FA;
  }
`;

const PrintButton = styled(Button)`
  padding: 8px 16px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Badge = styled.span`
  background: #E6F0FF;
  color: #C06FA2;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  display: inline-block;
  border: 1px solid rgba(192, 111, 162, 0.1);
`;

const TotalAmount = styled.span`
  font-weight: 700;
  color: #1A202C;
  font-size: 15px;
`;

const RecordCount = styled.div`
  margin-left: auto;
  color: #718096;
  font-size: 14px;
  font-weight: 500;
  
  strong {
    color: #C06FA2;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 40px;
  background: #E2E8F0;
  align-self: center;
`;

export default function PrintBill() {
  const [date, setDate] = useState(new Date());
  const [billingData, setBillingData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  useEffect(() => {
    fetchBilledPatients();
  }, [date]);

  const fetchBilledPatients = async () => {
    try {
      const formattedDate = date.toISOString().split("T")[0];

      const result = await apiRequest(
        `${ERbaseurl}printbill/?date=${formattedDate}`,
        "GET"
      );

      if (result.success) {
        const billed = (result.data || []).filter(
          (item) => ["Billed", "paid"].includes(item.billing_status)
        );

        setBillingData(billed);
      } else {
        console.error("Failed to fetch billing data:", result.error);
      }
    } catch (err) {
      console.error("Error fetching billing data:", err);
    }
  };

  // Filter billing data based on the applied search term
  const filteredData = useMemo(() => {
    if (!appliedSearch.trim()) return billingData;

    const term = appliedSearch.trim().toLowerCase();

    return billingData.filter((item) => {
      const uhid = (item.uhid || "").toLowerCase();
      const name = (item.patientname || "").toLowerCase();
      const bill = (item.billnumber || "").toLowerCase();

      return uhid.includes(term) || name.includes(term) || bill.includes(term);
    });
  }, [billingData, appliedSearch]);

  const handleSearch = () => {
    setAppliedSearch(searchValue);
  };

  const handleClear = () => {
    setSearchValue("");
    setAppliedSearch("");
  };

  // Allow pressing Enter to trigger search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "";

    const dt = new Date(value);

    return dt.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const printBill = (data) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup blocked! Allow popups to print.");
      return;
    }

    const procedures = Array.isArray(data.procedures)
      ? data.procedures
      : JSON.parse(data.procedures || "[]");

    const billDateTime = formatDateTime(data.date);

    const procedureRows = procedures
      .map(
        (item, index) => `
        <div class="procedure-row">
          <div class="col-sl">${index + 1}</div>
          <div class="col-desc">${item.procedure_name}</div>
          <div class="col-qty">${item.unit}</div>
          <div class="col-rate">₹${Number(item.rate).toFixed(2)}</div>
          <div class="col-amt">₹${Number(item.total).toFixed(2)}</div>
        </div>`
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>ER Bill - ${data.billnumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 14px;
              padding: 10px;
              width: 80mm;
            }
            .center { text-align: center; }
            .line { border-top: 1px solid #000; margin: 8px 0; }
            .header-title { font-weight: bold; font-size: 16px; }

            .info-table {
              display: grid;
              grid-template-columns: 40% 5% 55%;
              margin-top: 5px;
              font-size: 14px;
            }
            .info-label { font-weight: bold; text-align: left; }
            .info-colon { text-align: center; }
            .info-value {
                text-align: left;
              }

            .procedure-header,
            .procedure-row {
              display: flex;
              font-size: 13px;
            }

            .col-sl {
              width: 8%;
              text-align: center;
            }

            .col-desc {
              width: 42%;
              padding-left: 4px;
            }

            .col-qty {
              width: 10%;
              text-align: center;
            }

            .col-rate {
              width: 20%;
              text-align: right;
            }

            .col-amt {
              width: 20%;
              text-align: right;
            }

            .procedure-header {
              font-weight: bold;
              border-bottom: 1px solid #000;
              padding-bottom: 4px;
              margin-bottom: 4px;
            }

            .totals {
              font-weight: bold;
              display: flex;
              justify-content: flex-end;
              margin-top: 6px;
            }
            .totals div { width: 30%; text-align: right; }
          </style>
        </head>

        <body>
          <div class="center">
            <div class="header-title">SHANMUGA HOSPITAL LIMITED</div>
            <div>51/24, Saradha College Road, Salem - 636007</div>
            <div>CIN: L85110TZ2020PLC033974</div>
            <div>GST: 33ABDCS8326A1ZP</div>
          </div>

          <div class="line"></div>

          <div class="center" style="font-weight: bold;">Cash Bill - <u>ER BILL (SH)</u></div>

          <div class="line"></div>

          <div class="info-table">
            <div class="info-label">Bill Number</div><div class="info-colon">:</div><div class="info-value">${data.billnumber}</div>
            <div class="info-label">OP Number</div><div class="info-colon">:</div><div class="info-value">${data.uhid}</div>
            <div class="info-label">Bill Date</div><div class="info-colon">:</div><div class="info-value">${billDateTime}</div>
            <div class="info-label">Name</div><div class="info-colon">:</div><div class="info-value">${data.patientname}</div>
            <div class="info-label">Age</div><div class="info-colon">:</div><div class="info-value">${data.age}</div>
            <div class="info-label">Doctor</div><div class="info-colon">:</div><div class="info-value">${data.doctorname}</div>
          </div>

          <div class="line"></div>

          <div class="procedure-header">
            <div class="col-sl">Sl</div>
            <div class="col-desc">Description</div>
            <div class="col-qty">Qty</div>
            <div class="col-rate">Rate</div>
            <div class="col-amt">Amount</div>
          </div>

          ${procedureRows}

          <div class="line"></div>

          <div class="totals">
            <div>Total:</div><div>₹${data.total.toFixed(2)}</div>
          </div>

          <div class="totals">
            <div>Discount:</div><div>₹${data.discount_amount.toFixed(2)}</div>
          </div>

          <div class="totals">
            <div>Net Amount:</div><div>₹${data.net_amount.toFixed(2)}</div>
          </div>

          <div class="line"></div>

          <div style="margin-top: 30px;">Signature: ___________________</div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <PageContainer>
      <Header>
        <HeaderTitle>🏥 ER Billed Patients</HeaderTitle>
        <Subtitle>
          View and print emergency room billing records
        </Subtitle>
      </Header>

      <DateFilterCard>
        <Label>📅 Select Date:</Label>
        <DatePickerWrapper>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            dateFormat="yyyy-MM-dd"
          />
        </DatePickerWrapper>

        <Divider />

        <Label>🔍 Search:</Label>
        <SearchWrapper>
          <SearchInput
            type="text"
            placeholder="UHID / Patient Name / Bill No."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SearchButton onClick={handleSearch}>
            <span>🔍</span> Search
          </SearchButton>
          {appliedSearch && (
            <ClearButton onClick={handleClear}>
              ✕ Clear
            </ClearButton>
          )}
        </SearchWrapper>

        {filteredData.length > 0 && (
          <RecordCount>
            Found <strong>{filteredData.length}</strong> records
          </RecordCount>
        )}
      </DateFilterCard>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>UHID</Th>
              <Th>Patient Name</Th>
              <Th>Doctor</Th>
              <Th>Bill Number</Th>
              <Th>Total Amount</Th>
              <Th>Action</Th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <Td colSpan="6">
                  <EmptyState>
                    <EmptyIcon>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="64" height="64" style={{opacity: 0.4, color: '#C06FA2'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </EmptyIcon>
                    <EmptyText>
                      {appliedSearch ? "No Matching Records Found" : "No Billed Patients Found"}
                    </EmptyText>
                    <EmptySubtext>
                      {appliedSearch
                        ? `No results match "${appliedSearch}". Try a different search or clear the filter.`
                        : "There are no billing records for the selected date."}
                    </EmptySubtext>
                  </EmptyState>
                </Td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <Tr key={item._id}>
                  <Td><strong>{item.uhid}</strong></Td>
                  <Td>{item.patientname}</Td>
                  <Td>{item.doctorname}</Td>
                  <Td><Badge>{item.billnumber}</Badge></Td>
                  <Td><TotalAmount>₹{Number(item.net_amount).toFixed(2)}</TotalAmount></Td>
                  <Td>
                    <PrintButton onClick={() => printBill(item)}>
                      <span>🖨️</span> Print Bill
                    </PrintButton>
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
}