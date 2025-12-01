import { createGlobalStyle } from "styled-components";
import styled from "styled-components";

// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
    min-height: 100vh;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    text-align: center;
    margin-bottom: 20px;
    color: #2c3e50;
    font-weight: 600;
    padding-bottom: 10px;
    border-bottom: 2px solid rgba(192, 111, 162, 0.3);
  }

  input, textarea, select {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .required {
    color: #e74c3c;
  }
`;

// Page Container
export const PageContainer = styled.div`
  padding: 30px 20px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
`;

// Card Container
export const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  }
`;

// Title
export const Title = styled.h1`
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 700;
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  border-bottom: 3px solid rgba(192, 111, 162, 0.2);
  padding-bottom: 15px;
`;

// Section Title
export const SectionTitle = styled.h3`
  font-size: 1.3rem;
  color: #34495e;
  margin: 30px 0 20px;
  padding-left: 15px;
  border-left: 4px solid #C06FA2;
  text-align: left;
  font-weight: 600;
`;

// Form Grid (4 columns)
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// Form Group
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// Label
export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 4px;
  letter-spacing: 0.3px;
`;

// Input
export const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
  color: #2c3e50;

  &:focus {
    outline: none;
    border-color: #C06FA2;
    box-shadow: 0 0 0 3px rgba(192, 111, 162, 0.1);
  }

  &:hover {
    border-color: #b8b8b8;
  }

  &::placeholder {
    color: #95a5a6;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

// Select
export const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
  color: #2c3e50;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #C06FA2;
    box-shadow: 0 0 0 3px rgba(192, 111, 162, 0.1);
  }

  &:hover {
    border-color: #b8b8b8;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

// Primary Button
export const Button = styled.button`
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(192, 111, 162, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(192, 111, 162, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// Submit Button (Larger, More Prominent)
export const SubmitButton = styled(Button)`
  width: 20%;
  padding: 16px 32px;
  font-size: 1.1rem;
  margin-top: 30px;
background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);

  &:hover {
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  }
`;

// Danger Button
export const DangerButton = styled.button`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(239, 68, 68, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Table
export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 24px 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

// Table Header
export const Th = styled.th`
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  color: white;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  &:first-child {
    border-top-left-radius: 12px;
  }

  &:last-child {
    border-top-right-radius: 12px;
  }
`;

// Table Data
export const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #e8e8e8;
  color: #2c3e50;
  font-size: 0.95rem;
  text-align: left;

  tr:last-child & {
    border-bottom: none;
  }

  tr:hover & {
    background: #f8f9fa;
  }
`;

// Total Row
export const TotalRow = styled.tr`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-weight: 700;
  font-size: 1.1rem;
  
  ${Td} {
    color: #2c3e50;
    border-top: 2px solid #C06FA2;
    padding: 18px 16px;
  }
`;

// Discount Grid
export const DiscountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 24px 0;
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 2px solid #e0e0e0;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// Amount Display
export const AmountDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: #C06FA2;
    padding: 12px 16px;
    background: white;
    border-radius: 8px;
    text-align: center;
    border: 2px solid #C06FA2;
    box-shadow: 0 2px 8px rgba(192, 111, 162, 0.1);
  }
`;

// Toast Container
export const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 600px) {
    right: 10px;
    left: 10px;
    top: 10px;
  }
`;

// Toast
export const Toast = styled.div`
  padding: 16px 20px;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 400px;
  min-width: 300px;
  animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @keyframes slideIn {
    from { 
      transform: translateX(100%) scale(0.8); 
      opacity: 0; 
    }
    to { 
      transform: translateX(0) scale(1); 
      opacity: 1; 
    }
  }

  background: ${props => 
    props.type === 'success' 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : props.type === 'error'
      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      : 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
  };

  @media (max-width: 600px) {
    min-width: auto;
    width: 100%;
  }
`;

// Toast Icon
export const ToastIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  font-size: 16px;
  font-weight: bold;
  flex-shrink: 0;
`;

// Toast Message
export const ToastMessage = styled.span`
  font-size: 14px;
  line-height: 1.4;
  flex: 1;
`;

// Toast Close Button
export const ToastClose = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  font-size: 20px;
  font-weight: bold;
  line-height: 1;
  width: 28px;
  height: 28px;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: none;
  }

  &:active {
    transform: scale(0.95);
  }
`;

// ========== Account Summary Components ==========

// Header Section
export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

// Page Title
export const PageTitle = styled(Title)`
  font-size: 28px;
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  border-bottom: none;
`;

// Subtitle
export const Subtitle = styled.p`
  color: #718096;
  font-size: 14px;
  margin-top: 4px;
`;

// Filter Card
export const FilterCard = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
`;

// Filter Grid
export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  align-items: end;
`;

// Styled Input (variant)
export const StyledInput = styled(Input)`
  margin-bottom: 0;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #cbd5e0;
  }
  
  &:focus {
    border-color: #C06FA2;
    box-shadow: 0 0 0 3px rgba(192, 111, 162, 0.1);
  }
`;

// Clear Button
export const ClearButton = styled.button`
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #718096;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  height: fit-content;
  
  &:hover {
    border-color: #C06FA2;
    color: #C06FA2;
    background: rgba(192, 111, 162, 0.05);
    transform: none;
  }

  &:active {
    transform: scale(0.98);
  }
`;

// Stats Row
export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// Stat Card
export const StatCard = styled.div`
  background: ${props => props.gradient || 'linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%)'};
  padding: 20px 24px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

// Stat Value
export const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
`;

// Stat Label
export const StatLabel = styled.div`
  font-size: 13px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Table Card
export const TableCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

// Table Header
export const TableHeader = styled.div`
  padding: 20px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Table Title
export const TableTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  border-bottom: none;
  text-align: left;
`;

// Record Count
export const RecordCount = styled.span`
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
`;

// Table Wrapper
export const TableWrapper = styled.div`
  overflow-x: auto;
`;

// Styled Table (variant)
export const StyledTable = styled(Table)`
  margin: 0;
  border-radius: 0;
  box-shadow: none;
`;

// Styled Th (variant)
export const StyledTh = styled(Th)`
  padding: 14px 20px;
  font-size: 12px;
  white-space: nowrap;
`;

// Styled Td (variant)
export const StyledTd = styled(Td)`
  padding: 16px 20px;
  vertical-align: middle;
  
  tr:hover & {
    background: #f7fafc;
  }
`;

// Status Badge
export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  
  ${props => {
    switch (props.status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return `background: #d1fae5; color: #065f46;`;
      case 'pending':
        return `background: #fef3c7; color: #92400e;`;
      case 'cancelled':
      case 'failed':
        return `background: #fee2e2; color: #991b1b;`;
      default:
        return `background: #e2e8f0; color: #475569;`;
    }
  }}
`;

// Amount Cell
export const AmountCell = styled.span`
  font-weight: 600;
  color: #2d3748;
  font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace;
`;

// Discounted Amount
export const DiscountedAmount = styled(AmountCell)`
  color: #059669;
`;

// Empty State
export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #718096;
`;

// Empty Icon
export const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

// Empty Text
export const EmptyText = styled.p`
  font-size: 16px;
  margin: 0 0 8px;
  font-weight: 500;
`;

// Empty Subtext
export const EmptySubtext = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.7;
`;

// Loading Overlay
export const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
`;

// Spinner
export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #C06FA2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Patient Info
export const PatientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

// Patient Name
export const PatientName = styled.span`
  font-weight: 500;
  color: #2d3748;
`;

// UHID Tag
export const UhidTag = styled.span`
  font-size: 12px;
  color: #718096;
  font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace;
`;

export default GlobalStyle;