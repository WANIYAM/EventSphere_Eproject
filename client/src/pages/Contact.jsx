import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";

export default function Contact() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [adminContact, setAdminContact] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    category: "general",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (user) {
      api
        .get("/messages/admin-contact")
        .then((res) => setAdminContact(res.data))
        .catch((err) => console.error("Failed to load organizer contact", err));
    }
  }, [user]);

  const validateField = (name, value) => {
    switch (name) {
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

    if (!adminContact?._id) {
      return setError("Organizer messaging desk is currently connecting. Please try again shortly.");
    }

    const subjErr = validateField("subject", formData.subject);
    const msgErr = validateField("message", formData.message);

    if (subjErr || msgErr) {
      setTouched({ subject: true, message: true });
      return setError(subjErr || msgErr);
    }

    setSubmitting(true);
    try {
      await api.post("/messages", {
        receiver: adminContact._id,
        subject: `[${formData.category.toUpperCase()}] ${formData.subject.trim()}`,
        body: formData.message.trim(),
      });
      setSuccess(true);
      setFormData({ subject: "", category: "general", message: "" });
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
          }}
        >
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

          {/* Condition A: Visitor Not Logged In */}
          {!user ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{
                  backgroundColor: "var(--color-light, #fff8eb)",
                  border: "2px solid #000000",
                  padding: "24px",
                  borderRadius: 4,
                  marginBottom: 24,
                  textAlign: "left",
                  fontFamily: "'Satoshi', sans-serif",
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#6b7280" }}>
                  OPERATIONS DESK INFORMATION
                </span>
                <h3 style={{ fontFamily: "var(--font-display, 'Bebas Neue')", fontSize: 28, margin: "6px 0 10px 0" }}>
                  ORGANIZER COMMUNICATION
                </h3>
                <p style={{ fontSize: 14, color: "#374151", margin: "0 0 8px 0", lineHeight: 1.5 }}>
                  EventSphere Management Headquarters: Kuala Lumpur & Penang Convention Precincts
                </p>
                <p style={{ fontSize: 14, color: "#374151", margin: 0, lineHeight: 1.5 }}>
                  Response window: 24 business hours. Inquiries from registered attendees and exhibitors are dispatched directly to operations administrators.
                </p>
              </div>

              <button
                onClick={() => navigate("/login?redirect=" + encodeURIComponent(location.pathname), { state: { from: location.pathname } })}
                style={{
                  backgroundColor: "var(--color-primary, #ff3e33)",
                  color: "#ffffff",
                  border: "2.5px solid var(--color-dark, #231e25)",
                  boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
                  padding: "14px 28px",
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  letterSpacing: 1,
                  cursor: "pointer",
                }}
              >
                Log in to message the organizers
              </button>
            </div>
          ) : (
            /* Condition B: Authenticated User Messaging Form */
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
                    Your transmission has been forwarded to the event operations team. Track replies under your Messages tab.
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
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat.id })}
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
                          }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

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
                      }}
                    />
                  </div>

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
                    }}
                  >
                    {submitting ? "SENDING MESSAGE..." : "DISPATCH MESSAGE TO ORGANIZERS"}
                  </motion.button>
                </form>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}