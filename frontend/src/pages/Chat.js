"use client"

import { useState, useEffect, useRef } from "react"
import { Box, TextField, Button, Typography, Paper, Container } from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import axios from "axios"

const API_BASE_URL = "http://localhost:5000/chat" // Change this for deployment

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const user = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/messages/ai`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessages(response.data)
    } catch (err) {
      setError("Failed to load messages")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      setLoading(true)
      const response = await axios.post(
        `${API_BASE_URL}/ai-support`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Add both user message and AI response to chat
      setMessages(prev => [
        ...prev, 
        { id: Date.now(), sender_id: user.id, message: newMessage, timestamp: new Date().toISOString() }, 
        { id: Date.now() + 1, sender_id: null, message: response.data.message, timestamp: response.data.timestamp }
      ])
      
      setNewMessage("")
    } catch (err) {
      setError("Failed to send message")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, height: "90vh", display: "flex", flexDirection: "column" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Chat with AI Support
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ flex: 1, mb: 2, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}
      >
        {loading && messages.length === 0 && <Typography color="text.secondary" align="center">Loading messages...</Typography>}
        {error && <Typography color="error" align="center">{error}</Typography>}

        {messages.map((msg) => (
          <Box key={msg.id} sx={{ alignSelf: msg.sender_id === user.id ? "flex-end" : "flex-start", maxWidth: "70%" }}>
            <Paper elevation={1} sx={{ p: 1, bgcolor: msg.sender_id === user.id ? "primary.main" : "grey.100", color: msg.sender_id === user.id ? "white" : "text.primary" }}>
              <Typography variant="body1">{msg.message}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>

      <Box component="form" onSubmit={handleSend} sx={{ display: "flex", gap: 1 }}>
        <TextField fullWidth variant="outlined" placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} disabled={loading} />
        <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={loading || !newMessage.trim()}>Send</Button>
      </Box>
    </Container>
  )
}

export default Chat
