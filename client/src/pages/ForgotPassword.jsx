import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetLink("");

    if (!email.trim()) return setError("Email address is required.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return setError("Please enter a valid email address.");

    setSubmitting(true);

    try {
      const res = await api.post("/auth/forgot-password", { email: email.trim() });
      setMessage(res.data.message || "Password reset link generated successfully.");
      if (res.data.resetLink) setResetLink(res.data.resetLink);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to process reset request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-light, #fff8eb)",
        backgroundImage: "radial-gradient(#231e25 1.3px, transparent 1.3px)",
        backgroundSize: "28px 28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <Link
        to="/login"
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          textDecoration: "none",
          color: "var(--color-dark, #231e25)",
          fontFamily: "'Satoshi', sans-serif",
          fontSize: 14,
          fontWeight: 800,
          backgroundColor: "#ffffff",
          border: "2px solid var(--color-dark, #231e25)",
          boxShadow: "2px 2px 0px var(--color-dark, #231e25)",
          padding: "6px 14px",
          borderRadius: 20,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>←</span> Back to Login
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        style={{
          width: "100%",
          maxWidth: 480,
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
          position: "relative",
          padding: "clamp(28px, 5vw, 44px) clamp(20px, 4vw, 36px)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ position: "absolute", top: -6, left: -6, width: 12, height: 12, backgroundColor: "var(--color-primary, #ff3e33)", border: "2px solid #000" }} />
        <div style={{ position: "absolute", top: -6, right: -6, width: 12, height: 12, backgroundColor: "var(--color-primary, #ff3e33)", border: "2px solid #000" }} />

        <div
          style={{
            display: "inline-block",
            backgroundColor: "var(--color-dark, #231e25)",
            color: "var(--color-light, #fff8eb)",
            padding: "4px 12px",
            borderRadius: 4,
            fontSize: 12,
            fontFamily: "'Satoshi', sans-serif",
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          [ PASSWORD RECOVERY ]
        </div>

        <h2 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(40px, 6vw, 52px)", color: "var(--color-dark, #231e25)", lineHeight: 0.92, margin: "0 0 8px 0" }}>
          RESET YOUR PASS
        </h2>
        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, color: "#6b7280", margin: "0 0 24px 0", fontWeight: 500 }}>
          Enter your registered email to generate a secure reset link.
        </p>

        {error && (
          <div style={{ backgroundColor: "#fee2e2", border: "2px solid red", padding: "10px 14px", marginBottom: 16, color: "#991b1b", fontWeight: 700, fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}
        {message && (
          <div style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "2px solid #000", padding: "10px 14px", marginBottom: 16, color: "#000", fontWeight: 800, fontSize: 13 }}>
            ✓ {message}
          </div>
        )}

        {resetLink && (
          <div style={{ backgroundColor: "var(--color-selective-yellow, #feb804)", border: "2px solid #000", padding: 14, marginBottom: 20, fontSize: 13, fontFamily: "'Satoshi', sans-serif" }}>
            <strong>Demo Mode Reset Link:</strong>
            <br />
            <a href={resetLink} target="_blank" rel="noreferrer" style={{ color: "var(--color-dark)", fontWeight: 800, wordBreak: "break-all" }}>
              {resetLink}
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Registered Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@company.com"
              style={{ width: "100%", padding: "12px 14px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 600, marginTop: 4, backgroundColor: "#f9fafb" }}
            />
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ y: -2, boxShadow: "5px 5px 0px var(--color-dark, #231e25)" }}
            whileTap={{ y: 2 }}
            style={{
              padding: "14px",
              backgroundColor: "var(--color-primary, #ff3e33)",
              color: "#ffffff",
              border: "2.5px solid var(--color-dark, #231e25)",
              boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
              borderRadius: 4,
              fontFamily: "var(--font-display)",
              fontSize: 22,
              letterSpacing: 1.5,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "PROCESSING..." : "GENERATE RESET LINK →"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;