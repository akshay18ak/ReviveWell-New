"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const PatientDashboard = () => {
  const navigate = useNavigate()
  const [assessments, setAssessments] = useState([])
  const [appointments, setAppointments] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        }

        const [assessmentsRes, appointmentsRes] = await Promise.all([
          axios.get("http://localhost:5000/assessment/history", config),
          axios.get("http://localhost:5000/patient/appointments", config),
        ])

        setAssessments(assessmentsRes.data)
        setAppointments(appointmentsRes.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container fade-in">
      <h1 style={{ color: "var(--primary-color)", marginBottom: "20px" }}>Welcome back, {user.firstName}!</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <div className="card slide-in" style={{ flex: 1, minWidth: "300px" }}>
          <h2 style={{ color: "var(--secondary-color)" }}>Recent Assessments</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {assessments.slice(0, 5).map((assessment) => (
              <li
                key={assessment.id}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  backgroundColor: "var(--input-background)",
                  borderRadius: "5px",
                }}
              >
                <strong>{new Date(assessment.date).toLocaleDateString()}</strong>
                <br />
                Score: {assessment.score}
              </li>
            ))}
          </ul>
          <button className="btn btn-secondary" onClick={() => navigate("/assessment")} style={{ width: "100%" }}>
            Take New Assessment
          </button>
        </div>
        <div className="card slide-in" style={{ flex: 1, minWidth: "300px" }}>
          <h2 style={{ color: "var(--secondary-color)" }}>Upcoming Appointments</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {appointments.slice(0, 5).map((appointment) => (
              <li
                key={appointment.id}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  backgroundColor: "var(--input-background)",
                  borderRadius: "5px",
                }}
              >
                <strong>{new Date(appointment.date).toLocaleDateString()}</strong>
                <br />
                With: Dr. {appointment.professionalName}
              </li>
            ))}
          </ul>
          <button className="btn btn-secondary" onClick={() => navigate("/chat")} style={{ width: "100%" }}>
            Chat with Professional
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard

