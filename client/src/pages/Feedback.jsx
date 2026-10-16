import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import {
  CornerBrackets,
  ShineSweep,
  PulseDot,
  RotatingBadge,
  TickerStrip,
  Scanline,
  GrainOverlay,
  TickStrip,
} from "../components/common/NeoBrutalKit.jsx";

const MAX_CHARS = 1000;

const Feedback = () => {
  const [type, setType] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 6000);
    return () => clearTimeout(t);
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!message.trim()) return setError("Feedback message is required.");
    if (message.trim().length < 5)
      return setError("Message must be at least 5 characters long.");
    if (message.trim().length > MAX_CHARS)
      return setError(`Message cannot exceed ${MAX_CHARS} characters.`);

    setSubmitting(true);
    try {
      await api.post("/feedback", { type, message: message.trim() });
      setSuccess("Thank you! Your feedback has been logged to the operations crew.");
      setMessage("");
      setType("suggestion");
    } catch (err) {
      setError(
        err.userMessage ||
          err.response?.data?.message ||
          "Failed to submit feedback"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = message.length;
  const charPct = Math.min((charCount / MAX_CHARS) * 100, 100);
  const isOver = charCount > MAX_CHARS;

  return (
    <div
      style={{
        // ── KEY FIX: bound + center the whole module ──
        maxWidth: 960,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        padding: "0 4px",
        position: "relative",
      }}
    >
      {/* ═══════════ HEADER CARD (compact) ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "20px 24px 22px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <CornerBrackets color="#000" inset={8} size={10} thickness={2.5} />
        <ShineSweep duration={1.6} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={12} />
        <GrainOverlay opacity={0.1} />

        {/* Compact inline status rail — replaces the old full-width ticker */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
            paddingBottom: 10,
            borderBottom: "2px dashed rgba(0,0,0,0.2)",
            position: "relative",
            zIndex: 2,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1,
              color: "#6b7280",
            }}
          >
            <PulseDot color="var(--color-kiwi, #abf139)" size={6} glow={false} />
            OPS DESK · OPEN
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 0.8,
              color: "var(--color-primary, #ff3e33)",
            }}
          >
            <span>◆ 24H RESPONSE</span>
            <span>◆ CREW REVIEW</span>
          </div>
        </div>

        <RotatingBadge
          text="FEEDBACK LOG"
          size={78}
          bg="var(--color-light-salmon, #ffa490)"
          color="#000"
          top={-16}
          right={-16}
          duration={16}
          tilt={6}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "var(--color-light-salmon, #ffa490)",
            color: "#000",
            padding: "3px 10px",
            borderRadius: 4,
            fontSize: 10,
            fontFamily: "'Satoshi', sans-serif",
            fontWeight: 800,
            letterSpacing: 0.8,
            border: "1.5px solid #000",
            boxShadow: "2px 2px 0 #000",
            transform: "rotate(-0.8deg)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <PulseDot color="#000" glow={false} size={6} />
          [ PLATFORM COLLABORATION ]
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)",
            fontSize: "clamp(30px, 3.4vw, 42px)",
            color: "var(--color-dark, #231e25)",
            lineHeight: 0.95,
            margin: "10px 0 0 0",
            letterSpacing: 1,
            position: "relative",
            zIndex: 2,
          }}
        >
          SUBMIT USER{" "}
          <span style={{ color: "var(--color-primary, #ff3e33)" }}>FEEDBACK</span>
        </h1>

        <p
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 13.5,
            color: "#6b7280",
            margin: "6px 0 0 0",
            fontWeight: 500,
            maxWidth: 560,
            lineHeight: 1.5,
            position: "relative",
            zIndex: 2,
          }}
        >
          Share your suggestions or report booth and technical issues to help improve EventSphere.
        </p>
      </motion.div>

      {/* ═══════════ STATUS BANNERS ═══════════ */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, x: [0, -5, 5, -3, 0] }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            style={{
              backgroundColor: "#fee2e2",
              border: "2.5px solid var(--color-primary, #ff3e33)",
              boxShadow: "4px 4px 0px var(--color-primary, #ff3e33)",
              padding: "12px 16px",
              color: "#991b1b",
              fontWeight: 700,
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <PulseDot color="var(--color-primary, #ff3e33)" size={9} />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 14,
                letterSpacing: 0.6,
                background: "var(--color-primary, #ff3e33)",
                color: "#fff",
                padding: "2px 7px",
                borderRadius: 2,
                border: "1.5px solid #000",
              }}
            >
              ERROR
            </span>
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            style={{
              backgroundColor: "var(--color-kiwi, #abf139)",
              border: "2.5px solid var(--color-dark, #231e25)",
              boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
              padding: "14px 18px",
              color: "#000000",
              fontWeight: 700,
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 12,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <ShineSweep duration={1.6} delay={0.25} opacity={0.4} />
            <motion.span
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.1 }}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: "#000",
                color: "var(--color-kiwi, #abf139)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 900,
                flexShrink: 0,
                border: "2px solid #000",
              }}
            >
              ✓
            </motion.span>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  letterSpacing: 0.6,
                  marginBottom: 1,
                }}
              >
                MESSAGE DISPATCHED
              </div>
              <div style={{ fontWeight: 600, fontSize: 12.5 }}>{success}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ MAIN FORM CARD ═══════════ */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        style={{
          backgroundColor: "var(--color-light, #fff8eb)",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "22px 24px 24px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <CornerBrackets color="#000" inset={8} size={10} thickness={2.5} />
        <ShineSweep duration={1.8} delay={0.4} opacity={0.2} />

        {/* ─────── Compact step rail ─────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingBottom: 14,
            borderBottom: "2px dashed var(--color-dark, #231e25)",
            position: "relative",
            zIndex: 2,
            flexWrap: "wrap",
          }}
        >
          {[
            { num: "01", label: "CHOOSE TYPE", active: true },
            { num: "02", label: "DESCRIBE", active: !!message.trim() },
            { num: "03", label: "SUBMIT", active: false },
          ].map((step, i) => (
            <div
              key={step.num}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  backgroundColor: step.active
                    ? "var(--color-dark, #231e25)"
                    : "transparent",
                  color: step.active
                    ? "var(--color-light, #fff8eb)"
                    : "var(--color-dark, #231e25)",
                  border: "1.5px solid var(--color-dark, #231e25)",
                  padding: "3px 9px",
                  borderRadius: 3,
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: 0.8,
                }}
              >
                <PulseDot
                  color={
                    step.active
                      ? "var(--color-kiwi, #abf139)"
                      : "var(--color-dark, #231e25)"
                  }
                  size={5}
                  glow={false}
                />
                {step.num} · {step.label}
              </span>
              {i < 2 && (
                <span
                  style={{
                    width: 14,
                    height: 2,
                    background:
                      "repeating-linear-gradient(90deg, #000 0 3px, transparent 3px 6px)",
                    opacity: 0.4,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ─────── Category picker (compact pills) ─────── */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <label
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 11,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "var(--color-dark, #231e25)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: "var(--color-primary, #ff3e33)",
                borderRadius: "50%",
              }}
            />
            CATEGORY TYPE
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 10,
            }}
          >
            <motion.button
              type="button"
              onClick={() => setType("suggestion")}
              whileHover={{ y: -2, rotate: -0.6 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              style={{
                position: "relative",
                overflow: "hidden",
                padding: "10px 14px",
                border: "2.5px solid #000",
                borderRadius: 4,
                backgroundColor:
                  type === "suggestion" ? "var(--color-kiwi, #abf139)" : "#ffffff",
                color: "#000",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: 0.6,
                cursor: "pointer",
                boxShadow:
                  type === "suggestion"
                    ? "3px 3px 0px #000"
                    : "2px 2px 0px #000",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                textAlign: "center",
                height: 44,
              }}
            >
              {type === "suggestion" && (
                <>
                  <ShineSweep duration={1.3} delay={0} opacity={0.35} />
                  <PulseDot color="#000" glow={false} size={7} />
                </>
              )}
              <span style={{ fontSize: 15 }}>💡</span>
              FEATURE SUGGESTION
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setType("issue")}
              whileHover={{ y: -2, rotate: 0.6 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              style={{
                position: "relative",
                overflow: "hidden",
                padding: "10px 14px",
                border: "2.5px solid #000",
                borderRadius: 4,
                backgroundColor:
                  type === "issue" ? "var(--color-primary, #ff3e33)" : "#ffffff",
                color: type === "issue" ? "#fff" : "#000",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: 0.6,
                cursor: "pointer",
                boxShadow:
                  type === "issue" ? "3px 3px 0px #000" : "2px 2px 0px #000",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                textAlign: "center",
                height: 44,
              }}
            >
              {type === "issue" && (
                <>
                  <ShineSweep duration={1.3} delay={0} opacity={0.35} />
                  <PulseDot color="#fff" glow={false} size={7} />
                </>
              )}
              <span style={{ fontSize: 15 }}>⚠</span>
              ISSUE / BUG REPORT
            </motion.button>
          </div>
        </div>

        {/* ─────── Message textarea ─────── */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <label
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 11,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "var(--color-dark, #231e25)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: "var(--color-primary, #ff3e33)",
                  borderRadius: "50%",
                }}
              />
              DETAILED MESSAGE *
            </label>

            <span
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 10.5,
                fontWeight: 800,
                color: isOver ? "var(--color-primary, #ff3e33)" : "#6b7280",
                padding: "2px 8px",
                border: `1.5px solid ${isOver ? "var(--color-primary, #ff3e33)" : "#d1d5db"}`,
                borderRadius: 3,
                background: isOver ? "rgba(255,62,51,0.1)" : "#fff",
              }}
            >
              {charCount} / {MAX_CHARS}
            </span>
          </div>

          <motion.div
            animate={{
              boxShadow:
                focused === "message"
                  ? "5px 5px 0px var(--color-primary, #ff3e33)"
                  : "3px 3px 0px #000",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            style={{
              border: "2.5px solid var(--color-dark, #231e25)",
              borderRadius: 4,
              backgroundColor: "#ffffff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CornerBrackets color="#000" inset={6} size={8} thickness={2} />
            <textarea
              rows="5"
              value={message}
              onFocus={() => setFocused("message")}
              onBlur={() => setFocused(null)}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your suggestion or venue issue in detail (min 5 characters)..."
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "none",
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                backgroundColor: "transparent",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                lineHeight: 1.55,
                minHeight: 120,
                display: "block",
              }}
            />
          </motion.div>

          {/* char progress bar */}
          <div
            style={{
              marginTop: 8,
              height: 5,
              background: "rgba(0,0,0,0.08)",
              border: "1.5px solid #000",
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <motion.div
              animate={{ width: `${charPct}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              style={{
                height: "100%",
                background: isOver
                  ? "var(--color-primary, #ff3e33)"
                  : charPct > 70
                  ? "var(--color-selective-yellow, #feb804)"
                  : "var(--color-kiwi, #abf139)",
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(0,0,0,0.15) 0 4px, transparent 4px 8px)",
              }}
            />
          </div>
        </div>

        {/* ─────── Submit row ─────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
            paddingTop: 10,
            borderTop: "2px dashed var(--color-dark, #231e25)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 10.5,
              fontWeight: 700,
              color: "#6b7280",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              letterSpacing: 0.4,
            }}
          >
            <PulseDot color="var(--color-kiwi, #abf139)" size={6} glow={false} />
            SECURE DISPATCH · OPS CREW
          </span>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={
              submitting ? {} : { y: -3, boxShadow: "6px 6px 0px #000" }
            }
            whileTap={submitting ? {} : { y: 1, boxShadow: "2px 2px 0 #000" }}
            transition={{ type: "spring", stiffness: 450, damping: 22 }}
            style={{
              position: "relative",
              overflow: "hidden",
              backgroundColor: submitting
                ? "#9ca3af"
                : "var(--color-primary, #ff3e33)",
              color: "#ffffff",
              border: "2.5px solid #000",
              boxShadow: "4px 4px 0px #000",
              padding: "11px 26px",
              fontFamily: "var(--font-display)",
              fontSize: 18,
              letterSpacing: 1,
              cursor: submitting ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {!submitting && <ShineSweep duration={1.4} delay={0} opacity={0.35} />}
            {submitting && <PulseDot color="#fff" glow={false} size={8} />}
            {submitting ? "SUBMITTING..." : "SUBMIT FEEDBACK LOG"}
            {!submitting && <span style={{ fontSize: 13 }}>→</span>}
          </motion.button>
        </div>
      </motion.form>

      {/* ═══════════ BOTTOM HINT STRIP (compact) ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.22 }}
        style={{
          backgroundColor: "var(--color-dark, #231e25)",
          border: "2.5px solid #000",
          boxShadow: "4px 4px 0px var(--color-primary, #ff3e33)",
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <CornerBrackets color="#fff" inset={7} size={9} thickness={2} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            position: "relative",
            zIndex: 2,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 1,
              fontFamily: "'Satoshi', sans-serif",
              background: "var(--color-kiwi, #abf139)",
              color: "#000",
              padding: "2px 8px",
              borderRadius: 3,
              border: "1.5px solid #000",
            }}
          >
            <PulseDot color="#000" glow={false} size={5} />
            TIP
          </span>
          <span
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Include expo name, session title, or booth number to speed up triage.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 10,
            fontWeight: 800,
            color: "var(--color-kiwi, #abf139)",
            letterSpacing: 0.8,
            position: "relative",
            zIndex: 2,
          }}
        >
          <span>◆ 24H RESPONSE</span>
          <span>◆ CREW REVIEW</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Feedback;