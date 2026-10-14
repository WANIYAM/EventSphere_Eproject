import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

// Determine if destination is permitted for user role
const isRoutePermitted = (role, target) => {
  if (!target || typeof target !== "string") return false;
  if (target.startsWith("/admin") && role !== "admin") return false;
  if (target.startsWith("/exhibitor") && role !== "exhibitor") return false;
  if (target.startsWith("/schedule") && role !== "attendee") return false;
  return true;
};

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

    if (!email.trim()) {
      return setError("Email address is required.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return setError("Please enter a valid email address.");
    }
    if (!password) {
      return setError("Password is required.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    setSubmitting(true);

    try {
      const loggedUser = await login(email.trim(), password);

      // Validate destination against the authenticated user's role
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
        justifyContent: "space-between",
        padding: "clamp(20px, 3vh, 36px) clamp(24px, 4vw, 64px)",
        boxSizing: "border-box",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
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
          }}
        >
          Back to Expo
        </Link>

        {rawTarget && (
          <span
            style={{
              backgroundColor: "var(--color-selective-yellow, #feb804)",
              color: "#000",
              border: "1.5px solid #000",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 800,
              fontFamily: "'Satoshi', sans-serif",
            }}
          >
            Redirect target preserved
          </span>
        )}
      </div>

      <div
        style={{
          width: "100%",
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "clamp(32px, 5vw, 80px)",
          alignItems: "center",
          margin: "clamp(24px, 3vh, 48px) 0",
          position: "relative",
          zIndex: 5,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
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
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--color-kiwi, #abf139)" }} />
            <span>ROLE-BASED EXPO ACCESS</span>
          </div>

          <div>
            <h1
              className="style-display"
              style={{
                fontSize: "clamp(64px, 9vw, 130px)",
                color: "var(--color-dark, #231e25)",
                lineHeight: 0.88,
                margin: 0,
                letterSpacing: 1.5,
              }}
            >
              YOUR STAGE
            </h1>
            <h1
              className="style-display"
              style={{
                fontSize: "clamp(64px, 9vw, 130px)",
                color: "var(--color-primary, #ff3e33)",
                lineHeight: 0.88,
                margin: 0,
                letterSpacing: 1.5,
              }}
            >
              AWAITS [ 2025 ]
            </h1>
          </div>

          <p
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "clamp(17px, 1.4vw, 21px)",
              color: "var(--color-dark, #231e25)",
              lineHeight: 1.45,
              margin: 0,
              maxWidth: 620,
              fontWeight: 500,
              opacity: 0.9,
            }}
          >
            One unified terminal for organizers, exhibitors, and attendees. Access floor plans, schedules, and exhibitor showcases.
          </p>

          <div
            style={{
              backgroundColor: "var(--color-selective-yellow, #feb804)",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
              padding: "20px 24px",
              borderRadius: 4,
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              maxWidth: 620,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 0.5, color: "var(--color-dark)" }}>
                DEMO ACCOUNTS (1-CLICK FILL)
              </span>
              <span style={{ fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, backgroundColor: "#000", color: "#fff", padding: "3px 8px", borderRadius: 2 }}>
                SHORTCUT
              </span>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => fillDemo("admin@eventsphere.com", "Admin@123")}
                style={{
                  backgroundColor: "var(--color-primary, #ff3e33)",
                  color: "#ffffff",
                  border: "2px solid #000",
                  boxShadow: "2px 2px 0px #000",
                  padding: "8px 16px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemo("exhibitor1@demo.com", "Demo@123")}
                style={{
                  backgroundColor: "var(--color-purple-mimosa, #a67eff)",
                  color: "#ffffff",
                  border: "2px solid #000",
                  boxShadow: "2px 2px 0px #000",
                  padding: "8px 16px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Exhibitor
              </button>
              <button
                type="button"
                onClick={() => fillDemo("attendee1@demo.com", "Demo@123")}
                style={{
                  backgroundColor: "var(--color-kiwi, #abf139)",
                  color: "#000000",
                  border: "2px solid #000",
                  boxShadow: "2px 2px 0px #000",
                  padding: "8px 16px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Attendee
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
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
            <div
              style={{
                display: "inline-block",
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
              }}
            >
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
              }}
            >
              Sign in to manage your registrations and schedule.
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
                Error: {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label
                  htmlFor="email"
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 13,
                    fontWeight: 800,
                    color: "var(--color-dark, #231e25)",
                    textTransform: "uppercase",
                  }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  style={{
                    padding: "13px 16px",
                    border: "2px solid var(--color-dark, #231e25)",
                    borderRadius: 4,
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 16,
                    fontWeight: 600,
                    outline: "none",
                    backgroundColor: "#f9fafb",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label
                    htmlFor="password"
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: 13,
                      fontWeight: 800,
                      color: "var(--color-dark, #231e25)",
                      textTransform: "uppercase",
                    }}
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--color-primary, #ff3e33)",
                      textDecoration: "none",
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
                    placeholder="Password"
                    style={{
                      width: "100%",
                      padding: "13px 70px 13px 16px",
                      border: "2px solid var(--color-dark, #231e25)",
                      borderRadius: 4,
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      outline: "none",
                      backgroundColor: "#f9fafb",
                      boxSizing: "border-box",
                    }}
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
                      fontWeight: 700,
                      fontFamily: "'Satoshi', sans-serif",
                      padding: 0,
                      color: "#6b7280",
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ y: -2, boxShadow: "5px 5px 0px var(--color-dark, #231e25)" }}
                whileTap={{ y: 2 }}
                style={{
                  marginTop: 8,
                  padding: "15px",
                  backgroundColor: "var(--color-primary, #ff3e33)",
                  color: "#ffffff",
                  border: "2.5px solid var(--color-dark, #231e25)",
                  boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
                  borderRadius: 4,
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  letterSpacing: 1.5,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "AUTHENTICATING..." : "ACCESS PORTAL"}
              </motion.button>
            </form>

            <div
              style={{
                marginTop: 22,
                paddingTop: 18,
                borderTop: "1.5px dashed var(--color-dark, #231e25)",
                textAlign: "center",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-dark, #231e25)",
              }}
            >
              Don't have an expo pass?{" "}
              <Link
                to={rawTarget ? `/register?redirect=${encodeURIComponent(rawTarget)}` : "/register"}
                style={{
                  color: "var(--color-primary, #ff3e33)",
                  fontWeight: 800,
                  textDecoration: "underline",
                }}
              >
                Register here
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;