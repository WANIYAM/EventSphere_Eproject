import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import {
  CornerBrackets,
  ShineSweep,
  PulseDot,
  RotatingBadge,
  TickerStrip,
  GrainOverlay,
  TickStrip,
} from "../components/common/NeoBrutalKit.jsx";

// Determine if destination is permitted for user role
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

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const rawTarget =
    location.state?.from?.pathname ||
    (typeof location.state?.from === "string" ? location.state.from : null) ||
    searchParams.get("redirect") ||
    null;

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("Email address is required.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return setError("Please enter a valid email address.");
    if (!password) return setError("Password is required.");
    if (password.length < 6) return setError("Password must be at least 6 characters long.");

    setSubmitting(true);

    try {
      const loggedUser = await login(email.trim(), password);

      const canResume = rawTarget && isRoutePermitted(loggedUser.role, rawTarget);
      if (canResume) {
        navigate(rawTarget, { replace: true });
      } else if (loggedUser.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (loggedUser.role === "exhibitor") {
        navigate("/exhibitor", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(
        err.userMessage ||
          err.response?.data?.message ||
          (!err.response
            ? "Cannot reach the API. Start the server and try again."
            : "Login failed. Please check your credentials.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* Input style helper — reacts to focus state */
  const inputStyle = (isFocused) => ({
    padding: "13px 16px",
    border: "2px solid #231e25",
    borderRadius: 4,
    fontFamily: "'Satoshi', sans-serif",
    fontSize: 16,
    fontWeight: 600,
    outline: "none",
    backgroundColor: isFocused ? "#ffffff" : "#f9fafb",
    boxShadow: isFocused ? "4px 4px 0 var(--color-primary, #ff3e33)" : "2px 2px 0 #000",
    transition: "box-shadow 0.15s ease, background 0.15s ease",
    width: "100%",
    boxSizing: "border-box",
  });

  const labelStyle = {
    fontFamily: "'Satoshi', sans-serif",
    fontSize: 13,
    fontWeight: 800,
    color: "#231e25",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  };

  const demoAccounts = [
    { label: "Admin",     email: "admin@eventsphere.com", pass: "Admin@123", bg: "var(--color-primary, #ff3e33)",          fg: "#ffffff" },
    { label: "Exhibitor", email: "exhibitor1@demo.com",   pass: "Demo@123",  bg: "var(--color-purple-mimosa, #a67eff)",    fg: "#ffffff" },
    { label: "Attendee",  email: "attendee1@demo.com",    pass: "Demo@123",  bg: "var(--color-kiwi, #abf139)",             fg: "#000000" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        maxWidth: "100%",
        backgroundColor: "var(--color-light, #fff8eb)",
        backgroundImage: "radial-gradient(#231e25 1.3px, transparent 1.3px)",
        backgroundSize: "28px 28px",
        display: "flex",
        flexDirection: "column",
        padding: "clamp(20px, 3vh, 36px) clamp(24px, 4vw, 64px)",
        boxSizing: "border-box",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* ── Ticker band ── */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          background: "#231e25",
          borderBottom: "3px solid #000",
          padding: "6px 0",
          zIndex: 20,
        }}
      >
        <TickerStrip
          items={[
            "FLOOR PLANS · SCHEDULES · DIRECTORY",
            "ROLE-BASED EXPO ACCESS",
            "ORGANIZERS · EXHIBITORS · ATTENDEES",
            "FLOOR PLANS · SCHEDULES · DIRECTORY",
          ]}
          color="var(--color-kiwi, #abf139)"
          duration={28}
          fontSize={11}
        />
      </div>

      {/* ── Top bar ── */}
      <div
        style={{
          paddingTop: 42,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          position: "relative",
          zIndex: 10,
          marginBottom: 24,
        }}
      >
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "var(--color-dark, #231e25)",
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 14,
              fontWeight: 800,
              backgroundColor: "#ffffff",
              border: "2px solid var(--color-dark, #231e25)",
              boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
              padding: "8px 20px",
              borderRadius: 30,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← Back to Expo
          </Link>
        </motion.div>

        {rawTarget && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: "var(--color-selective-yellow, #feb804)",
              color: "#000",
              border: "2px solid #000",
              boxShadow: "3px 3px 0 #000",
              padding: "6px 14px",
              borderRadius: 30,
              fontSize: 12,
              fontWeight: 800,
              fontFamily: "'Satoshi', sans-serif",
              letterSpacing: 0.4,
            }}
          >
            <PulseDot color="#000" glow={false} size={6} />
            Redirect target preserved
          </div>
        )}
      </div>

      {/* ── Content grid ── */}
      <div
        style={{
          width: "100%",
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "clamp(32px, 5vw, 80px)",
          alignItems: "center",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* ═══════════ LEFT ═══════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, width: "100%", maxWidth: 640 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "var(--color-dark, #231e25)",
              color: "var(--color-light, #fff8eb)",
              padding: "6px 14px",
              borderRadius: 4,
              width: "fit-content",
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1,
              border: "2px solid #000",
              boxShadow: "3px 3px 0 var(--color-primary, #ff3e33)",
            }}
          >
            <PulseDot color="var(--color-kiwi, #abf139)" size={7} />
            <span>ROLE-BASED EXPO ACCESS</span>
          </div>

          {/* Heading — 3-line staircase so brackets stay paired */}
          <div style={{ position: "relative" }}>
            <h1
              className="style-display"
              style={{
                fontSize: "clamp(52px, 6.5vw, 100px)",
                color: "var(--color-dark, #231e25)",
                lineHeight: 0.86,
                margin: 0,
                letterSpacing: 1.5,
              }}
            >
              YOUR STAGE
            </h1>
            <h1
              className="style-display"
              style={{
                fontSize: "clamp(52px, 6.5vw, 100px)",
                color: "var(--color-dark, #231e25)",
                lineHeight: 0.86,
                margin: 0,
                letterSpacing: 1.5,
              }}
            >
              AWAITS
            </h1>
            <h1
              className="style-display"
              style={{
                fontSize: "clamp(46px, 5.6vw, 86px)",
                color: "var(--color-primary, #ff3e33)",
                lineHeight: 0.9,
                margin: "8px 0 0 0",
                letterSpacing: 4,
                textShadow: "3px 3px 0 rgba(35, 30, 37, 0.15)",
                whiteSpace: "nowrap",
              }}
            >
              &#123; 2025 &#125;
            </h1>
          </div>

          <p
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "clamp(16px, 1.3vw, 20px)",
              color: "var(--color-dark, #231e25)",
              lineHeight: 1.5,
              margin: 0,
              maxWidth: 560,
              fontWeight: 500,
              opacity: 0.9,
            }}
          >
            One unified terminal for organizers, exhibitors, and attendees. Access floor plans, schedules, and exhibitor showcases.
          </p>

          {/* ── Demo accounts card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              backgroundColor: "var(--color-selective-yellow, #feb804)",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
              padding: "20px 24px",
              borderRadius: 4,
              marginTop: 6,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              maxWidth: 620,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CornerBrackets color="#000" inset={8} size={10} thickness={2} />
            <ShineSweep duration={1.6} delay={0.3} opacity={0.28} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
                zIndex: 2,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  letterSpacing: 0.6,
                  color: "var(--color-dark)",
                }}
              >
                DEMO ACCOUNTS (1-CLICK FILL)
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 900,
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "3px 9px",
                  borderRadius: 3,
                  letterSpacing: 0.8,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <PulseDot color="var(--color-kiwi, #abf139)" size={5} glow={false} />
                SHORTCUT
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                position: "relative",
                zIndex: 2,
              }}
            >
              {demoAccounts.map((demo) => (
                <motion.button
                  key={demo.label}
                  type="button"
                  onClick={() => fillDemo(demo.email, demo.pass)}
                  whileHover={{ y: -3, boxShadow: "5px 5px 0 #000" }}
                  whileTap={{ y: 1, boxShadow: "1.5px 1.5px 0 #000" }}
                  style={{
                    backgroundColor: demo.bg,
                    color: demo.fg,
                    border: "2px solid #000",
                    boxShadow: "3px 3px 0 #000",
                    padding: "9px 18px",
                    borderRadius: 4,
                    fontSize: 13,
                    fontFamily: "'Satoshi', sans-serif",
                    fontWeight: 800,
                    letterSpacing: 0.4,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: demo.fg,
                      border: "1px solid #000",
                      display: "inline-block",
                    }}
                  />
                  {demo.label}
                </motion.button>
              ))}
            </div>

            <p
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 11,
                color: "#4b5563",
                margin: 0,
                fontWeight: 700,
                position: "relative",
                zIndex: 2,
                letterSpacing: 0.3,
              }}
            >
              ◆ Click any role to auto-fill credentials, then press ACCESS PORTAL
            </p>
          </motion.div>
        </div>

        {/* ═══════════ RIGHT ═══════════ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            gap: 14,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{
              width: "100%",
              maxWidth: 540,
              backgroundColor: "#ffffff",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "10px 10px 0px var(--color-dark, #231e25)",
              position: "relative",
              padding: "clamp(32px, 4.5vw, 48px) clamp(24px, 3.5vw, 40px)",
              boxSizing: "border-box",
            }}
          >
            <CornerBrackets color="#000" inset={10} size={13} thickness={2.5} />
            <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
            <GrainOverlay opacity={0.08} />

            {/* Shine sweep clipped to card via internal overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                pointerEvents: "none",
                borderRadius: "inherit",
              }}
            >
              <ShineSweep duration={1.8} delay={0.4} opacity={0.2} />
            </div>

            <RotatingBadge
              text="SECURE LOGIN"
              size={92}
              bg="var(--color-kiwi, #abf139)"
              color="#000"
              top={-22}
              right={-22}
              duration={16}
              tilt={6}
            />

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "var(--color-dark, #231e25)",
                color: "var(--color-light, #fff8eb)",
                padding: "5px 14px",
                borderRadius: 4,
                fontSize: 12,
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 800,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 16,
                border: "1.5px solid #000",
                position: "relative",
                zIndex: 2,
              }}
            >
              <PulseDot color="var(--color-kiwi, #abf139)" size={6} glow={false} />
              [ LOGIN GATEWAY ]
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)",
                fontSize: "clamp(40px, 5.5vw, 54px)",
                color: "var(--color-dark, #231e25)",
                lineHeight: 0.92,
                margin: "0 0 8px 0",
                letterSpacing: 1,
                position: "relative",
                zIndex: 2,
              }}
            >
              ENTER THE PORTAL
            </h2>

            <p
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 15,
                color: "#6b7280",
                margin: "0 0 24px 0",
                fontWeight: 500,
                position: "relative",
                zIndex: 2,
              }}
            >
              Sign in to manage your registrations and schedule.
            </p>

            {error && (
              <motion.div
                initial={{ x: -8, opacity: 0 }}
                animate={{ x: [0, -5, 5, -3, 0], opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{
                  backgroundColor: "#fee2e2",
                  border: "2px solid var(--color-primary, #ff3e33)",
                  boxShadow: "3px 3px 0px var(--color-primary, #ff3e33)",
                  padding: "10px 14px",
                  borderRadius: 4,
                  marginBottom: 20,
                  color: "#991b1b",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <PulseDot color="var(--color-primary, #ff3e33)" size={8} />
                {error}
              </motion.div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                position: "relative",
                zIndex: 2,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="email" style={labelStyle}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="name@company.com"
                  style={inputStyle(emailFocused)}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label htmlFor="password" style={labelStyle}>
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: 12.5,
                      fontWeight: 800,
                      color: "var(--color-primary, #ff3e33)",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                    }}
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="Password"
                    style={{ ...inputStyle(passwordFocused), paddingRight: 72 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 14,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 800,
                      fontFamily: "'Satoshi', sans-serif",
                      padding: 0,
                      color: "#6b7280",
                      letterSpacing: 0.6,
                      textTransform: "uppercase",
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={submitting ? {} : { y: -3, boxShadow: "7px 7px 0px var(--color-dark, #231e25)" }}
                whileTap={submitting ? {} : { y: 1, boxShadow: "1.5px 1.5px 0px var(--color-dark, #231e25)" }}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  marginTop: 10,
                  padding: "15px",
                  backgroundColor: submitting ? "#9ca3af" : "var(--color-primary, #ff3e33)",
                  color: "#ffffff",
                  border: "2.5px solid var(--color-dark, #231e25)",
                  boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
                  borderRadius: 4,
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  letterSpacing: 1.5,
                  cursor: submitting ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                {!submitting && <ShineSweep duration={1.4} delay={0} opacity={0.35} />}
                {submitting && <PulseDot color="#fff" size={8} glow={false} />}
                {submitting ? "AUTHENTICATING..." : "ACCESS PORTAL"}
                {!submitting && <span style={{ fontSize: 16 }}>→</span>}
              </motion.button>
            </form>

            {/* ── Register CTA row ── */}
            <div
              style={{
                marginTop: 22,
                paddingTop: 18,
                borderTop: "2px dashed var(--color-dark, #231e25)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                position: "relative",
                zIndex: 2,
              }}
            >
              <span
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#4b5563",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Don't have an expo pass?
              </span>

              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to={rawTarget ? `/register?redirect=${encodeURIComponent(rawTarget)}` : "/register"}
                  style={{
                    backgroundColor: "var(--color-dark, #231e25)",
                    color: "var(--color-light, #fff8eb)",
                    border: "2px solid #000",
                    boxShadow: "3px 3px 0 var(--color-primary, #ff3e33)",
                    padding: "9px 18px",
                    borderRadius: 4,
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    letterSpacing: 0.8,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  REGISTER HERE
                  <span style={{ fontSize: 12 }}>→</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Status strip below the card ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{
              width: "100%",
              maxWidth: 540,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: 0.8,
              color: "#6b7280",
            }}
          >
            {[
              { label: "SSL ENCRYPTED", c: "var(--color-kiwi, #abf139)" },
              { label: "ROLE-BASED ACCESS", c: "var(--color-primary, #ff3e33)" },
              { label: "SESSION PRESERVED", c: "var(--color-cerulean, #14a6ea)" },
            ].map((item) => (
              <span
                key={item.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 11px",
                  background: "#ffffff",
                  border: "1.5px solid #000",
                  borderRadius: 30,
                  boxShadow: "2px 2px 0 #000",
                }}
              >
                <PulseDot color={item.c} size={6} glow={false} />
                {item.label}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;