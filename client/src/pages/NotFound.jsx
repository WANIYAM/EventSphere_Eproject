import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CornerBrackets, ShineSweep, PulseDot, RotatingBadge } from "../components/common/NeoBrutalKit.jsx";

const NotFound = () => {
  return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 20px", textAlign: "center" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: -2 }}
        whileHover={{ rotate: 0, y: -4 }}
        style={{
          backgroundColor: "var(--color-selective-yellow, #feb804)",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
          padding: "48px 36px", maxWidth: 500, position: "relative", overflow: "hidden",
        }}
      >
        <CornerBrackets color="#000" inset={8} size={12} thickness={2.5} />
        <ShineSweep duration={1.5} />
        <RotatingBadge text="404 ERROR" size={84} bg="var(--color-primary, #ff3e33)" color="#fff" top={-22} right={-22} duration={14} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "var(--color-dark, #231e25)", color: "#fff", padding: "4px 12px", borderRadius: 4, fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, marginBottom: 14 }}>
          <PulseDot color="var(--color-primary, #ff3e33)" size={7} glow={false} />
          [ ERROR 404 // MISSING TARGET ]
        </div>

        <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(72px, 12vw, 110px)", color: "var(--color-dark, #231e25)", lineHeight: 0.88, margin: 0 }}>
          PAGE NOT FOUND
        </h1>

        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, color: "var(--color-dark, #231e25)", margin: "16px 0 28px 0", fontWeight: 600 }}>
          The trade show booth or directory page you are looking for does not exist or has been relocated.
        </p>

        <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }} style={{ display: "inline-block" }}>
          <Link to="/" style={{
            backgroundColor: "var(--color-primary, #ff3e33)", color: "#ffffff",
            border: "2px solid var(--color-dark, #231e25)", boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
            padding: "12px 26px", borderRadius: 4, textDecoration: "none",
            fontFamily: "var(--font-display)", fontSize: 22, display: "inline-block",
          }}>
            BACK TO HOMEPAGE
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;