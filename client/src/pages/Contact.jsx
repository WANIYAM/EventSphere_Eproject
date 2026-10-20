import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";
import { CornerBrackets, ShineSweep, PulseDot, RotatingBadge, TickerStrip } from "../components/common/NeoBrutalKit.jsx";

export default function Contact() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    category: "general",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!user && !value.trim()) return "Your name is required.";
        return "";
      case "email":
        if (!user) {
          if (!value.trim()) return "Email address is required.";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Please provide a valid email address.";
        }
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
      await api.post("/messages/public-contact", {
        name: user ? user.name : formData.name.trim(),
        email: user ? user.email : formData.email.trim(),
        category: formData.category,
        subject: formData.subject.trim(),
        body: formData.message.trim(),
      });
      setSuccess(true);
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        subject: "",
        category: "general",
        message: "",
      });
      setTouched({});
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to transmit message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="landing-page-root" style={{ minHeight: "100vh", backgroundColor: "var(--color-light, #fff8eb)", paddingBottom: 100 }}>
      <CustomCursor />
      <Navigation />

      <main style={{ maxWidth: 940, margin: "0 auto", padding: "140px clamp(20px, 4vw, 56px) 60px clamp(20px, 4vw, 56px)" }}>
        <div style={{ position: "absolute", top: 80, left: 0, right: 0, backgroundColor: "var(--color-dark, #231e25)", padding: "5px 0", borderTop: "2px solid #000", borderBottom: "2px solid #000", zIndex: 8 }}>
          <TickerStrip items={["EVENTSPHERE SUPPORT DESK", "RESPONSE WINDOW 24H", "ORGANIZER COMMUNICATION", "OPEN TO ALL VISITORS"]} color="var(--color-selective-yellow, #feb804)" duration={24} />
        </div>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "var(--color-selective-yellow, #feb804)",
              color: "#000000",
              padding: "4px 14px",
              borderRadius: 4,
              fontSize: 12,
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 800,
              marginBottom: 12,
              border: "1.5px solid #000000",
              boxShadow: "2px 2px 0px #000000",
            }}
          >
            <span>EVENTSPHERE SUPPORT DESK</span>
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
            CONTACT EVENTSPHERE
          </h1>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, color: "#4b5563", marginTop: 12, fontWeight: 500, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            Need assistance with an upcoming expo, exhibitor application, booth allocation, or schedule? Direct your inquiry to the event operations team.
          </p>
        </div>

        {/* Contact Container */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "3px solid var(--color-dark, #231e25)",
            boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
            padding: "clamp(28px, 5vw, 48px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <CornerBrackets color="#000" inset={8} size={12} thickness={2.5} />
          <ShineSweep duration={1.6} delay={0.4} />
          <RotatingBadge text="SUPPORT" size={76} bg="var(--color-selective-yellow, #feb804)" color="#000" top={-18} right={-18} duration={15} />
          
          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                border: "2px solid var(--color-primary, #ff3e33)",
                boxShadow: "3px 3px 0px var(--color-primary, #ff3e33)",
                padding: "12px 16px",
                color: "#991b1b",
                fontWeight: 700,
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 14,
                marginBottom: 24,
              }}
            >
              Notice: {error}
            </div>
          )}

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {success ? (
              <div
                style={{
                  backgroundColor: "var(--color-kiwi, #abf139)",
                  border: "2.5px solid #000000",
                  boxShadow: "5px 5px 0px #000000",
                  padding: "36px 28px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, margin: "0 0 10px 0" }}>
                  MESSAGE DISPATCHED
                </h3>
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 700, margin: "0 0 20px 0" }}>
                  Your inquiry has been forwarded to the EventSphere operations team. We will review and respond within 24 business hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  style={{
                    backgroundColor: "var(--color-dark, #231e25)",
                    color: "#ffffff",
                    border: "2px solid #000000",
                    padding: "10px 24px",
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                
                {/* Account Status Badge (if logged in) */}
                {user && (
                  <div
                    style={{
                      backgroundColor: "var(--color-light, #fff8eb)",
                      border: "2px solid #000000",
                      padding: "10px 16px",
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    <span>
                      Sending as: <strong>{user.name}</strong> ({user.email})
                    </span>
                    <span style={{ backgroundColor: "var(--color-purple-mimosa, #a67eff)", color: "#fff", padding: "2px 8px", borderRadius: 3, fontSize: 11, textTransform: "uppercase" }}>
                      {user.role}
                    </span>
                  </div>
                )}

                {/* Guest Visitor Fields: Name & Email */}
                {!user && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                    <div>
                      <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. Alex Morgan"
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "2px solid var(--color-dark, #231e25)",
                          borderRadius: 4,
                          fontFamily: "'Satoshi', sans-serif",
                          fontWeight: 600,
                          marginTop: 4,
                          backgroundColor: "#f9fafb",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                        Your Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. alex@example.com"
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "2px solid var(--color-dark, #231e25)",
                          borderRadius: 4,
                          fontFamily: "'Satoshi', sans-serif",
                          fontWeight: 600,
                          marginTop: 4,
                          backgroundColor: "#f9fafb",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Inquiry Department Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>
                    Inquiry Department
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[
                      { id: "general", label: "General Support" },
                      { id: "exhibitor", label: "Exhibitor Inquiries" },
                      { id: "schedule", label: "Schedule Coordination" },
                    ].map((cat) => (
                      <motion.button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        whileHover={{ y: -3, rotate: -1 }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 20,
                          backgroundColor: formData.category === cat.id ? "var(--color-dark, #231e25)" : "#f3f4f6",
                          color: formData.category === cat.id ? "#ffffff" : "var(--color-dark, #231e25)",
                          border: "1.5px solid #000000",
                          fontFamily: "'Satoshi', sans-serif",
                          fontSize: 13,
                          fontWeight: 800,
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {formData.category === cat.id && <ShineSweep duration={1.2} delay={0} opacity={0.3} />}
                        <span style={{ position: "relative", zIndex: 7 }}>{cat.label}</span>
                      </motion.button>
                    ))}
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
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Topic of inquiry"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid var(--color-dark, #231e25)",
                      borderRadius: 4,
                      fontFamily: "'Satoshi', sans-serif",
                      fontWeight: 600,
                      marginTop: 4,
                      backgroundColor: "#f9fafb",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Message Body */}
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
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Provide inquiry details for the operations team (min 10 characters)..."
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid var(--color-dark, #231e25)",
                      borderRadius: 4,
                      fontFamily: "'Satoshi', sans-serif",
                      fontWeight: 600,
                      marginTop: 4,
                      backgroundColor: "#f9fafb",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    backgroundColor: "var(--color-primary, #ff3e33)",
                    color: "#ffffff",
                    border: "2.5px solid var(--color-dark, #231e25)",
                    boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
                    padding: "14px",
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    letterSpacing: 1,
                    cursor: submitting ? "not-allowed" : "pointer",
                    marginTop: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  {submitting && <PulseDot color="#fff" glow={false} size={8} />}
                  {submitting ? "SENDING MESSAGE..." : "DISPATCH MESSAGE TO ORGANIZERS"}
                </motion.button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}