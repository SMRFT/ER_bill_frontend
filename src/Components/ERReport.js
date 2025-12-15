import React, { useEffect, useState } from "react";
import apiRequest from "./apiRequest";
import {
  PageContainer,
  Card,
  Title,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
  Th,
  Td,
  SectionTitle,
} from "../Styles/globalStyles";

const ERbaseurl = process.env.REACT_APP_BACKEND_ER_BASE_URL;

export default function ERReport() {
  const today = new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const [summary, setSummary] = useState({
  male: 0,
  female: 0,
  total: 0,
});

  const [patients, setPatients] = useState([]);

  const fetchReport = async () => {
  try {
    const response = await apiRequest(
      `${ERbaseurl}erreport/?from_date=${fromDate}&to_date=${toDate}`,
      "GET"
    );

    // Handle both response styles safely
    const res = response?.data || response;

    if (res?.success) {
      setSummary(res.summary || { male: 0, female: 0, total: 0 });
      setPatients(res.patients || []);
    } else {
      setSummary({ male: 0, female: 0, total: 0 });
      setPatients([]);
    }
  } catch (error) {
    console.error("ER Report Error:", error);
    setSummary({ male: 0, female: 0, total: 0 });
    setPatients([]);
  }
};
useEffect(() => {
  fetchReport();
}, []);



  return (
    <PageContainer>
      <Card>
        <Title>ER Patient Report</Title>

        {/* Date Filters */}
        <FormGrid>
          <FormGroup>
            <Label>From Date</Label>
            <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <Label>To Date</Label>
            <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </FormGroup>

          <FormGroup style={{ alignSelf: "end" }}>
            <Button onClick={fetchReport}>Search</Button>
          </FormGroup>
        </FormGrid>

        {/* Summary */}
        <SectionTitle>Summary</SectionTitle>
        <FormGrid>
          <Card>Male : {summary?.male}</Card>
            <Card>Female : {summary?.female}</Card>
            <Card>Total : {summary?.total}</Card>

        </FormGrid>

        {/* Table */}
        <SectionTitle>Patient Details</SectionTitle>

        <Table>
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
            {patients.length > 0 ? (
              patients.map((p, i) => (
                <tr key={i}>
                  <Td>{p.date}</Td>
                  <Td>{p.billnumber}</Td>
                  <Td>{p.uhid}</Td>
                  <Td>{p.patientname}</Td>
                  <Td>{p.gender}</Td>
                  <Td>{p.doctorname}</Td>
                  <Td>{p.total}</Td>
                  <Td>{p.net_amount}</Td>
                </tr>
              ))
            ) : (
              <tr>
                <Td colSpan="8" style={{ textAlign: "center" }}>
                  No Records Found
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </PageContainer>
  );
}
