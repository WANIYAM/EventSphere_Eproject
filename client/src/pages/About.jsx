import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";
import { CornerBrackets, ShineSweep, PulseDot, RotatingBadge } from "../components/common/NeoBrutalKit.jsx";

// ── Built-in Neo-Brutalist Vector Avatars (Guaranteed to render offline & online) ──
const TeamAvatar = ({ type }) => {
  if (type === "waniya") {
    // Female Tech Lead
    return (
      <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%" }}>
        {/* Background Aura */}
        <circle cx="60" cy="60" r="50" fill="#ffd8d8" stroke="#000" strokeWidth="2.5" />
        {/* Long Back Hair */}
        <path d="M34 50 Q30 95 44 110 L76 110 Q90 95 86 50 Z" fill="#231e25" />
        {/* Body / Blazer */}
        <path d="M28 115 Q60 90 92 115 Z" fill="var(--color-primary, #ff3e33)" stroke="#000" strokeWidth="2.5" />
        <path d="M52 100 L60 115 L68 100 Z" fill="#ffffff" stroke="#000" strokeWidth="2" />
        {/* Neck */}
        <rect x="53" y="70" width="14" height="15" fill="#fcd5b8" stroke="#000" strokeWidth="2" />
        {/* Face */}
        <ellipse cx="60" cy="54" rx="22" ry="24" fill="#fcd5b8" stroke="#000" strokeWidth="2.5" />
        {/* Front Hair */}
        <path d="M38 52 Q42 32 60 32 Q78 32 82 52 Q72 40 60 42 Q48 40 38 52 Z" fill="#231e25" stroke="#000" strokeWidth="2" />
        {/* Eyes & Lashes */}
        <circle cx="51" cy="53" r="2.8" fill="#000" />
        <path d="M48 49 Q51 47 54 49" stroke="#000" strokeWidth="1.8" fill="none" />
        <circle cx="69" cy="53" r="2.8" fill="#000" />
        <path d="M66 49 Q69 47 72 49" stroke="#000" strokeWidth="1.8" fill="none" />
        {/* Cheeks */}
        <ellipse cx="46" cy="59" rx="3.5" ry="2" fill="#ff9999" opacity="0.6" />
        <ellipse cx="74" cy="59" rx="3.5" ry="2" fill="#ff9999" opacity="0.6" />
        {/* Smile */}
        <path d="M54 62 Q60 67 66 62" stroke="#000" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* Gold Leader Star Clip */}
        <polygon points="40,36 43,42 49,43 45,47 46,53 40,50 34,53 35,47 31,43 37,42" fill="var(--color-selective-yellow, #feb804)" stroke="#000" strokeWidth="1.5" />
      </svg>
    );
  }

  if (type === "wasiq") {
    // Male Full-Stack Engineer
    return (
      <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%" }}>
        {/* Background Aura */}
        <circle cx="60" cy="60" r="50" fill="#fff0be" stroke="#000" strokeWidth="2.5" />
        {/* Body / Dark Hoodie */}
        <path d="M26 115 Q60 88 94 115 Z" fill="#231e25" stroke="#000" strokeWidth="2.5" />
        {/* Hoodie Drawstrings */}
        <line x1="55" y1="98" x2="55" y2="112" stroke="var(--color-selective-yellow, #feb804)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="65" y1="98" x2="65" y2="112" stroke="var(--color-selective-yellow, #feb804)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Neck */}
        <rect x="52" y="72" width="16" height="14" fill="#f7caa4" stroke="#000" strokeWidth="2" />
        {/* Face */}
        <ellipse cx="60" cy="55" rx="22" ry="24" fill="#f7caa4" stroke="#000" strokeWidth="2.5" />
        {/* Short Textured Hair */}
        <path d="M38 48 Q37 28 60 28 Q83 28 82 48 Q76 34 60 34 Q44 34 38 48 Z" fill="#1b171d" stroke="#000" strokeWidth="2.2" />
        <path d="M42 33 L45 26 L52 30 L58 25 L65 30 L72 26 L76 32" stroke="#000" strokeWidth="2" fill="#1b171d" />
        {/* Developer Glasses */}
        <rect x="44" y="48" width="13" height="10" rx="2" fill="rgba(255,255,255,0.7)" stroke="#000" strokeWidth="2.5" />
        <rect x="63" y="48" width="13" height="10" rx="2" fill="rgba(255,255,255,0.7)" stroke="#000" strokeWidth="2.5" />
        <line x1="57" y1="53" x2="63" y2="53" stroke="#000" strokeWidth="2.5" />
        {/* Eyes inside glasses */}
        <circle cx="50" cy="53" r="2.5" fill="#000" />
        <circle cx="70" cy="53" r="2.5" fill="#000" />
        {/* Eyebrows */}
        <line x1="44" y1="45" x2="56" y2="45" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="64" y1="45" x2="76" y2="45" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        {/* Clean Beard / Stubble Line */}
        <path d="M48 68 Q60 74 72 68" stroke="#1b171d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Confident Smile */}
        <path d="M54 64 Q60 69 66 64" stroke="#000" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "fatima") {
    // Female UI/UX Designer
    return (
      <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%" }}>
        {/* Background Aura */}
        <circle cx="60" cy="60" r="50" fill="#eddfff" stroke="#000" strokeWidth="2.5" />
        {/* Wavy Bob Hair Back */}
        <path d="M32 50 Q28 85 45 92 L75 92 Q92 85 88 50 Z" fill="#3a274c" />
        {/* Creative Purple Sweater */}
        <path d="M28 115 Q60 92 92 115 Z" fill="var(--color-purple-mimosa, #a67eff)" stroke="#000" strokeWidth="2.5" />
        {/* Designer Scarf/Neckline */}
        <circle cx="60" cy="98" r="7" fill="#ffffff" stroke="#000" strokeWidth="2" />
        {/* Neck */}
        <rect x="53" y="70" width="14" height="15" fill="#fedac2" stroke="#000" strokeWidth="2" />
        {/* Face */}
        <ellipse cx="60" cy="54" rx="21" ry="23" fill="#fedac2" stroke="#000" strokeWidth="2.5" />
        {/* Front Wavy Hair */}
        <path d="M37 50 Q44 31 60 31 Q76 31 83 50 Q75 38 60 40 Q45 38 37 50 Z" fill="#3a274c" stroke="#000" strokeWidth="2" />
        {/* Chic Round Designer Glasses */}
        <circle cx="50" cy="53" r="8" fill="rgba(255,255,255,0.6)" stroke="#000" strokeWidth="2.2" />
        <circle cx="70" cy="53" r="8" fill="rgba(255,255,255,0.6)" stroke="#000" strokeWidth="2.2" />
        <line x1="58" y1="53" x2="62" y2="53" stroke="#000" strokeWidth="2.2" />
        {/* Eyes */}
        <circle cx="50" cy="53" r="2.5" fill="#000" />
        <circle cx="70" cy="53" r="2.5" fill="#000" />
        {/* Smile */}
        <path d="M54 63 Q60 68 66 63" stroke="#000" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* Cheeks */}
        <circle cx="43" cy="59" r="3" fill="#ff8da1" opacity="0.6" />
        <circle cx="77" cy="59" r="3" fill="#ff8da1" opacity="0.6" />
      </svg>
    );
  }

  // Bisma Asif: Female QA & Database Systems
  return (
    <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%" }}>
      {/* Background Aura */}
      <circle cx="60" cy="60" r="50" fill="#e8fbd4" stroke="#000" strokeWidth="2.5" />
      {/* Sleek High Ponytail */}
      <path d="M68 32 Q92 28 88 64 Q84 76 80 82" stroke="#1f1c24" strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx="73" cy="36" r="4" fill="var(--color-kiwi, #abf139)" stroke="#000" strokeWidth="1.5" />
      {/* Kiwi QA Jacket */}
      <path d="M28 115 Q60 90 92 115 Z" fill="var(--color-kiwi, #abf139)" stroke="#000" strokeWidth="2.5" />
      <line x1="60" y1="96" x2="60" y2="115" stroke="#000" strokeWidth="2.5" />
      {/* Neck */}
      <rect x="53" y="70" width="14" height="15" fill="#fcd7bc" stroke="#000" strokeWidth="2" />
      {/* Face */}
      <ellipse cx="60" cy="54" rx="21" ry="23" fill="#fcd7bc" stroke="#000" strokeWidth="2.5" />
      {/* Sleek Front Hair */}
      <path d="M38 52 Q44 32 60 32 Q76 32 82 52 Q70 40 60 40 Q46 40 38 52 Z" fill="#1f1c24" stroke="#000" strokeWidth="2" />
      {/* Focused Eyes */}
      <circle cx="51" cy="53" r="2.6" fill="#000" />
      <circle cx="69" cy="53" r="2.6" fill="#000" />
      <path d="M47 48 Q51 46 55 48" stroke="#000" strokeWidth="2" fill="none" />
      <path d="M65 48 Q69 46 73 48" stroke="#000" strokeWidth="2" fill="none" />
      {/* Confident Smile */}
      <path d="M54 63 Q60 67 66 63" stroke="#000" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="45" cy="59" r="3" fill="#ffa099" opacity="0.5" />
      <circle cx="75" cy="59" r="3" fill="#ffa099" opacity="0.5" />
    </svg>
  );
};

export default function About() {
  const teamMembers = [
    {
      name: "Waniya Mustafa",
      role: "GROUP LEADER & FULL STACK ARCHITECT",
      badge: "👑 LEADER",
      accent: "var(--color-primary, #ff3e33)",
      accentText: "#ffffff",
      avatarType: "waniya",
      bio: "Orchestrating end-to-end platform architecture, multi-role auth workflows, and core feature integrations across EventSphere.",
      email: "waniya.mustafa@example.com",
      phone: "+92 300 0000001",
      socials: [
        { label: "GitHub", url: "https://github.com/WANIYAM" },
        { label: "LinkedIn", url: "#" },
        { label: "Portfolio", url: "#" },
      ],
    },
    {
      name: "Muhammad Wasiq",
      role: "FULL STACK & REALTIME SYSTEMS",
      badge: "⚡ DEVELOPER",
      accent: "var(--color-selective-yellow, #feb804)",
      accentText: "#000000",
      avatarType: "wasiq",
      bio: "Leading backend API design, WebSockets implementation, real-time attendee messaging, and expo session management.",
      email: "muhammad.wasiq@example.com",
      phone: "+92 300 0000002",
      socials: [
        { label: "GitHub", url: "#" },
        { label: "LinkedIn", url: "#" },
        { label: "Portfolio", url: "#" },
      ],
    },
    {
      name: "Fatima Bukhari",
      role: "UI/UX & FRONTEND ENGINEER",
      badge: "🎨 DEVELOPER",
      accent: "var(--color-purple-mimosa, #a67eff)",
      accentText: "#ffffff",
      avatarType: "fatima",
      bio: "Crafting high-impact neo-brutalist user interfaces, responsive layouts, and interactive expo directory floor plans.",
      email: "fatima.bukhari@example.com",
      phone: "+92 300 0000003",
      socials: [
        { label: "GitHub", url: "#" },
        { label: "LinkedIn", url: "#" },
        { label: "Portfolio", url: "#" },
      ],
    },
    {
      name: "Bisma Asif",
      role: "DATABASE & QA SYSTEMS",
      badge: "🔍 DEVELOPER",
      accent: "var(--color-kiwi, #abf139)",
      accentText: "#000000",
      avatarType: "bisma",
      bio: "Managing database schema validation, data seeding pipelines, system test coverage, and platform reliability.",
      email: "bisma.asif@example.com",
      phone: "+92 300 0000004",
      socials: [
        { label: "GitHub", url: "#" },
        { label: "LinkedIn", url: "#" },
        { label: "Portfolio", url: "#" },
      ],
    },
  ];

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

        {/* ═══════════════════════ TEAMMATES SECTION ═══════════════════════ */}
        <div style={{ marginBottom: 90 }}>
          <div style={{ textAlign: "center", marginBottom: 38 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "var(--color-purple-mimosa, #a67eff)",
                color: "#ffffff",
                padding: "4px 14px",
                borderRadius: 4,
                fontSize: 12,
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 800,
                marginBottom: 12,
                border: "1.5px solid #000",
                boxShadow: "2px 2px 0 #000",
              }}
            >
              <PulseDot color="#ffffff" size={7} glow={false} />
              <span>DEVELOPMENT CREW</span>
            </div>

            <h2 className="style-display" style={{ fontSize: "clamp(36px, 5.5vw, 68px)", margin: 0, color: "var(--color-dark, #231e25)" }}>
              MEET THE TEAM
            </h2>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, color: "#4b5563", marginTop: 8, fontWeight: 500, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
              The software engineers behind EventSphere Management, building scalable trade show architecture, automated booth bookings, and interactive directories.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -8, boxShadow: "8px 8px 0px var(--color-dark, #231e25)" }}
                style={{
                  backgroundColor: "#ffffff",
                  border: "3px solid var(--color-dark, #231e25)",
                  boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
                <ShineSweep duration={1.6} delay={idx * 0.12} opacity={0.25} />

                <div>
                  {/* Built-in Vector Avatar */}
                  <div
                    style={{
                      width: "100%",
                      height: 190,
                      backgroundColor: "var(--color-light, #fff8eb)",
                      border: "2px solid #000",
                      boxShadow: "3px 3px 0px #000",
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 18,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <TeamAvatar type={member.avatarType} />
                  </div>

                  {/* Role Badge */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                    <span
                      style={{
                        backgroundColor: member.accent,
                        color: member.accentText,
                        padding: "3px 10px",
                        borderRadius: 3,
                        fontSize: 10,
                        fontWeight: 900,
                        fontFamily: "'Satoshi', sans-serif",
                        letterSpacing: 0.6,
                        border: "1.5px solid #000",
                      }}
                    >
                      {member.role}
                    </span>
                    <span
                      style={{
                        backgroundColor: "#000",
                        color: "#fff",
                        padding: "2px 8px",
                        borderRadius: 2,
                        fontSize: 9.5,
                        fontWeight: 900,
                        fontFamily: "'Satoshi', sans-serif",
                      }}
                    >
                      {member.badge}
                    </span>
                  </div>

                  {/* Teammate Name */}
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 32,
                      margin: "4px 0 10px 0",
                      color: "var(--color-dark, #231e25)",
                      lineHeight: 1,
                      letterSpacing: 0.5,
                    }}
                  >
                    {member.name}
                  </h3>

                  {/* Bio */}
                  <p
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: 13.5,
                      lineHeight: 1.5,
                      color: "#4b5563",
                      margin: "0 0 16px 0",
                      fontWeight: 500,
                    }}
                  >
                    {member.bio}
                  </p>
                </div>

                <div>
                  {/* Contact Info */}
                  <div
                    style={{
                      borderTop: "1.5px dashed #000",
                      paddingTop: 12,
                      marginBottom: 14,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#374151",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span>✉️</span>
                      <span style={{ wordBreak: "break-all" }}>{member.email}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span>📞</span>
                      <span>{member.phone}</span>
                    </div>
                  </div>

                  {/* Social Handles */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {member.socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          backgroundColor: "#000000",
                          color: "#ffffff",
                          border: "1.5px solid #000000",
                          padding: "4px 10px",
                          borderRadius: 3,
                          fontSize: 11,
                          fontFamily: "'Satoshi', sans-serif",
                          fontWeight: 800,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          transition: "all 0.15s ease",
                        }}
                      >
                        {s.label} <span style={{ fontSize: 9 }}>↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════ PLATFORM FEATURES ═══════════════════════ */}
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