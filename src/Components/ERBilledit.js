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

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background: #f7fafc;
    color: #4a5568;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: #C06FA2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #9B4F7E;
    transform: translateY(-1px);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 8px;
  }

  input, select {
    width: 80%;
    padding: 12px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #C06FA2;
    }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const SaveButton = styled.button`
  flex: 1;
  padding: 14px;
  background: #4a9f6f;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #3d8a5f; }
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 14px;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #c53030; }
`;

const FilterSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  align-items: flex-end;
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 16px;
  }
`;

const SearchButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #C06FA2 0%, #9B4F7E 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  height: 48px;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(192, 111, 162, 0.2);

  &:hover {
    background: linear-gradient(135deg, #9B4F7E 0%, #7A3B63 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(192, 111, 162, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const CancelButton = styled.button`
flex: 1;
padding: 14px;
background: #e2e8f0;
color: #4a5568;
border: none;
border - radius: 8px;
font - weight: 700;
cursor: pointer;
transition: all 0.2s;

  &:hover { background: #cbd5e0; }
`;

/* ===================== COMPONENT ===================== */

const ERBilledit = () => {
    const today = new Date().toISOString().split("T")[0];
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [searchBy, setSearchBy] = useState("uhid");
    const [searchValue, setSearchValue] = useState("");
    const [bills, setBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [discountType, setDiscountType] = useState("amount");
    const [discountValue, setDiscountValue] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [netAmount, setNetAmount] = useState(0);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async (fDate = fromDate, tDate = toDate, sBy = searchBy, sValue = searchValue) => {
        console.log("Fetching bills with payload:", { from_date: fDate, to_date: tDate, search_by: sBy, search_value: sValue });
        try {
            const response = await apiRequest(`${ERbaseurl}View_bills_discount_report/`, "POST", {
                from_date: fDate,
                to_date: tDate,
                search_by: sBy,
                search_value: sValue
            });

            const data = response?.data || response;
            if (Array.isArray(data)) {
                setBills(data);
            } else {
                setBills([]);
            }
        } catch (err) {
            console.error("Error fetching bills:", err);
            setBills([]);
        }
    };

    const handleEditClick = async (bill) => {
        try {
            const response = await apiRequest(`${ERbaseurl}get_billing_for_discount/?billnumber=${bill.billnumber}`, "GET");
            if (response.success) {
                const data = response.data;
                setSelectedBill(data);

                // Normalize discount type: default to "amount" if empty or unrecognized
                const normalizedType = (data.discount_type === "%" || data.discount_type === "amount")
                    ? data.discount_type
                    : "amount";

                setDiscountType(normalizedType);
                setDiscountValue(data.discount_value || 0);
                setDiscountAmount(data.discount_amount || 0);
                setNetAmount(data.net_amount || data.total);
                setShowModal(true);
            } else {
                alert(response.error || "Failed to fetch bill details");
            }
        } catch (err) {
            console.error("Error fetching bill details:", err);
            alert("Failed to fetch bill details");
        }
    };

    // Recalculate Logic
    useEffect(() => {
        if (!selectedBill) return;

        const total = parseFloat(selectedBill.total) || 0;
        let val = parseFloat(discountValue) || 0;
        let amt = 0;

        console.log("Recalculating with:", { discountType, discountValue, total });

        if (discountType === "%") {
            amt = (total * val) / 100;
        } else if (discountType === "amount") {
            amt = val;
        }

        console.log("Calculated amount:", amt);

        setDiscountAmount(amt);
        setNetAmount(total - amt);
    }, [discountType, discountValue, selectedBill]);

    const handleSave = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const payload = {
                billnumber: selectedBill.billnumber,
                discount_type: discountType,
                discount_value: discountValue,
                discount_amount: discountAmount,
                net_amount: netAmount
            };

            const response = await apiRequest(`${ERbaseurl}update_billing_discount/`, "POST", payload);
            if (response.success) {
                alert("Bill updated successfully!");
                setShowModal(false);
                fetchBills();
            } else {
                alert(response.error || "Update failed");
            }
        } catch (err) {
            console.error("Error updating bill:", err);
            alert("Update failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this bill? This action cannot be undone.")) return;

        if (loading) return;
        setLoading(true);

        try {
            const response = await apiRequest(`${ERbaseurl}soft_delete_billing/`, "POST", {
                billnumber: selectedBill.billnumber
            });

            if (response.success) {
                alert("Bill deleted successfully!");
                setShowModal(false);
                fetchBills();
            } else {
                alert(response.error || "Delete failed");
            }
        } catch (err) {
            console.error("Error deleting bill:", err);
            alert("Delete failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <ContentWrapper>
                <Header>
                    <h1>🧾 Bill Edit & Discount</h1>
                </Header>

                <Card>
                    <FilterSection>
                        <FormGroup style={{ marginBottom: 0 }}>
                            <label>From Date</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup style={{ marginBottom: 0 }}>
                            <label>To Date</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup style={{ marginBottom: 0 }}>
                            <label>Search By</label>
                            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                                <option value="uhid">UHID</option>
                                <option value="patientname">Patient Name</option>
                            </select>
                        </FormGroup>
                        <FormGroup style={{ marginBottom: 0 }}>
                            <label>Search Value</label>
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Enter UHID or Name..."
                            />
                        </FormGroup>
                        <SearchButton onClick={() => fetchBills(fromDate, toDate, searchBy, searchValue)}>
                            🔍 Search
                        </SearchButton>
                    </FilterSection>

                    <TableWrapper>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Bill Number</th>
                                    <th>Patient Name</th>
                                    <th>UHID</th>
                                    <th>Total</th>
                                    <th>Net Amount</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map((bill) => (
                                    <tr key={bill.billnumber}>
                                        <td>{bill.billnumber}</td>
                                        <td>{bill.patientname}</td>
                                        <td>{bill.uhid}</td>
                                        <td>₹{bill.total}</td>
                                        <td>₹{bill.net_amount || bill.total}</td>
                                        <td>{bill.status}</td>
                                        <td>
                                            <ActionButton onClick={() => handleEditClick(bill)}>
                                                Edit Discount
                                            </ActionButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </TableWrapper>
                </Card>

                {showModal && selectedBill && (
                    <ModalOverlay>
                        <ModalContent>
                            <h2 style={{ marginBottom: "20px", color: "#C06FA2" }}>
                                Edit Discount: {selectedBill.billnumber}
                            </h2>

                            <FormGroup>
                                <label>Total Amount</label>
                                <input type="text" value={`₹${selectedBill.total} `} disabled />
                            </FormGroup>

                            <FormGroup>
                                <label>Discount Type</label>
                                <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                                    <option value="amount">Fixed Amount</option>
                                    <option value="%">Percentage (%)</option>
                                </select>
                            </FormGroup>

                            <FormGroup>
                                <label>Discount Value</label>
                                <input
                                    type="number"
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value)}
                                    placeholder="Enter value"
                                />
                            </FormGroup>

                            <FormGroup>
                                <label>Discounted Amount</label>
                                <input type="text" value={`₹${(discountAmount || 0).toFixed(2)} `} disabled />
                            </FormGroup>

                            <FormGroup>
                                <label>Final Net Amount</label>
                                <p style={{ fontSize: "1.5rem", fontWeight: "800", color: "#3d8a5f" }}>
                                    ₹{(netAmount || 0).toFixed(2)}
                                </p>
                            </FormGroup>

                            <ButtonRow>
                                <CancelButton onClick={() => setShowModal(false)}>Cancel</CancelButton>
                                <DeleteButton onClick={handleDelete} disabled={loading}>
                                    {loading ? "Deleting..." : "Delete Bill"}
                                </DeleteButton>
                                <SaveButton onClick={handleSave} disabled={loading}>
                                    {loading ? "Saving..." : "Save Changes"}
                                </SaveButton>
                            </ButtonRow>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </ContentWrapper>
        </Container>
    );
};

export default ERBilledit;
