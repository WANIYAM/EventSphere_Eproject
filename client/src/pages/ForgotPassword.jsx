import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api.js";
import { CornerBrackets, ShineSweep, PulseDot, RotatingBadge, TickerStrip, TickStrip } from "../components/common/NeoBrutalKit.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage(""); setResetLink("");
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
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "var(--color-light, #fff8eb)",
      backgroundImage: "radial-gradient(#231e25 1.3px, transparent 1.3px)",
      backgroundSize: "28px 28px",
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
      padding: "40px 20px", boxSizing: "border-box", position: "relative", overflow: "hidden",
    }}>
      {/* Ticker strip top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, backgroundColor: "var(--color-dark, #231e25)", padding: "6px 0", borderBottom: "2px solid #000" }}>
        <TickerStrip items={["SECURE PASSWORD RECOVERY", "EVENTSPHERE MANAGEMENT", "EXPO & TRADE SHOW PLATFORM", "SSL ENCRYPTED"]} color="var(--color-kiwi, #abf139)" duration={24} />
      </div>

      <Link to="/login" style={{
        position: "absolute", top: 42, left: 24, textDecoration: "none",
        color: "var(--color-dark, #231e25)", fontFamily: "'Satoshi', sans-serif",
        fontSize: 14, fontWeight: 800, backgroundColor: "#ffffff",
        border: "2px solid var(--color-dark, #231e25)", boxShadow: "2px 2px 0px var(--color-dark, #231e25)",
        padding: "6px 14px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 6,
      }}>
        ← Back to Login
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        style={{
          width: "100%", maxWidth: 480, backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)", boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
          position: "relative", padding: "clamp(28px, 5vw, 44px) clamp(20px, 4vw, 36px)",
          boxSizing: "border-box", overflow: "hidden", marginTop: 40,
        }}
      >
        <CornerBrackets color="#000" inset={8} size={12} thickness={2.5} />
        <ShineSweep />
        <TickStrip />

        <RotatingBadge text="RECOVERY" size={72} bg="var(--color-primary, #ff3e33)" color="#fff" top={-18} right={-18} duration={16} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          backgroundColor: "var(--color-dark, #231e25)", color: "var(--color-light, #fff8eb)",
          padding: "4px 12px", borderRadius: 4, fontSize: 12,
          fontFamily: "'Satoshi', sans-serif", fontWeight: 800, letterSpacing: 1,
          textTransform: "uppercase", marginBottom: 16,
        }}>
          <PulseDot color="var(--color-primary, #ff3e33)" size={8} />
          [ PASSWORD RECOVERY ]
        </div>

        <h2 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(40px, 6vw, 52px)", color: "var(--color-dark, #231e25)", lineHeight: 0.92, margin: "0 0 8px 0" }}>
          RESET YOUR PASSWORD
        </h2>
        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, color: "#6b7280", margin: "0 0 24px 0", fontWeight: 500 }}>
          Enter your registered email to generate a secure reset link.
        </p>

        {error && (
          <motion.div initial={{ x: -8 }} animate={{ x: [0, -4, 4, -4, 0] }} transition={{ duration: 0.4 }}
            style={{ backgroundColor: "#fee2e2", border: "2px solid red", padding: "10px 14px", marginBottom: 16, color: "#991b1b", fontWeight: 700, fontSize: 13 }}>
            Error: {error}
          </motion.div>
        )}
        {message && (
          <div style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "2px solid #000", padding: "10px 14px", marginBottom: 16, color: "#000", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            <PulseDot color="#000" glow={false} size={8} />
            Success: {message}
          </div>
        )}

        {resetLink && (
          <div style={{ backgroundColor: "var(--color-selective-yellow, #feb804)", border: "2px solid #000", padding: 14, marginBottom: 20, fontSize: 13, fontFamily: "'Satoshi', sans-serif", position: "relative" }}>
            <strong>Demo Mode Reset Link:</strong>
            <br />
            <a href={resetLink} target="_blank" rel="noreferrer" style={{ color: "var(--color-dark)", fontWeight: 800, wordBreak: "break-all" }}>{resetLink}</a>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Registered Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. alex@company.com"
              style={{ width: "100%", padding: "12px 14px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 600, marginTop: 4, backgroundColor: "#f9fafb", boxSizing: "border-box", outline: "none" }} />
          </div>

          <motion.button type="submit" disabled={submitting}
            whileHover={{ y: -2, boxShadow: "5px 5px 0px var(--color-dark, #231e25)" }}
            whileTap={{ y: 2 }}
            style={{
              padding: "14px", backgroundColor: "var(--color-primary, #ff3e33)", color: "#ffffff",
              border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
              borderRadius: 4, fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 1.5,
              cursor: submitting ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
          >
            {submitting && <PulseDot color="#fff" glow={false} size={8} />}
            {submitting ? "PROCESSING..." : "GENERATE RESET LINK"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;