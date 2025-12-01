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

  const thisMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(thisMonth);
  const [day, setDay] = useState("");

  useEffect(() => {
    fetchSummary();
  }, [day, month]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      let query = "";

      if (day) query = `?day=${day}`;
      else if (month) query = `?month=${month}`;

      const result = await apiRequest(
        `${ERbaseurl}AccountSummary/${query}`,
        "GET"
      );

      if (result.success) {
        const processed = result.data.map((item) => ({
          ...item,
          procedures:
            typeof item.procedures === "string"
              ? JSON.parse(item.procedures)
              : item.procedures,
        }));

        setSummaryData(processed);
      } else {
        console.error("API Error:", result.error);
        showToast("Failed to fetch account summary", "error");
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
      showToast("Failed to fetch account summary", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const clearFilters = () => {
    setDay("");
    setMonth(thisMonth);
  };

  const calculateStats = () => {
    const totalRecords = summaryData.length;
    const totalAmount = summaryData.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    const totalDiscounted = summaryData.reduce((sum, item) => sum + (parseFloat(item.discounted_total) || 0), 0);
    const totalSavings = totalAmount - totalDiscounted;
    return { totalRecords, totalAmount, totalDiscounted, totalSavings };
  };

  const stats = calculateStats();
  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
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

      <HeaderSection>
        <div>
          <PageTitle>Account Summary</PageTitle>
          <Subtitle>View and manage billed records</Subtitle>
        </div>
      </HeaderSection>

      <FilterCard>
        <FilterGrid>
          <FormGroup>
            <Label>Filter by Day</Label>
            <StyledInput
              type="date"
              value={day}
              onChange={(e) => {
                setDay(e.target.value);
                if (e.target.value) setMonth("");
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Filter by Month</Label>
            <StyledInput
              type="month"
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                if (e.target.value) setDay("");
              }}
            />
          </FormGroup>
          <ClearButton onClick={clearFilters}>Clear Filters</ClearButton>
        </FilterGrid>
      </FilterCard>

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
          <StatLabel>Discounted Total</StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
          <StatValue>{formatCurrency(stats.totalSavings)}</StatValue>
          <StatLabel>Total Savings</StatLabel>
        </StatCard>
      </StatsRow>

      <TableCard>
        <TableHeader>
          <TableTitle>Billing Records</TableTitle>
          <RecordCount>{stats.totalRecords} records</RecordCount>
        </TableHeader>
        <TableWrapper>
          {loading ? (
            <LoadingOverlay><Spinner /></LoadingOverlay>
          ) : summaryData.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📋</EmptyIcon>
              <EmptyText>No records found</EmptyText>
              <EmptySubtext>Try adjusting your filters</EmptySubtext>
            </EmptyState>
          ) : (
            <StyledTable>
              <thead>
                <tr>
                  <StyledTh>Patient</StyledTh>
                  <StyledTh>Doctor</StyledTh>
                  <StyledTh>Date</StyledTh>
                  <StyledTh>Total</StyledTh>
                  <StyledTh>Discounted</StyledTh>
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
                    <StyledTd><AmountCell>{formatCurrency(item.total)}</AmountCell></StyledTd>
                    <StyledTd><DiscountedAmount>{formatCurrency(item.discounted_total)}</DiscountedAmount></StyledTd>
                    <StyledTd><StatusBadge status={item.billing_status}>{item.billing_status}</StatusBadge></StyledTd>
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