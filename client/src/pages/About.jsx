import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";
import { CornerBrackets, ShineSweep, PulseDot, RotatingBadge } from "../components/common/NeoBrutalKit.jsx";

export default function About() {
  return (
    <div className="landing-page-root" style={{ minHeight: "100vh", backgroundColor: "var(--color-light, #fff8eb)", paddingBottom: 120 }}>
      <CustomCursor />
      <Navigation />

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "140px clamp(20px, 4vw, 56px) 60px clamp(20px, 4vw, 56px)" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 50, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "var(--color-dark, #231e25)",
              color: "var(--color-light, #fff8eb)",
              padding: "4px 14px",
              borderRadius: 4,
              fontSize: 12,
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 800,
              marginBottom: 12,
              border: "1.5px solid #000",
            }}
          >
            <PulseDot color="var(--color-primary, #ff3e33)" size={7} glow={false} />
            <span>ABOUT EVENTSPHERE MANAGEMENT</span>
          </div>

            <div style={{ position: "relative", display: "inline-block" }}>
              <h1
                className="style-display"
                style={{
                  fontSize: "clamp(54px, 8.5vw, 116px)",
                  color: "var(--color-dark, #231e25)",
                  margin: 0,
                  lineHeight: 0.9,
                  letterSpacing: 2,
                }}
              >
                EXPO & TRADE SHOW <br />
                <span style={{ color: "var(--color-primary, #ff3e33)" }}>MANAGEMENT</span>
              </h1>
              <RotatingBadge text="ABOUT" size={100} bg="var(--color-kiwi, #abf139)" color="#000" top={-20} right={-20} duration={18} />
            </div>
        </div>

        {/* 2-Column Manifesto Story */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 48,
            alignItems: "center",
            marginBottom: 80,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              backgroundColor: "#ffffff",
              border: "3px solid var(--color-dark)",
              boxShadow: "8px 8px 0px var(--color-dark)",
              padding: "36px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 8, left: 26, width: 12, height: 12, backgroundColor: "var(--color-kiwi)", border: "2px solid #000" }} />
            <div style={{ position: "absolute", top: 8, right: 26, width: 12, height: 12, backgroundColor: "var(--color-kiwi)", border: "2px solid #000" }} />
            <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
            <ShineSweep duration={1.5} delay={0} />

            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, margin: "0 0 16px 0" }}>
              THE EVENTSPHERE STORY
            </h3>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, lineHeight: 1.6, color: "#374151", margin: 0 }}>
              EventSphere Management brings organizers, exhibitors, and attendees together in one place. The platform addresses common expo challenges such as manual registration, disconnected communication, and limited access to current event information.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              backgroundColor: "var(--color-selective-yellow, #feb804)",
              border: "3px solid var(--color-dark)",
              boxShadow: "8px 8px 0px var(--color-dark)",
              padding: "36px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 8, left: 26, width: 12, height: 12, backgroundColor: "var(--color-primary)", border: "2px solid #000" }} />
            <div style={{ position: "absolute", top: 8, right: 26, width: 12, height: 12, backgroundColor: "var(--color-primary)", border: "2px solid #000" }} />
            <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
            <ShineSweep duration={1.5} delay={0.15} />

            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, margin: "0 0 16px 0", color: "#000" }}>
              MISSION & TECHNOLOGY
            </h3>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, lineHeight: 1.6, color: "#000000", margin: 0, fontWeight: 600 }}>
              Organizers can manage expos, booth spaces, schedules, and exhibitor applications. Exhibitors can maintain company profiles and apply for booth spaces, while attendees can browse events, exhibitors, sessions, and floor plans.
            </p>
          </motion.div>
        </div>

        {/* 3 Pillar Cards */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 className="style-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: 0 }}>
            PLATFORM FEATURES
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {[
            { tag: "01", title: "Organizer Tools", desc: "Manage expo details, exhibitor applications, booth allocations, schedules, and performance reports.", bg: "var(--color-primary)", text: "#fff" },
            { tag: "02", title: "Exhibitor Portal", desc: "Maintain company, product, service, and contact details; review booth spaces and apply to exhibit.", bg: "var(--color-purple-mimosa)", text: "#fff" },
            { tag: "03", title: "Attendee Experience", desc: "Browse expo details, exhibitor profiles, floor plans, sessions, and workshops; register and bookmark sessions.", bg: "var(--color-kiwi)", text: "#000" },
          ].map((pillar, i) => (
            <motion.div
              key={pillar.tag}
              whileHover={{ y: -6, boxShadow: "8px 8px 0px var(--color-dark)" }}
              style={{
                backgroundColor: pillar.bg,
                color: pillar.text,
                border: "3px solid var(--color-dark)",
                boxShadow: "5px 5px 0px var(--color-dark)",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 20,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
              <ShineSweep duration={1.4} delay={i * 0.1} opacity={0.35} />
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <PulseDot color={pillar.text === "#fff" ? "#fff" : "#000"} glow={false} size={8} />
                  <span style={{ fontSize: 24, fontFamily: "var(--font-display)", fontWeight: 900, opacity: 0.85 }}>//{pillar.tag}</span>
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, margin: "8px 0 10px 0" }}>
                  {pillar.title}
                </h3>
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 15, lineHeight: 1.45, margin: 0, fontWeight: 500 }}>
                  {pillar.desc}
                </p>
              </div>

              <Link
                to="/register"
                style={{
                  backgroundColor: pillar.text === "#fff" ? "#fff" : "var(--color-dark)",
                  color: pillar.text === "#fff" ? "#000" : "#fff",
                  border: "2px solid #000",
                  padding: "10px",
                  textAlign: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  textDecoration: "none",
                }}
              >
                CREATE AN ACCOUNT
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}