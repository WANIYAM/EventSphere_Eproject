import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      return setError("Full Name is required.");
    }
    if (!formData.email.trim()) {
      return setError("Email address is required.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return setError("Please enter a valid email address.");
    }
    if (formData.role === "exhibitor" && !formData.company.trim()) {
      return setError("Company name is required for exhibitor registration.");
    }
    if (!formData.password) {
      return setError("Password is required.");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

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

      if (newUser.role === "exhibitor") {
        navigate("/exhibitor");
      } else {
        navigate("/attendee");
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
      {/* Return to Home link */}
      <Link
        to="/"
        style={{
          position: "absolute",
          top: 24,
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
          gap: 6,
        }}
      >
        <span>←</span> Back to Expo
      </Link>

      {/* Main Neo-Brutalist Registration Card */}
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
        {/* 4 Corner Viewfinder Handles */}
        <div style={{ position: "absolute", top: -6, left: -6, width: 12, height: 12, backgroundColor: "var(--color-kiwi, #abf139)", border: "2px solid #231e25" }} />
        <div style={{ position: "absolute", top: -6, right: -6, width: 12, height: 12, backgroundColor: "var(--color-kiwi, #abf139)", border: "2px solid #231e25" }} />
        <div style={{ position: "absolute", bottom: -6, left: -6, width: 12, height: 12, backgroundColor: "var(--color-kiwi, #abf139)", border: "2px solid #231e25" }} />
        <div style={{ position: "absolute", bottom: -6, right: -6, width: 12, height: 12, backgroundColor: "var(--color-kiwi, #abf139)", border: "2px solid #231e25" }} />

        {/* Top Tag Badge */}
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

        {/* Headline */}
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
          JOIN <span style={{ color: "var(--color-primary, #ff3e33)" }}>&#123; EVENTSPHERE &#125;</span>
        </h2>
        <p
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 15,
            color: "#6b7280",
            margin: "0 0 24px 0",
            fontWeight: 500,
          }}
        >
          Select your registration role to access customized trade show features.
        </p>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: "#fee2e2",
              border: "2px solid var(--color-primary, #ff3e33)",
              boxShadow: "3px 3px 0px var(--color-primary, #ff3e33)",
              padding: "10px 14px",
              borderRadius: 4,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#991b1b",
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* TACTILE ROLE SWITCHER (Replacing generic select dropdown) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 13,
                fontWeight: 800,
                color: "var(--color-dark, #231e25)",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Select Your Expo Role
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                type="button"
                onClick={() => setRole("attendee")}
                style={{
                  padding: "12px 14px",
                  borderRadius: 4,
                  border: "2px solid var(--color-dark, #231e25)",
                  backgroundColor: formData.role === "attendee" ? "var(--color-selective-yellow, #feb804)" : "#f3f4f6",
                  color: "var(--color-dark, #231e25)",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: formData.role === "attendee" ? "3px 3px 0px var(--color-dark, #231e25)" : "none",
                  transform: formData.role === "attendee" ? "translate(-1px, -1px)" : "none",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span>🎫</span> Attendee Pass
              </button>

              <button
                type="button"
                onClick={() => setRole("exhibitor")}
                style={{
                  padding: "12px 14px",
                  borderRadius: 4,
                  border: "2px solid var(--color-dark, #231e25)",
                  backgroundColor: formData.role === "exhibitor" ? "var(--color-kiwi, #abf139)" : "#f3f4f6",
                  color: "var(--color-dark, #231e25)",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: formData.role === "exhibitor" ? "3px 3px 0px var(--color-dark, #231e25)" : "none",
                  transform: formData.role === "exhibitor" ? "translate(-1px, -1px)" : "none",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span>🏢</span> Exhibitor Booth
              </button>
            </div>
          </div>

          {/* Full Name & Phone Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                htmlFor="name"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--color-dark, #231e25)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Johnson"
                style={{
                  padding: "12px 14px",
                  border: "2px solid var(--color-dark, #231e25)",
                  borderRadius: 4,
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  outline: "none",
                  backgroundColor: "#f9fafb",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                htmlFor="phone"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--color-dark, #231e25)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+60 12-345 6789"
                style={{
                  padding: "12px 14px",
                  border: "2px solid var(--color-dark, #231e25)",
                  borderRadius: 4,
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  outline: "none",
                  backgroundColor: "#f9fafb",
                }}
              />
            </div>
          </div>

          {/* Email Address */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="email"
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 13,
                fontWeight: 800,
                color: "var(--color-dark, #231e25)",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@company.com"
              style={{
                padding: "12px 14px",
                border: "2px solid var(--color-dark, #231e25)",
                borderRadius: 4,
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                outline: "none",
                backgroundColor: "#f9fafb",
              }}
            />
          </div>

          {/* Dynamic Company Field for Exhibitors */}
          <AnimatePresence>
            {formData.role === "exhibitor" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}
              >
                <label
                  htmlFor="company"
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 13,
                    fontWeight: 800,
                    color: "var(--color-dark, #231e25)",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Exhibiting Company / Brand Name
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Apex Industrial Robotics"
                  style={{
                    padding: "12px 14px",
                    border: "2px solid var(--color-dark, #231e25)",
                    borderRadius: 4,
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 15,
                    fontWeight: 600,
                    outline: "none",
                    backgroundColor: "#fef3c7",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password & Confirm Password */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                htmlFor="password"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--color-dark, #231e25)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 chars"
                style={{
                  padding: "12px 14px",
                  border: "2px solid var(--color-dark, #231e25)",
                  borderRadius: 4,
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  outline: "none",
                  backgroundColor: "#f9fafb",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                htmlFor="confirmPassword"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--color-dark, #231e25)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                style={{
                  padding: "12px 14px",
                  border: "2px solid var(--color-dark, #231e25)",
                  borderRadius: 4,
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  outline: "none",
                  backgroundColor: "#f9fafb",
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ y: -2, boxShadow: "5px 5px 0px var(--color-dark, #231e25)" }}
            whileTap={{ y: 2, boxShadow: "1px 1px 0px var(--color-dark, #231e25)" }}
            style={{
              marginTop: 10,
              padding: "14px",
              backgroundColor: "var(--color-kiwi, #abf139)",
              color: "var(--color-dark, #231e25)",
              border: "2.5px solid var(--color-dark, #231e25)",
              boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
              borderRadius: 4,
              fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)",
              fontSize: 24,
              letterSpacing: 1.5,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.75 : 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>{submitting ? "CREATING PASS..." : "CREATE EXPO ACCOUNT →"}</span>
          </motion.button>
        </form>

        {/* Footer Login Redirect */}
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
            to="/login"
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