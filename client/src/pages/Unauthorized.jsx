import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Unauthorized = () => {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
          padding: "48px 36px",
          maxWidth: 520,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -6, left: -6, width: 12, height: 12, backgroundColor: "var(--color-primary, #ff3e33)", border: "2px solid #000" }} />
        <div style={{ position: "absolute", top: -6, right: -6, width: 12, height: 12, backgroundColor: "var(--color-primary, #ff3e33)", border: "2px solid #000" }} />

        <div style={{ display: "inline-block", backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", padding: "4px 12px", borderRadius: 4, fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, marginBottom: 14 }}>
          [ 403 // RESTRICTED ACCESS ]
        </div>

        <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(64px, 10vw, 96px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: 0 }}>
          UNAUTHORIZED
        </h1>

        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, color: "#6b7280", margin: "16px 0 28px 0", fontWeight: 500 }}>
          You do not have the required permissions or role badge to access this expo module.
        </p>

        <Link
          to="/"
          style={{
            backgroundColor: "var(--color-dark, #231e25)",
            color: "var(--color-light, #fff8eb)",
            border: "2px solid var(--color-dark, #231e25)",
            boxShadow: "3px 3px 0px rgba(0,0,0,0.3)",
            padding: "12px 26px",
            borderRadius: 4,
            textDecoration: "none",
            fontFamily: "var(--font-display)",
            fontSize: 22,
            display: "inline-block",
          }}
        >
          RETURN TO EXPO →
        </Link>
      </motion.div>
    </div>
  );
};

export default Unauthorized;