// src/Pages/pharmacy.js

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
  Table,
  Th,
  Td,
  SectionTitle,
} from "../Styles/globalStyles";
import apiRequest from "./apiRequest";

const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL;

// Additional styled components for enhanced UI
const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const PageTitle = styled(Title)`
  font-size: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const StatsBar = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const StatBadge = styled.div`
  background: ${props => props.variant === 'pending' 
    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FiltersCard = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
`;

const SearchInput = styled(Input)`
  padding-left: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PatientCard = styled(Card)`
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e2e8f0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.status === 'Billed' 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
      : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
`;

const PatientInfo = styled.div`
  flex: 1;
`;

const PatientName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 4px 0;
`;

const UHID = styled.span`
  font-size: 13px;
  color: #667eea;
  font-weight: 600;
  background: rgba(102, 126, 234, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.status === 'Billed' 
    ? 'rgba(16, 185, 129, 0.1)' 
    : 'rgba(245, 158, 11, 0.1)'};
  color: ${props => props.status === 'Billed' ? '#059669' : '#d97706'};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px dashed #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  color: #64748b;
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: #1a202c;
  font-weight: 600;
`;

const ProceduresList = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  margin: 12px 0;
`;

const ProcedureItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
  color: #475569;

  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }
`;

const TotalSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 16px -20px -20px -20px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalAmount = styled.div`
  color: white;

  .label {
    font-size: 12px;
    opacity: 0.9;
  }

  .amount {
    font-size: 24px;
    font-weight: 700;
  }

  .original {
    font-size: 14px;
    text-decoration: line-through;
    opacity: 0.7;
  }
`;

const BillButton = styled(Button)`
  background: white;
  color: #667eea;
  font-weight: 600;
  padding: 10px 20px;

  &:hover {
    background: #f8fafc;
    transform: scale(1.02);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
  }
`;

const BilledText = styled.span`
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding: 20px;
`;

const PageButton = styled.button`
  padding: 10px 20px;
  border: 2px solid ${props => props.active ? '#667eea' : '#e2e8f0'};
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #667eea;
    color: ${props => props.active ? 'white' : '#667eea'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;

  svg {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  h3 {
    font-size: 18px;
    color: #1a202c;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
  }
`;

export default function Pharmacy() {
  const [billingData, setBillingData] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    fetchBilling(date);
  }, [date]);

  const fetchBilling = async (selectedDate) => {
    try {
const result = await apiRequest(`${ERbaseurl}Pharmacy/`, "GET", {
  params: { date: selectedDate },
});

      const processed = result.data.map((item) => ({
        ...item,
        procedures:
          typeof item.procedures === "string"
            ? JSON.parse(item.procedures)
            : item.procedures,
      }));
      setBillingData(processed);
    } catch (err) {
      console.error("Error fetching billing:", err);
    }
  };

const markAsBilled = async (uhid) => {
  try {
    const encoded = encodeURIComponent(uhid);
    // Using apiRequest instead of axios directly
    await apiRequest(`${ERbaseurl}update-status/${encoded}/`, "PUT");
    
    // Update local state
    setBillingData((prev) =>
      prev.map((item) =>
        item.uhid === uhid ? { ...item, billing_status: "Paid" } : item
      )
    );
  } catch (err) {
    console.error("Error updating status:", err);
  }
};


  const filteredData = useMemo(() => {
    let data = [...billingData];
    if (search.trim() !== "") {
      data = data.filter(
        (item) =>
          item.uhid?.toLowerCase().includes(search.toLowerCase()) ||
          item.patientname?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (doctorFilter !== "") {
      data = data.filter((item) => item.doctorname === doctorFilter);
    }
    if (sortBy === "name") {
      data.sort((a, b) => a.patientname.localeCompare(b.patientname));
    } else if (sortBy === "uhid") {
      data.sort((a, b) => a.uhid.localeCompare(b.uhid));
    } else if (sortBy === "billno") {
      data.sort((a, b) => a.billnumber.localeCompare(b.billnumber));
    }
    return data;
  }, [billingData, search, doctorFilter, sortBy]);

  const totalPages = Math.ceil(filteredData.length / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + perPage);

  const pendingCount = billingData.filter(b => b.billing_status === "Billed").length;
  const billedCount = billingData.filter(b => b.billing_status === "Paid").length;

  return (
    <PageContainer>
      <HeaderSection>
        <PageTitle>ER Billing Records</PageTitle>
        <StatsBar>
          <StatBadge variant="Billed">
            <span>⏳</span> {pendingCount} Pending
          </StatBadge>
          <StatBadge variant="Paid">
            <span>✓</span> {billedCount} Billed
          </StatBadge>
        </StatsBar>
      </HeaderSection>

      <FiltersCard>
        <SectionTitle style={{ marginTop: 0 }}>Filters & Search</SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>Select Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => {
                setPage(1);
                setDate(e.target.value);
              }}
            />
          </FormGroup>

          <FormGroup>
            <Label>Search Patient</Label>
            <SearchInput
              type="text"
              value={search}
              placeholder="Search by UHID or Name..."
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </FormGroup>

          <FormGroup>
            <Label>Filter by Doctor</Label>
            <Select
              value={doctorFilter}
              onChange={(e) => {
                setPage(1);
                setDoctorFilter(e.target.value);
              }}
            >
              <option value="">All Doctors</option>
              {[...new Set(billingData.map((b) => b.doctorname))].map(
                (doc, index) => (
                  <option key={index} value={doc}>{doc}</option>
                )
              )}
            </Select>
          </FormGroup>

          {/* <FormGroup>
            <Label>Sort By</Label>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Default</option>
              <option value="name">Patient Name</option>
              <option value="uhid">UHID</option>
              <option value="billno">Bill Number</option>
            </Select>
          </FormGroup> */}
        </FormGrid>
      </FiltersCard>

      {paginatedData.length === 0 ? (
        <EmptyState>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3>No Records Found</h3>
          <p>Try adjusting your filters or selecting a different date.</p>
        </EmptyState>
      ) : (
        <CardsGrid>
          {paginatedData.map((bill) => (
            <PatientCard key={bill._id} status={bill.billing_status}>
              <CardHeader>
                <PatientInfo>
                  <PatientName>{bill.patientname}</PatientName>
                  <UHID>{bill.uhid}</UHID>
                </PatientInfo>
                <StatusBadge status={bill.billing_status}>
                  {bill.billing_status}
                </StatusBadge>
              </CardHeader>

              <InfoRow>
                <InfoLabel>Age / Gender</InfoLabel>
                <InfoValue>{bill.age} / {bill.gender}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{bill.phonenumber}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Bill No</InfoLabel>
                <InfoValue>{bill.billnumber}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Doctor</InfoLabel>
                <InfoValue>{bill.doctorname}</InfoValue>
              </InfoRow>

              <ProceduresList>
                <Label style={{ marginBottom: '8px', fontSize: '13px' }}>
                  Procedures ({bill.procedures.length})
                </Label>
                {bill.procedures.map((p, idx) => (
                  <ProcedureItem key={idx}>
                    <span>{p.procedure_name}</span>
                    <span>₹{p.rate}</span>
                  </ProcedureItem>
                ))}
              </ProceduresList>

              <TotalSection>
                <TotalAmount>
                  <div className="label">Total Amount</div>
                  <div className="amount">₹{bill.discounted_total}</div>
                  {bill.total !== bill.discounted_total && (
                    <div className="original">₹{bill.total}</div>
                  )}
                </TotalAmount>
                {bill.billing_status === "Billed" ? (
                  <BillButton onClick={() => markAsBilled(bill.uhid)}>
                    Mark as Billed
                  </BillButton>
                ) : (
                  <BilledText>✓ Completed</BilledText>
                )}
              </TotalSection>
            </PatientCard>
          ))}
        </CardsGrid>
      )}

      {totalPages > 1 && (
        <PaginationContainer>
          <PageButton
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Previous
          </PageButton>
          <PageInfo>
            Page {page} of {totalPages} ({filteredData.length} records)
          </PageInfo>
          <PageButton
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </PageButton>
        </PaginationContainer>
      )}
    </PageContainer>
  );
}