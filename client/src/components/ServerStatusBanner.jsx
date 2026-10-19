import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";

const ServerStatusBanner = () => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    const checkHealth = async () => {
      try {
        const response = await api.get("/health", { timeout: 10000 });
        if (active) {
          const isConnected = response.data.database === "connected";
          setStatus((prevStatus) => {
            if (prevStatus === "disconnected" && isConnected) {
              window.dispatchEvent(new CustomEvent("server:recovered"));
            }
            return isConnected ? "healthy" : "disconnected";
          });
        }
      } catch {
        if (active) setStatus("unreachable");
      }
    };

    checkHealth();
    const intervalId = setInterval(checkHealth, 15000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  if (status === "checking" || status === "healthy") return null;

  const isDisconnected = status === "disconnected";
  const message = isDisconnected
    ? "The database is unavailable. Please try again shortly."
    : "Cannot reach the server. Check that the backend is running.";

  const accent = isDisconnected
    ? "var(--color-selective-yellow, #feb804)"
    : "var(--color-primary, #ff3e33)";

  const textColor = isDisconnected ? "#000" : "#fff";

  return (
    <AnimatePresence>
      <motion.div
        role="status"
        aria-live="polite"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 9999,
          backgroundColor: accent,
          color: textColor,
          borderBottom: "3px solid #000",
          boxShadow: "0 4px 0 rgba(0,0,0,0.15)",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          fontFamily: "'Satoshi', sans-serif",
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 0.4,
        }}
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 22, height: 22, borderRadius: "50%",
            background: "#000", color: "#fff",
            fontSize: 12, border: "1.5px solid #000",
            flexShrink: 0,
          }}
        >
          ⚠
        </motion.span>

        <span
          style={{
            background: "#000",
            color: "#fff",
            padding: "2px 8px",
            borderRadius: 3,
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: 1,
            border: "1.5px solid #000",
            flexShrink: 0,
          }}
        >
          {isDisconnected ? "DB OFFLINE" : "SERVER DOWN"}
        </span>

        <span style={{ textAlign: "center" }}>{message}</span>

        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{
            width: 7, height: 7, borderRadius: "50%",
            background: textColor, border: "1.5px solid #000",
            flexShrink: 0,
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ServerStatusBanner;