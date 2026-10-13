import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";

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
            <span>★</span>
            <span>CHAPTER 01 // MANIFESTO & MISSION</span>
          </div>

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
            REVOLUTIONIZING THE <br />
            <span style={{ color: "var(--color-primary, #ff3e33)" }}>&#123; EXPO EXPERIENCE &#125;</span>
          </h1>
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
            }}
          >
            <div style={{ position: "absolute", top: -6, left: -6, width: 12, height: 12, backgroundColor: "var(--color-kiwi)", border: "2px solid #000" }} />
            <div style={{ position: "absolute", top: -6, right: -6, width: 12, height: 12, backgroundColor: "var(--color-kiwi)", border: "2px solid #000" }} />

            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, margin: "0 0 16px 0" }}>
              THE EVENTSPHERE STORY
            </h3>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, lineHeight: 1.6, color: "#374151", margin: 0 }}>
              EventSphere Management was founded to solve the core inefficiencies inherent in traditional trade show and expo operations. Organizers, exhibitors, and attendees long faced hurdles including manual paper registration, disjointed communication channels, and zero real-time visibility into booth traffic.
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
            }}
          >
            <div style={{ position: "absolute", top: -6, left: -6, width: 12, height: 12, backgroundColor: "var(--color-primary)", border: "2px solid #000" }} />
            <div style={{ position: "absolute", top: -6, right: -6, width: 12, height: 12, backgroundColor: "var(--color-primary)", border: "2px solid #000" }} />

            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, margin: "0 0 16px 0", color: "#000" }}>
              MISSION & TECHNOLOGY
            </h3>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, lineHeight: 1.6, color: "#000000", margin: 0, fontWeight: 600 }}>
              Driven by a commitment to harness modern web technologies, EventSphere provides a unified MERN platform featuring live Socket.IO floor plan synchronization, role-based access control, and comprehensive analytics.
            </p>
          </motion.div>
        </div>

        {/* 3 Pillar Cards */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 className="style-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: 0 }}>
            CORE OPERATING PILLARS
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {[
            { tag: "01", title: "Organizer Control", desc: "Complete Expo CRUD, automated booth grid generation, session scheduling, and application approvals.", bg: "var(--color-primary)", text: "#fff" },
            { tag: "02", title: "Exhibitor Portals", desc: "Company profiles, document uploads, real-time booth reservation, and direct attendee messaging.", bg: "var(--color-purple-mimosa)", text: "#fff" },
            { tag: "03", title: "Attendee Pass", desc: "Interactive floor plan navigation, personal timetable builder, session bookmarking, and QR passes.", bg: "var(--color-kiwi)", text: "#000" },
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
              }}
            >
              <div>
                <span style={{ fontSize: 24, fontFamily: "var(--font-display)", fontWeight: 900, opacity: 0.85 }}>
                  //{pillar.tag}
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
                JOIN PLATFORM →
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}