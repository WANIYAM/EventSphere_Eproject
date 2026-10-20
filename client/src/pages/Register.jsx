import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { CornerBrackets, ShineSweep, PulseDot, RotatingBadge, TickerStrip } from "../components/common/NeoBrutalKit.jsx";

const isRoutePermitted = (role, target) => {
  if (!target || typeof target !== "string") return false;
  if (target.startsWith("/admin") && role !== "admin") return false;
  if (
    (target === "/exhibitor" ||
      target.startsWith("/exhibitor/") ||
      target.startsWith("/exhibitor?") ||
      target.startsWith("/exhibitor#")) &&
    role !== "exhibitor"
  ) return false;
  if (target.startsWith("/schedule") && role !== "attendee") return false;
  return true;
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "attendee",
    company: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const rawTarget =
    location.state?.from?.pathname ||
    (typeof location.state?.from === "string" ? location.state.from : null) ||
    searchParams.get("redirect") ||
    null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Full Name is required.");
    if (!formData.email.trim()) return setError("Email address is required.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) return setError("Please enter a valid email address.");
    if (formData.role === "exhibitor" && !formData.company.trim()) {
      return setError("Company name is required for exhibitor registration.");
    }
    if (!formData.password) return setError("Password is required.");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters long.");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");

    setSubmitting(true);

    try {
      const newUser = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
        company: formData.role === "exhibitor" ? formData.company.trim() : "",
      });

      const canResume = rawTarget && isRoutePermitted(newUser.role, rawTarget);
      if (canResume) {
        navigate(rawTarget, { replace: true });
      } else if (newUser.role === "exhibitor") {
        navigate("/exhibitor", { replace: true });
      } else if (newUser.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-light, #fff8eb)",
        backgroundImage: "radial-gradient(#231e25 1.2px, transparent 1.2px)",
        backgroundSize: "24px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 20px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, backgroundColor: "var(--color-dark, #231e25)", padding: "5px 0", borderBottom: "2px solid #000", zIndex: 9 }}>
        <TickerStrip items={["NEW EXPO ACCOUNTS", "ATTENDEE · EXHIBITOR ROLES", "JOIN EVENTSPHERE 2026"]} color="var(--color-selective-yellow, #feb804)" duration={22} />
      </div>
      <Link
        to="/"
        style={{
          position: "absolute",
          top: 40,
          left: 24,
          textDecoration: "none",
          color: "var(--color-dark, #231e25)",
          fontFamily: "'Satoshi', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          backgroundColor: "#ffffff",
          border: "2px solid var(--color-dark, #231e25)",
          boxShadow: "2px 2px 0px var(--color-dark, #231e25)",
          padding: "6px 14px",
          borderRadius: 20,
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        Back to Expo
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        style={{
          width: "100%",
          maxWidth: 600,
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
          position: "relative",
          padding: "clamp(28px, 5vw, 44px) clamp(20px, 4vw, 40px)",
          boxSizing: "border-box",
        }}
      >
        <CornerBrackets color="#000" inset={8} size={12} thickness={2.5} />
        <ShineSweep />
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
          [ NEW REGISTRATION // 2025 ]
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)",
            fontSize: "clamp(42px, 6vw, 56px)",
            color: "var(--color-dark, #231e25)",
            lineHeight: 0.92,
            margin: "0 0 8px 0",
            letterSpacing: 1,
          }}
        >
          JOIN EVENTSPHERE
        </h2>
        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 15, color: "#6b7280", margin: "0 0 24px 0", fontWeight: 500 }}>
          Select your registration role to access customized trade show features.
        </p>

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              border: "2px solid var(--color-primary, #ff3e33)",
              boxShadow: "3px 3px 0px var(--color-primary, #ff3e33)",
              padding: "10px 14px",
              borderRadius: 4,
              marginBottom: 20,
              color: "#991b1b",
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Notice: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>
              Select Your Expo Role
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <motion.button
                type="button"
                onClick={() => setRole("attendee")}
                whileHover={{ y: -3, rotate: -1 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: "12px 14px",
                  borderRadius: 4,
                  border: "2px solid var(--color-dark, #231e25)",
                  backgroundColor: formData.role === "attendee" ? "var(--color-selective-yellow, #feb804)" : "#f3f4f6",
                  color: "#000",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: formData.role === "attendee" ? "3px 3px 0px #000" : "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {formData.role === "attendee" && <ShineSweep opacity={0.35} />}
                <span style={{ position: "relative", zIndex: 7, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {formData.role === "attendee" && <PulseDot color="#000" size={8} glow={false} />}
                  Attendee Pass
                </span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setRole("exhibitor")}
                whileHover={{ y: -3, rotate: -1 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: "12px 14px",
                  borderRadius: 4,
                  border: "2px solid var(--color-dark, #231e25)",
                  backgroundColor: formData.role === "exhibitor" ? "var(--color-kiwi, #abf139)" : "#f3f4f6",
                  color: "#000",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: formData.role === "exhibitor" ? "3px 3px 0px #000" : "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {formData.role === "exhibitor" && <ShineSweep opacity={0.35} />}
                <span style={{ position: "relative", zIndex: 7, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {formData.role === "exhibitor" && <PulseDot color="#000" size={8} glow={false} />}
                  Exhibitor Booth
                </span>
              </motion.button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label htmlFor="name" style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>Full Name</label>
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Alex Johnson" style={{ padding: "12px 14px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 600, outline: "none" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label htmlFor="phone" style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>Phone Number</label>
              <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} placeholder="12345678" style={{ padding: "12px 14px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 600, outline: "none" }} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="email" style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>Email Address</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="alex@company.com" style={{ padding: "12px 14px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 600, outline: "none" }} />
          </div>

          <AnimatePresence>
            {formData.role === "exhibitor" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
                <label htmlFor="company" style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>Exhibiting Company Name</label>
                <input id="company" name="company" type="text" value={formData.company} onChange={handleChange} placeholder="Apex Industrial Robotics" style={{ padding: "12px 14px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 600, outline: "none", backgroundColor: "#fef3c7" }} />
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label htmlFor="password" style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>Password</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Min 6 chars" style={{ padding: "12px 14px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 600, outline: "none" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label htmlFor="confirmPassword" style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800, textTransform: "uppercase" }}>Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" style={{ padding: "12px 14px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 600, outline: "none" }} />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ y: -2, boxShadow: "5px 5px 0px #000" }}
            whileTap={{ y: 2 }}
            style={{
              marginTop: 10,
              padding: "14px",
              backgroundColor: "var(--color-kiwi, #abf139)",
              color: "#000",
              border: "2.5px solid #000",
              boxShadow: "3px 3px 0px #000",
              borderRadius: 4,
              fontFamily: "var(--font-display)",
              fontSize: 24,
              letterSpacing: 1.5,
              cursor: submitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {submitting && <PulseDot color="#000" glow={false} size={8} />}
            {submitting ? "CREATING PASS..." : "CREATE EXPO ACCOUNT"}
          </motion.button>
        </form>

        <div
          style={{
            marginTop: 24,
            paddingTop: 18,
            borderTop: "1.5px dashed var(--color-dark, #231e25)",
            textAlign: "center",
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--color-dark, #231e25)",
          }}
        >
          Already have an account?{" "}
          <Link
            to={rawTarget ? `/login?redirect=${encodeURIComponent(rawTarget)}` : "/login"}
            style={{
              color: "var(--color-primary, #ff3e33)",
              fontWeight: 800,
              textDecoration: "underline",
            }}
          >
            Login here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;