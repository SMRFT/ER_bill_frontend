import React, { useEffect, useState } from "react";
import axios from "axios";
import apiRequest from "./apiRequest";

import {
  Label,
  Input,
  Select,
  Button,
  DangerButton,
  PageContainer,
  Card,
  Title,
  FormGrid,
  FormGroup,
  Table,
  Th,
  Td,
  TotalRow,
  SectionTitle,
  SubmitButton,
  DiscountGrid,
  AmountDisplay,
  ToastContainer,
  Toast,
  ToastIcon,
  ToastMessage,
  ToastClose,
} from "../Styles/globalStyles";

const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL;

export default function ERBilling() {
  /* ---------------- Form State ---------------- */
  const [form, setForm] = useState({
    uhid: "",
    patientname: "",
    age: "",
    gender: "",
    phonenumber: "",
    billnumber: "",
    doctorname: "",
    
  });

  const [procedures, setProcedures] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedProcedures, setSelectedProcedures] = useState([]);

  /* ---------------- Toast State ---------------- */
  const [toasts, setToasts] = useState([]);

  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  const today = new Date().toISOString().split("T")[0];


  /* ---------------- Toast Functions ---------------- */
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  /* ---------------- Fetch Data ---------------- */
  useEffect(() => {
    fetchProcedures();
    fetchDoctors();
  }, []);

  const fetchProcedures = async () => {
  try {
    const result = await apiRequest(`${ERbaseurl}procedurelist/`, "GET");

    if (result.success) {
      setProcedures(result.data || []);
    } else {
      showToast("Failed to fetch procedures", "error");
    }
  } catch (error) {
    console.error("Error fetching procedures:", error);
    showToast("Failed to fetch procedures", "error");
  }
};


  const fetchDoctors = async () => {
  try {
    const result = await apiRequest(`${ERbaseurl}doctorlist/`, "GET");

    if (result.success) {
      setDoctors(result.data || []);
    } else {
      showToast("Failed to fetch doctors", "error");
    }
  } catch (error) {
    console.error("Error fetching doctors:", error);
    showToast("Failed to fetch doctors", "error");
  }
};


  /* ---------------- Form Handler ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- Add Procedure ---------------- */
  const handleProcedureSelect = (e) => {
    const name = e.target.value;
    if (!name) return;

    const found = procedures.find((p) => p.procedure_name === name);

    if (found && !selectedProcedures.some((p) => p.procedure_name === name)) {
      setSelectedProcedures([...selectedProcedures, found]);
    }
  };

  const removeItem = (name) => {
    setSelectedProcedures(
      selectedProcedures.filter((p) => p.procedure_name !== name)
    );
  };

  /* ---------------- Total Calculation ---------------- */
  const totalAmount = selectedProcedures.reduce(
    (sum, item) => sum + parseFloat(item.rate || 0),
    0
  );

  /* ---------------- Discount Calculation ---------------- */
  useEffect(() => {
    let discount = 0;

    if (discountType === "percentage") {
      discount = (totalAmount * discountValue) / 100;
    } else {
      discount = Number(discountValue);
    }

    setDiscountAmount(discount);
    setFinalAmount(totalAmount - discount);
  }, [discountType, discountValue, totalAmount]);

  const printBill = (data) => {
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
            .info-value { text-align: right; }

            .procedure-header {
              display: flex;
              font-weight: bold;
              border-bottom: 1px solid #000;
              padding-bottom: 4px;
              margin-bottom: 4px;
            }
            .procedure-header div:nth-child(1) { width: 10%; text-align: center; }
            .procedure-header div:nth-child(2) { width: 60%; }
            .procedure-header div:nth-child(3) { width: 30%; text-align: right; }

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
          </div>

          <div class="line"></div>

          <div class="center" style="font-weight: bold;">Cash Bill - <u>ER BILL (SH)</u></div>

          <div class="line"></div>

          <div class="info-table">
            <div class="info-label">Bill Number</div><div class="info-colon">:</div><div class="info-value">${data.billnumber}</div>
            <div class="info-label">UHID</div><div class="info-colon">:</div><div class="info-value">${data.uhid}</div>
            <div class="info-label">Date</div><div class="info-colon">:</div><div class="info-value">${data.date} ${data.time}</div>
            <div class="info-label">Name</div><div class="info-colon">:</div><div class="info-value">${data.patientname}</div>
            <div class="info-label">Doctor</div><div class="info-colon">:</div><div class="info-value">${data.doctorname}</div>
          </div>

          <div class="line"></div>

          <div class="procedure-header">
            <div>No</div>
            <div>Description</div>
            <div>Amount</div>
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

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
  try {
    const cleanProcedures = selectedProcedures.map(item => ({
      procedure_name: item.procedure_name,
      rate: Number(item.rate)
    }));

    const payload = {
      ...form,
      procedures: cleanProcedures,
      total: totalAmount,
      net_amount: finalAmount,
      discount_amount: discountAmount,
      discount_type: discountType,
      discount_value: discountValue,
    };

    const response = await apiRequest(`${ERbaseurl}erbilling/`, "POST", payload);

    if (response.success) {
      showToast("Billing saved successfully!", "success");

      const printData = {
        ...form,
        procedures: selectedProcedures,
        total: totalAmount,
        net_amount: finalAmount,
        discount_amount: discountAmount,
        discount_type: discountType,
        discount_value: discountValue,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };

      printBill(printData);
    } else {
      showToast("Error saving billing: " + (response.error || "Unknown error"), "error");
    }

  } catch (error) {
    console.error(error);
    showToast("Error saving billing. Please try again.", "error");
  }
};


  /* ---------------- UI ---------------- */
  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer>
        {toasts.map(toast => (
          <Toast key={toast.id} type={toast.type}>
            <ToastIcon>
              {toast.type === 'success' ? '✓' : '✕'}
            </ToastIcon>
            <ToastMessage>{toast.message}</ToastMessage>
            <ToastClose onClick={() => removeToast(toast.id)}>×</ToastClose>
          </Toast>
        ))}
      </ToastContainer>

      <PageContainer>
      <Card>
        <Title>ER Billing System</Title>

        {/* Patient & Billing Information - 4 columns per row */}
        <FormGrid>
          <FormGroup>
          <Label>Date</Label>
          <Input
            type="date"
            value={new Date().toISOString().split("T")[0]}
            disabled
          />
        </FormGroup>


          <FormGroup>
            <Label>UHID Number</Label>
            <Input name="uhid" value={form.uhid} onChange={handleChange} placeholder="Enter UHID" />
          </FormGroup>

          <FormGroup>
            <Label>Bill Number</Label>
            <Input name="billnumber" value={form.billnumber} onChange={handleChange} placeholder="Enter Bill Number" />
          </FormGroup>

          <FormGroup>
            <Label>Patient Name</Label>
            <Input name="patientname" value={form.patientname} onChange={handleChange} placeholder="Enter Patient Name" />
          </FormGroup>

          <FormGroup>
            <Label>Age</Label>
            <Input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Enter Age" />
          </FormGroup>

          <FormGroup>
            <Label>Gender</Label>
            <Select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Doctor Name</Label>
            <Select name="doctorname" value={form.doctorname} onChange={handleChange}>
              <option value="">Select Doctor</option>
              {doctors.map((item, index) => (
                <option key={index} value={item.doctor_name}>
                  {item.doctor_name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Phone Number</Label>
            <Input name="phonenumber" value={form.phonenumber} onChange={handleChange} placeholder="Enter Phone Number" />
          </FormGroup>
        </FormGrid>

        {/* Procedure Selection */}
        <SectionTitle>Procedure Selection</SectionTitle>
        <FormGrid style={{ gridTemplateColumns: '1fr' }}>
          <FormGroup>
            <Label>Select Procedure</Label>
            <Select onChange={handleProcedureSelect}>
              <option value="">-- Select a Procedure --</option>
              {procedures.map((item, i) => (
                <option key={i} value={item.procedure_name}>
                  {item.procedure_name} - ₹{item.rate}
                </option>
              ))}
            </Select>
          </FormGroup>
        </FormGrid>

        {/* Selected Procedures Table */}
        {selectedProcedures.length > 0 && (
          <Table>
            <thead>
              <tr>
                <Th>Procedure Name</Th>
                <Th>Rate (₹)</Th>
                <Th>Action</Th>
              </tr>
            </thead>

            <tbody>
              {selectedProcedures.map((item, idx) => (
                <tr key={idx}>
                  <Td>{item.procedure_name}</Td>
                  <Td>₹ {Number(item.rate).toFixed(2)}</Td>
                  <Td>
                    <DangerButton onClick={() => removeItem(item.procedure_name)}>
                      Remove
                    </DangerButton>
                  </Td>
                </tr>
              ))}

              <TotalRow>
                <Td>Total Amount</Td>
                <Td colSpan="2">₹ {totalAmount.toFixed(2)}</Td>
              </TotalRow>
            </tbody>
          </Table>
        )}

        {/* Discount Section */}
        {selectedProcedures.length > 0 && (
          <>
            <SectionTitle>Discount & Final Amount</SectionTitle>
            <DiscountGrid>
              <FormGroup>
                <Label>Discount Type</Label>
                <Select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="amount">Amount (₹)</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="Enter discount"
                />
              </FormGroup>

              <AmountDisplay>
                <Label>Discount Amount</Label>
                <div className="amount">₹ {discountAmount.toFixed(2)}</div>
              </AmountDisplay>

              <AmountDisplay>
                <Label>Final Amount</Label>
                <div className="amount">₹ {finalAmount.toFixed(2)}</div>
              </AmountDisplay>
            </DiscountGrid>
          </>
        )}

        <SubmitButton onClick={handleSubmit}>
          Submit & Print Bill
        </SubmitButton>
      </Card>
    </PageContainer>
    </>
  );
}