import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  // Comprehensive Form Validation Rules
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters long.";
        return "";
      case "email":
        if (!value.trim()) return "Email address is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return "Please enter a valid email address.";
        return "";
      case "subject":
        if (!value.trim()) return "Inquiry subject is required.";
        if (value.trim().length < 4) return "Subject must be at least 4 characters long.";
        return "";
      case "message":
        if (!value.trim()) return "Message body is required.";
        if (value.trim().length < 10) return "Message must be at least 10 characters long.";
        if (value.trim().length > 1000) return "Message cannot exceed 1000 characters.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      setError(validateField(name, value));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const fieldError = validateField(name, value);
    if (fieldError) setError(fieldError);
    else setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields on submit
    const nameErr = validateField("name", formData.name);
    const emailErr = validateField("email", formData.email);
    const subjErr = validateField("subject", formData.subject);
    const msgErr = validateField("message", formData.message);

    if (nameErr || emailErr || subjErr || msgErr) {
      setTouched({ name: true, email: true, subject: true, message: true });
      return setError(nameErr || emailErr || subjErr || msgErr);
    }

    setSubmitting(true);
    try {
      await api.post("/feedback", {
        type: formData.category === "bug" ? "issue" : "suggestion",
        message: `[Public Contact Desk] Category: ${formData.category.toUpperCase()} | From: ${formData.name.trim()} (${formData.email.trim()}) | Subject: ${formData.subject.trim()} — ${formData.message.trim()}`,
      });
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", category: "general", message: "" });
      setTouched({});
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to transmit transmission. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="landing-page-root" style={{ minHeight: "100vh", backgroundColor: "var(--color-light, #fff8eb)", paddingBottom: 100 }}>
      <CustomCursor />
      <Navigation />

      <main style={{ maxWidth: 940, margin: "0 auto", padding: "140px clamp(20px, 4vw, 56px) 60px clamp(20px, 4vw, 56px)" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "var(--color-selective-yellow, #feb804)",
              color: "#000",
              padding: "4px 14px",
              borderRadius: 4,
              fontSize: 12,
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 800,
              marginBottom: 12,
              border: "1.5px solid #000",
              boxShadow: "2px 2px 0px #000",
            }}
          >
            <span>★</span>
            <span>PUBLIC OPERATIONS DESK</span>
          </div>

          <h1
            className="style-display"
            style={{
              fontSize: "clamp(52px, 8vw, 104px)",
              color: "var(--color-dark, #231e25)",
              margin: 0,
              lineHeight: 0.9,
              letterSpacing: 2,
            }}
          >
            CONTACT &#123; EVENTSPHERE &#125;
          </h1>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, color: "#4b5563", marginTop: 12, fontWeight: 500, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            Have questions about exhibitor booth allocation, attendee badge registration, or enterprise licensing? Transmit your inquiry directly to our command crew.
          </p>
        </div>

        {/* Contact Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            backgroundColor: "#ffffff",
            border: "3px solid var(--color-dark, #231e25)",
            boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
            padding: "clamp(28px, 5vw, 48px)",
            position: "relative",
          }}
        >
          {/* Viewfinders */}
          <div style={{ position: "absolute", top: -6, left: -6, width: 12, height: 12, backgroundColor: "var(--color-primary, #ff3e33)", border: "2px solid #000" }} />
          <div style={{ position: "absolute", top: -6, right: -6, width: 12, height: 12, backgroundColor: "var(--color-primary, #ff3e33)", border: "2px solid #000" }} />

          {/* Validation Alert Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: "#fee2e2",
                border: "2.5px solid var(--color-primary, #ff3e33)",
                boxShadow: "3px 3px 0px var(--color-primary, #ff3e33)",
                padding: "12px 16px",
                color: "#991b1b",
                fontWeight: 700,
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 14,
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  backgroundColor: "var(--color-kiwi, #abf139)",
                  border: "2.5px solid #000000",
                  boxShadow: "5px 5px 0px #000000",
                  padding: "40px 32px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 42, margin: "0 0 10px 0" }}>
                  TRANSMISSION RECEIVED! ⚡
                </h3>
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, fontWeight: 700, margin: "0 0 20px 0" }}>
                  Our operations team has logged your message. Expect a response in your inbox within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  style={{
                    backgroundColor: "var(--color-dark)",
                    color: "#fff",
                    border: "2px solid #000",
                    padding: "10px 24px",
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                >
                  SEND ANOTHER MESSAGE
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Category Selector Pills */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                    Inquiry Department
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[
                      { id: "general", label: "💬 General Support" },
                      { id: "exhibitor", label: "🏢 Exhibitor & Booths" },
                      { id: "bug", label: "⚠️ Technical Bug" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 20,
                          backgroundColor: formData.category === cat.id ? "var(--color-dark, #231e25)" : "#f3f4f6",
                          color: formData.category === cat.id ? "#ffffff" : "var(--color-dark, #231e25)",
                          border: "2px solid #000",
                          fontFamily: "'Satoshi', sans-serif",
                          fontSize: 13,
                          fontWeight: 800,
                          cursor: "pointer",
                          boxShadow: formData.category === cat.id ? "2px 2px 0px var(--color-primary, #ff3e33)" : "none",
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                  <div>
                    <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Alex Johnson"
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: `2px solid ${touched.name && validateField("name", formData.name) ? "var(--color-primary)" : "var(--color-dark)"}`,
                        borderRadius: 4,
                        fontFamily: "'Satoshi', sans-serif",
                        fontWeight: 600,
                        marginTop: 4,
                        backgroundColor: "#f9fafb",
                        outline: "none",
                      }}
                    />
                    {touched.name && validateField("name", formData.name) && (
                      <span style={{ fontSize: 11, color: "var(--color-primary)", fontWeight: 700, marginTop: 3, display: "block" }}>
                        {validateField("name", formData.name)}
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="alex@company.com"
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: `2px solid ${touched.email && validateField("email", formData.email) ? "var(--color-primary)" : "var(--color-dark)"}`,
                        borderRadius: 4,
                        fontFamily: "'Satoshi', sans-serif",
                        fontWeight: 600,
                        marginTop: 4,
                        backgroundColor: "#f9fafb",
                        outline: "none",
                      }}
                    />
                    {touched.email && validateField("email", formData.email) && (
                      <span style={{ fontSize: 11, color: "var(--color-primary)", fontWeight: 700, marginTop: 3, display: "block" }}>
                        {validateField("email", formData.email)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                    Inquiry Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Exhibitor Booth Zone A Inquiry"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid ${touched.subject && validateField("subject", formData.subject) ? "var(--color-primary)" : "var(--color-dark)"}`,
                      borderRadius: 4,
                      fontFamily: "'Satoshi', sans-serif",
                      fontWeight: 600,
                      marginTop: 4,
                      backgroundColor: "#f9fafb",
                      outline: "none",
                    }}
                  />
                  {touched.subject && validateField("subject", formData.subject) && (
                    <span style={{ fontSize: 11, color: "var(--color-primary)", fontWeight: 700, marginTop: 3, display: "block" }}>
                      {validateField("subject", formData.subject)}
                    </span>
                  )}
                </div>

                {/* Message Body with Character Counter */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                      Message Body *
                    </label>
                    <span style={{ fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: formData.message.length > 1000 ? "red" : "#6b7280" }}>
                      {formData.message.length}/1000 chars
                    </span>
                  </div>
                  <textarea
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Provide detailed description of your inquiry or support request (min 10 characters)..."
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid ${touched.message && validateField("message", formData.message) ? "var(--color-primary)" : "var(--color-dark)"}`,
                      borderRadius: 4,
                      fontFamily: "'Satoshi', sans-serif",
                      fontWeight: 600,
                      marginTop: 4,
                      backgroundColor: "#f9fafb",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {touched.message && validateField("message", formData.message) && (
                    <span style={{ fontSize: 11, color: "var(--color-primary)", fontWeight: 700, marginTop: 3, display: "block" }}>
                      {validateField("message", formData.message)}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02, boxShadow: "5px 5px 0px var(--color-dark)" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    backgroundColor: "var(--color-primary, #ff3e33)",
                    color: "#ffffff",
                    border: "2.5px solid var(--color-dark)",
                    boxShadow: "3px 3px 0px var(--color-dark)",
                    padding: "15px",
                    fontFamily: "var(--font-display)",
                    fontSize: 24,
                    letterSpacing: 1.5,
                    cursor: submitting ? "not-allowed" : "pointer",
                    marginTop: 6,
                  }}
                >
                  {submitting ? "TRANSMITTING..." : "TRANSMIT INQUIRY →"}
                </motion.button>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}