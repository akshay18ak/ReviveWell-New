"use client"

import { useState } from "react"
import axios from "axios"

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put("http://localhost:5000/profile/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      localStorage.setItem("user", JSON.stringify(response.data))
      setUser(response.data)
      setSuccess("Profile updated successfully")
      setError("")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile")
      setSuccess("")
    }
  }

  return (
    <div className="container fade-in" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ color: "var(--primary-color)", textAlign: "center", marginBottom: "20px" }}>Profile Settings</h1>
      <div className="card slide-in">
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
        {success && (
          <div
            style={{
              backgroundColor: "var(--secondary-color)",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
            }}
          >
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="firstName" style={{ display: "block", marginBottom: "5px" }}>
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="lastName" style={{ display: "block", marginBottom: "5px" }}>
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="phone" style={{ display: "block", marginBottom: "5px" }}>
              Phone
            </label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="address" style={{ display: "block", marginBottom: "5px" }}>
              Address
            </label>
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows="3"></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Update Profile
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile

