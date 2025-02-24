"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "patient",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:5000/auth/register", formData)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      if (response.data.user.role === "patient") {
        navigate("/patient-dashboard")
      } else if (["counselor", "doctor"].includes(response.data.user.role)) {
        navigate("/professional-dashboard")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div
      className="container fade-in"
      style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div className="card slide-in" style={{ width: "100%", maxWidth: "400px" }}>
        <h1 style={{ textAlign: "center", color: "var(--primary-color)", marginBottom: "20px" }}>
          Register for ReviveWell
        </h1>
        {error && (
          <div
            style={{
              backgroundColor: "var(--accent-color)",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="patient">Patient</option>
            <option value="counselor">Counselor</option>
            <option value="doctor">Doctor</option>
          </select>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }}>
            Register
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary-color)", textDecoration: "none" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register

