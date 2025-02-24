"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const ProfessionalDashboard = () => {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        }

        const [patientsRes, appointmentsRes] = await Promise.all([
          axios.get("http://localhost:5000/professional/patients", config),
          axios.get("http://localhost:5000/professional/appointments", config),
        ])

        setPatients(patientsRes.data)
        setAppointments(appointmentsRes.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const handleChatWithPatient = (patientId) => {
    navigate(`/chat/${patientId}`)
  }

  return (
    <div className="container fade-in">
      <h1 style={{ color: "var(--primary-color)", marginBottom: "20px" }}>Welcome Dr. {user.lastName}</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <div className="card slide-in" style={{ flex: 1, minWidth: "300px" }}>
          <h2 style={{ color: "var(--secondary-color)" }}>Your Patients</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {patients.map((patient) => (
              <li
                key={patient.id}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  backgroundColor: "var(--input-background)",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>
                    {patient.firstName} {patient.lastName}
                  </strong>
                  <br />
                  Last Assessment: {patient.lastAssessmentDate || "Not taken"}
                </div>
                <button className="btn btn-primary" onClick={() => handleChatWithPatient(patient.id)}>
                  Chat
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card slide-in" style={{ flex: 1, minWidth: "300px" }}>
          <h2 style={{ color: "var(--secondary-color)" }}>Upcoming Appointments</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {appointments.map((appointment) => (
              <li
                key={appointment.id}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  backgroundColor: "var(--input-background)",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{appointment.patientName}</strong>
                  <br />
                  Date: {new Date(appointment.date).toLocaleDateString()}
                </div>
                <button className="btn btn-primary" onClick={() => handleChatWithPatient(appointment.patientId)}>
                  Chat
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProfessionalDashboard

