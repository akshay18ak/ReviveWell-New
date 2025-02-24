"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await axios.post("http://localhost:5000/auth/login", formData)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      if (response.data.user.role === "patient") {
        navigate("/patient-dashboard")
      } else if (["counselor", "doctor"].includes(response.data.user.role)) {
        navigate("/professional-dashboard")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div
      className="container fade-in"
      style={{ 
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative shapes */}
      <div style={{
        position: "absolute",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.1)",
        top: "10%",
        left: "5%"
      }} />
      <div style={{
        position: "absolute",
        width: "150px",
        height: "150px",
        background: "rgba(252, 182, 159, 0.2)",
        transform: "rotate(45deg)",
        bottom: "15%",
        right: "10%"
      }} />
      <div style={{
        position: "absolute",
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        background: "rgba(255, 236, 210, 0.2)",
        top: "40%",
        right: "20%"
      }} />
      
      <div className="card slide-in" style={{ 
        width: "100%", 
        maxWidth: "400px",
        padding: "30px",
        boxShadow: "0 8px 24px rgba(252, 182, 159, 0.2)",
        borderRadius: "15px",
        background: "white",
        position: "relative",
        zIndex: 1
      }}>
        <h1 style={{ 
          textAlign: "center", 
          color: "#e67e22",
          marginBottom: "30px",
          fontFamily: "'Helvetica Neue', sans-serif"
        }}>
          Welcome Home
        </h1>
        {error && (
          <div
            style={{
              backgroundColor: "#e74c3c",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px"
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              marginBottom: "15px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ffecd2",
              width: "100%"
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              marginBottom: "20px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ffecd2",
              width: "100%"
            }}
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              width: "100%", 
              padding: "12px",
              backgroundColor: "#e67e22",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s"
            }}
          >
            Sign In
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "25px", color: "#7f8c8d" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#e67e22", textDecoration: "none", fontWeight: "bold" }}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
