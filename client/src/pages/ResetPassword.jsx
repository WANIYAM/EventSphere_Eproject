import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api.js";
import { CornerBrackets, ShineSweep, PulseDot, RotatingBadge, TickerStrip } from "../components/common/NeoBrutalKit.jsx";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (!password) return setError("New password is required.");
    if (password.length < 6) return setError("Password must be at least 6 characters long.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setSubmitting(true);
    try {
      const res = await api.put(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message || "Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Password reset failed. Invalid or expired token.");
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
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, backgroundColor: "var(--color-dark, #231e25)", padding: "6px 0", borderBottom: "2px solid #000" }}>
        <TickerStrip items={["SECURE PASSWORD RESET", "EVENTSPHERE SECURITY", "TOKEN VERIFIED"]} color="var(--color-cerulean, #14a6ea)" duration={22} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        style={{
          width: "100%", maxWidth: 520, backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)", boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
          position: "relative", padding: "clamp(28px, 5vw, 44px)",
          boxSizing: "border-box", overflow: "hidden", marginTop: 40,
        }}
      >
        <CornerBrackets color="#000" inset={8} size={12} thickness={2.5} />
        <ShineSweep />
        <RotatingBadge text="NEW PASS" size={76} bg="var(--color-cerulean, #14a6ea)" color="#fff" top={-18} right={-18} duration={17} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "var(--color-dark, #231e25)", color: "var(--color-light, #fff8eb)", padding: "4px 12px", borderRadius: 4, fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
          <PulseDot color="var(--color-cerulean, #14a6ea)" size={8} glow={false} />
          [ CREDENTIAL RESET ]
        </div>

        <h2 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(38px, 5.5vw, 50px)", color: "var(--color-dark, #231e25)", lineHeight: 0.92, margin: "0 0 20px 0" }}>
          SET NEW PASSWORD
        </h2>

        {error && (
          <motion.div initial={{ x: -8 }} animate={{ x: [0, -4, 4, -4, 0] }} transition={{ duration: 0.4 }}
            style={{ backgroundColor: "#fee2e2", border: "2px solid var(--color-primary, #ff3e33)", boxShadow: "3px 3px 0px var(--color-primary, #ff3e33)", padding: "10px 14px", marginBottom: 16, color: "#991b1b", fontWeight: 700, fontSize: 13 }}>
            {error}
          </motion.div>
        )}
        {message && (
          <div style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "2px solid #000", boxShadow: "3px 3px 0 #000", padding: "12px 14px", marginBottom: 16, color: "#000", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
            <PulseDot color="#000" glow={false} size={8} />
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label htmlFor="password" style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>New Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password (min 6 chars)"
              style={{ width: "100%", padding: "12px 14px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 600, marginTop: 4, backgroundColor: "#f9fafb", boxSizing: "border-box", outline: "none" }} />
          </div>
          <div>
            <label htmlFor="confirmPassword" style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Confirm New Password</label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password"
              style={{ width: "100%", padding: "12px 14px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 600, marginTop: 4, backgroundColor: "#f9fafb", boxSizing: "border-box", outline: "none" }} />
          </div>

          <motion.button type="submit" disabled={submitting}
            whileHover={{ y: -2, boxShadow: "5px 5px 0px var(--color-dark, #231e25)" }}
            whileTap={{ y: 2 }}
            style={{ padding: "14px", backgroundColor: "var(--color-cerulean, #14a6ea)", color: "#fff", border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "3px 3px 0px var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 1.5, cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
          >
            {submitting && <PulseDot color="#fff" glow={false} size={8} />}
            {submitting ? "RESETTING..." : "RESET PASSWORD"}
          </motion.button>
        </form>

        <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1.5px dashed var(--color-dark, #231e25)", textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 700 }}>
          <Link to="/login" style={{ color: "var(--color-primary, #ff3e33)", fontWeight: 800, textDecoration: "underline" }}>← Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;