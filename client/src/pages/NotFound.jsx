import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
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
        initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: -2 }}
        whileHover={{ rotate: 0 }}
        style={{
          backgroundColor: "var(--color-selective-yellow, #feb804)",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
          padding: "48px 36px",
          maxWidth: 500,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -6, left: -6, width: 12, height: 12, backgroundColor: "#000", border: "2px solid #fff" }} />
        <div style={{ position: "absolute", top: -6, right: -6, width: 12, height: 12, backgroundColor: "#000", border: "2px solid #fff" }} />

        <div style={{ display: "inline-block", backgroundColor: "var(--color-dark, #231e25)", color: "#fff", padding: "4px 12px", borderRadius: 4, fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, marginBottom: 14 }}>
          [ ERROR 404 // MISSING TARGET ]
        </div>

        <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(72px, 12vw, 110px)", color: "var(--color-dark, #231e25)", lineHeight: 0.88, margin: 0 }}>
          PAGE NOT FOUND
        </h1>

        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, color: "var(--color-dark, #231e25)", margin: "16px 0 28px 0", fontWeight: 600 }}>
          The trade show booth or directory page you are looking for does not exist or has been relocated.
        </p>

        <Link
          to="/"
          style={{
            backgroundColor: "var(--color-primary, #ff3e33)",
            color: "#ffffff",
            border: "2px solid var(--color-dark, #231e25)",
            boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
            padding: "12px 26px",
            borderRadius: 4,
            textDecoration: "none",
            fontFamily: "var(--font-display)",
            fontSize: 22,
            display: "inline-block",
          }}
        >
          BACK TO HOMEPAGE →
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;