import React, { useEffect, useState } from "react";
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

export default function PrintBill() {
  const [date, setDate] = useState(new Date());
  const [billingData, setBillingData] = useState([]);

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


  const printBill = (data) => {

    const formatDateTimeUTC = (isoString) => {
      if (!isoString) return "NIL"
      const dateObj = new Date(isoString)
      const formatted = dateObj.toLocaleString("en-IN", {
        year: "numeric",
        month: "numeric",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Kolkata",
        hour12: true,
      });
      return formatted.replace(/am|pm/gi, (match) => match.toUpperCase());
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup blocked! Allow popups to print.");
      return;
    }

    const procedureRows = data.procedures
      .map(
        (item, index) => `
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin: 2px 0;">
          <div style="width: 10%; text-align: center;">${index + 1}</div>
          <div style="width: 60%; padding-left: 5px;">${item.procedure_name}</div>
          <div style="width: 30%; text-align: right;">₹${Number(item.rate).toFixed(2)}</div>
        </div>`
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>ER Bill - ${data.billnumber}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 14px;
              padding: 10px;
              width: 80mm;
              color: #000;
            }
            .center { text-align: center; }
            .line { border-top: 1px solid #000; margin: 8px 0; }
            .header-title { font-weight: bold; font-size: 16px; margin-bottom: 4px; }
            
            .info-table {
              display: grid;
              grid-template-columns: 35% 5% 60%;
              margin-top: 5px;
              font-size: 13px;
            }
            .info-label { font-weight: 600; text-align: left; }
            .info-colon { text-align: center; }
            .info-value { text-align: right; word-break: break-word; }

            .procedure-header {
              display: flex;
              font-weight: bold;
              border-bottom: 1px solid #000;
              padding-bottom: 4px;
              margin-bottom: 4px;
              font-size: 13px;
            }
            .procedure-header div:nth-child(1) { width: 10%; text-align: center; }
            .procedure-header div:nth-child(2) { width: 60%; }
            .procedure-header div:nth-child(3) { width: 30%; text-align: right; }

            .totals {
              font-weight: bold;
              display: flex;
              justify-content: flex-end;
              margin-top: 6px;
              font-size: 14px;
            }
            .totals div { width: 40%; text-align: right; }
          </style>
        </head>

        <body>
          <div class="center">
            <div class="header-title">SHANMUGA HOSPITAL LIMITED</div>
            <div style="font-size: 12px;">51/24, Saradha College Road, Salem - 636007</div>
            <div style="font-size: 12px;">CIN: L85110TZ2020PLC033974</div>
          </div>

          <div class="line"></div>

          <div class="center" style="font-weight: bold; font-size: 15px;">ER CASH BILL</div>

          <div class="line"></div>

          <div class="info-table">
            <div class="info-label">Bill No</div><div class="info-colon">:</div><div class="info-value">${data.billnumber}</div>
            <div class="info-label">UHID</div><div class="info-colon">:</div><div class="info-value">${data.uhid}</div>
           <div class="info-label">Date</div>
              <div class="info-colon">:</div>
              <div class="info-value">${formatDateTimeUTC(data.date) || "NIL"}</div>

            <div class="info-label">Patient</div><div class="info-colon">:</div><div class="info-value">${data.patientname}</div>
            <div class="info-label">Doctor</div><div class="info-colon">:</div><div class="info-value">${data.doctorname}</div>
          </div>

          <div class="line"></div>

          <div class="procedure-header">
            <div>#</div>
            <div>Description</div>
            <div>Amt (₹)</div>
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

          <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px;">
            <div>Cashier</div>
            <div>Authorized Signatory</div>
          </div>

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
        {billingData.length > 0 && (
          <RecordCount>
            Found <strong>{billingData.length}</strong> records
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
            {billingData.length === 0 ? (
              <tr>
                <Td colSpan="6">
                  <EmptyState>
                    <EmptyIcon>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="64" height="64" style={{opacity: 0.4, color: '#C06FA2'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </EmptyIcon>
                    <EmptyText>No Billed Patients Found</EmptyText>
                    <EmptySubtext>There are no billing records for the selected date.</EmptySubtext>
                  </EmptyState>
                </Td>
              </tr>
            ) : (
              billingData.map((item) => (
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