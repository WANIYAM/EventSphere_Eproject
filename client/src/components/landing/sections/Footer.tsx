import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [guestlistSuccess, setGuestlistSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("contact@eventsphere.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setGuestlistSuccess(true);
    setEmail("");
  };

  return (
    <footer
      id="footer"
      style={{
        backgroundColor: "rgb(255, 62, 51)", // Primary Red #ff3e33
        color: "#ffffff",
        position: "relative",
        zIndex: 5,
        padding: "60px clamp(20px, 4vw, 56px) 24px clamp(20px, 4vw, 56px)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column", gap: 36 }}>
        
        {/* =========================================================
            ROW 1: GET IN TOUCH CARD + CONFERENCE HIGHLIGHTS CARD
        ========================================================== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          {/* Card 1: Direct Contact Card */}
          <div
            style={{
              backgroundColor: "var(--color-dark)",
              border: "3px solid #000000",
              boxShadow: "5px 5px 0px #000000",
              padding: "26px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 20,
              borderRadius: 4,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1, color: "var(--color-kiwi)" }}>
                &#123; GET IN TOUCH &#125;
              </span>
              <span style={{ fontSize: 11, padding: "3px 8px", backgroundColor: "#ffffff", color: "#000000", fontWeight: 700, borderRadius: 2 }}>
                EXPO DESK
              </span>
            </div>

            <motion.div
              onClick={copyEmail}
              whileHover={{ scale: 1.01, x: 2 }}
              whileTap={{ scale: 0.99 }}
              style={{
                backgroundColor: copied ? "var(--color-kiwi)" : "var(--color-light)",
                color: "var(--color-dark)",
                border: "2px solid #000000",
                boxShadow: "3px 3px 0px #000000",
                padding: "14px 18px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "background-color 0.2s ease",
              }}
            >
              <div>
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 11, fontWeight: 800, textTransform: "uppercase", opacity: 0.6, margin: 0 }}>
                  {copied ? "COPIED TO CLIPBOARD" : "CLICK TO COPY"}
                </p>
                <h3 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "clamp(20px, 2.2vw, 26px)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
                  contact@eventsphere.com
                </h3>
              </div>
            </motion.div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: 700, color: "var(--color-light)" }}>
                TEL: +60 4-653 8888
              </span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "'Satoshi', sans-serif" }}>
                EVENTSPHERE • PENANG
              </span>
            </div>
          </div>

          {/* Card 2: Conference Event Overview */}
          <div
            style={{
              backgroundColor: "var(--color-selective-yellow)",
              color: "var(--color-dark)",
              border: "3px solid #000000",
              boxShadow: "5px 5px 0px #000000",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 16,
              borderRadius: 4,
            }}
          >
            <div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 1, display: "block" }}>
                EVENTSPHERE 2025 AT A GLANCE
              </span>
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 700, opacity: 0.75 }}>
                EXPO MANAGEMENT • GLOBAL TRADE SHOW SUITE
              </span>
            </div>

            {/* 4 Conference Stat Badges */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                { number: "30+", label: "SESSIONS", color: "var(--color-primary)", text: "#ffffff" },
                { number: "500+", label: "EXHIBITORS", color: "var(--color-purple-mimosa)", text: "#ffffff" },
                { number: "2.5K", label: "ATTENDEES", color: "var(--color-cerulean)", text: "#ffffff" },
                { number: "100%", label: "REAL-TIME", color: "var(--color-kiwi)", text: "#000000" },
              ].map((badge) => (
                <motion.div
                  key={badge.label}
                  whileHover={{ y: -3, boxShadow: "3px 3px 0px #000000" }}
                  style={{
                    backgroundColor: badge.color,
                    color: badge.text,
                    border: "2px solid #000000",
                    boxShadow: "2px 2px 0px #000000",
                    padding: "12px 6px",
                    borderRadius: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 24, lineHeight: 0.9 }}>
                    {badge.number}
                  </span>
                  <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            ROW 2: CLEAN TEXT LINKS + GUESTLIST PASS FORM
        ========================================================== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
            alignItems: "center",
          }}
        >
          {/* Left: Clean Tag Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 19, letterSpacing: 1 }}>
              &#123; PORTALS & PAGES &#125;
            </span>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                { name: "LinkedIn", bg: "var(--color-kiwi)", text: "#000000", href: "#" },
                { name: "YouTube", bg: "var(--color-violet-pink)", text: "#ffffff", href: "#" },
                { name: "X / Twitter", bg: "var(--color-cerulean)", text: "#ffffff", href: "#" },
                { name: "Organizer Portal", bg: "var(--color-light)", text: "#000000", href: "#about" },
                { name: "Exhibitor Booths", bg: "var(--color-selective-yellow)", text: "#000000", href: "#gallery" },
                { name: "Register Pass", bg: "var(--color-light)", text: "#000000", href: "#tickets" },
                { name: "Expo Schedule", bg: "var(--color-vista-blue)", text: "#000000", href: "#agenda" },
              ].map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  whileHover={{ y: -2, boxShadow: "3px 3px 0px #000000" }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    backgroundColor: link.bg,
                    color: link.text,
                    border: "2px solid #000000",
                    boxShadow: "2px 2px 0px #000000",
                    padding: "6px 14px",
                    borderRadius: 30,
                    textDecoration: "none",
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "inline-block",
                  }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right: Guestlist Form */}
          <div
            style={{
              backgroundColor: "var(--color-light)",
              color: "var(--color-dark)",
              border: "3px solid #000000",
              boxShadow: "5px 5px 0px #000000",
              padding: "20px 24px",
              borderRadius: 4,
            }}
          >
            <AnimatePresence mode="wait">
              {guestlistSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ padding: "6px 0" }}
                >
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: 24, margin: 0, color: "var(--color-primary)" }}>
                    REGISTRATION CONFIRMED
                  </h4>
                  <p style={{ margin: "4px 0 0 0", fontSize: 13, fontFamily: "'Satoshi', sans-serif", fontWeight: 600 }}>
                    Expo pass details and floor plan access have been sent to your inbox.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 0.5, color: "var(--color-primary)" }}>
                      EXPO REGISTRATION // LIVE UPDATES
                    </span>
                    <span style={{ fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, opacity: 0.65 }}>
                      EVENTSPHERE 2025
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                      type="email"
                      required
                      placeholder="ENTER WORK EMAIL..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        flex: 1,
                        background: "#ffffff",
                        border: "2px solid #000000",
                        padding: "10px 14px",
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        outline: "none",
                        borderRadius: 2,
                      }}
                    />

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03, backgroundColor: "var(--color-kiwi)" }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "#ffffff",
                        border: "2px solid #000000",
                        boxShadow: "2px 2px 0px #000000",
                        padding: "10px 18px",
                        fontFamily: "var(--font-display)",
                        fontSize: 18,
                        cursor: "pointer",
                        borderRadius: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      REGISTER →
                    </motion.button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* =========================================================
            ROW 3: CHARACTER CUTOUT + LEGAL FOOTER
        ========================================================== */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid rgba(0,0,0,0.2)",
            paddingTop: 18,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {/* Character + Clean Tag Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                border: "2.5px solid #000000",
                boxShadow: "2px 2px 0px #000000",
                backgroundColor: "var(--color-selective-yellow)",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
                alt="EventSphere Attendee"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div
              style={{
                backgroundColor: "var(--color-light)",
                color: "var(--color-dark)",
                border: "2px solid #000000",
                boxShadow: "2px 2px 0px #000000",
                padding: "4px 12px",
                borderRadius: 4,
                fontFamily: "var(--font-display)",
                fontSize: 15,
                letterSpacing: 0.5,
              }}
            >
              REVOLUTIONIZING THE EXPO EXPERIENCE // 2025
            </div>
          </div>

          {/* Legal / Copyright */}
          <div style={{ display: "flex", gap: 12, fontSize: 13, fontFamily: "'Satoshi', sans-serif", fontWeight: 600 }}>
            <span>© 2025 EVENTSPHERE MANAGEMENT</span>
            <span>/</span>
            <a href="#" style={{ color: "#ffffff", textDecoration: "none" }}>TERMS</a>
            <span>/</span>
            <a href="#" style={{ color: "#ffffff", textDecoration: "none" }}>PRIVACY</a>
          </div>
        </div>

      </div>
    </footer>
  );
};