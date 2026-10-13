import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";

export default function ExpoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [expoData, setExpoData] = useState(null);
  const [booths, setBooths] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState("exhibitors"); // "exhibitors" | "schedule" | "floorplan" | "overview"
  const [searchQuery, setSearchQuery] = useState("");
  const [exhibitorFilter, setExhibitorFilter] = useState("all"); // "all" | "booth" | "pending"
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [passRegistered, setPassRegistered] = useState(false);

  // Session Bookmarking with localStorage
  const [bookmarkedSessions, setBookmarkedSessions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`bookmarks_${id}`)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const fetchFullExpo = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/expos/${id}`);
        const data = res.data;

        setExpoData(data.expo || data);
        setBooths(data.booths || []);
        setSessions(data.sessions || []);
        setExhibitors(data.exhibitors || []);
      } catch (err) {
        console.error("Failed to load expo:", err);
        setError(err.userMessage || "Failed to load exposition details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFullExpo();
  }, [id]);

  const toggleBookmark = (sessionId) => {
    let updated;
    if (bookmarkedSessions.includes(sessionId)) {
      updated = bookmarkedSessions.filter((sId) => sId !== sessionId);
    } else {
      updated = [...bookmarkedSessions, sessionId];
    }
    setBookmarkedSessions(updated);
    localStorage.setItem(`bookmarks_${id}`, JSON.stringify(updated));
  };

  // Safe search and categorization
  const filteredExhibitors = useMemo(() => {
    return (exhibitors || []).filter((ex) => {
      if (!ex) return false;
      const q = String(searchQuery || "").toLowerCase().trim();

      const company = String(ex.company || "").toLowerCase();
      const rep = String(ex.representative || "").toLowerCase();
      const products = typeof ex.products === "object" ? JSON.stringify(ex.products).toLowerCase() : String(ex.products || "").toLowerCase();
      const boothNo = String(ex.boothNumber || "").toLowerCase();

      const matchesSearch = !q || company.includes(q) || rep.includes(q) || products.includes(q) || boothNo.includes(q);

      if (exhibitorFilter === "booth") {
        return matchesSearch && Boolean(ex.boothNumber);
      }
      if (exhibitorFilter === "pending") {
        return matchesSearch && !ex.boothNumber;
      }
      return matchesSearch;
    });
  }, [exhibitors, searchQuery, exhibitorFilter]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-light, #fff8eb)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <CustomCursor />
        <Navigation />
        <div style={{ width: 64, height: 64, borderRadius: "50%", border: "4px solid #000", borderTopColor: "var(--color-primary, #ff3e33)", animation: "spin 1s linear infinite", marginBottom: 20 }} />
        <h2 style={{ fontFamily: "var(--font-display, 'Bebas Neue')", fontSize: 36, letterSpacing: 1.5, margin: 0 }}>
          SYNCHRONIZING EXPO TELEMETRY...
        </h2>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !expoData) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-light, #fff8eb)", padding: "140px 24px" }}>
        <CustomCursor />
        <Navigation />
        <div style={{ maxWidth: 600, margin: "0 auto", backgroundColor: "#fff", border: "3.5px solid #000", padding: 36, boxShadow: "8px 8px 0px #000" }}>
          <span style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", padding: "4px 10px", fontSize: 11, fontWeight: 900 }}>404 ERROR</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 40, margin: "14px 0 8px 0" }}>EVENT NOT FOUND</h2>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600, color: "#4b5563" }}>{error || "We could not find the requested exposition record."}</p>
          <Link
            to="/expos"
            style={{
              display: "inline-block",
              marginTop: 18,
              backgroundColor: "var(--color-dark, #231e25)",
              color: "#fff",
              padding: "12px 24px",
              textDecoration: "none",
              fontFamily: "var(--font-display)",
              fontSize: 20,
              boxShadow: "3px 3px 0px #000",
            }}
          >
            ← RETURN TO ALL EXPOS
          </Link>
        </div>
      </div>
    );
  }

  const bookedBooths = booths.filter((b) => b.status === "booked" || b.status === "reserved").length;
  const availableBooths = booths.filter((b) => b.status === "available").length;

  return (
    <div className="landing-page-root" style={{ minHeight: "100vh", backgroundColor: "var(--color-light, #fff8eb)", paddingBottom: 120 }}>
      <CustomCursor />
      <Navigation />

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "120px clamp(18px, 4vw, 56px) 60px clamp(18px, 4vw, 56px)" }}>

        {/* 1. TOP NAV BREADCRUMB STRIP */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <Link
            to="/expos"
            style={{
              textDecoration: "none",
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 800,
              color: "var(--color-dark, #231e25)",
              fontSize: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#ffffff",
              border: "2px solid #000",
              boxShadow: "2px 2px 0px #000",
              padding: "6px 14px",
              borderRadius: 4,
            }}
          >
            <span>←</span> ALL TRADE SHOWS
          </Link>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", border: "1.5px solid #000", padding: "4px 10px", borderRadius: 3, fontSize: 11, fontWeight: 900 }}>
              ● LIVE DIRECTORY
            </span>
            <span style={{ backgroundColor: "#000", color: "#fff", padding: "4px 10px", borderRadius: 3, fontSize: 11, fontWeight: 800 }}>
              REF: {expoData._id.slice(-6).toUpperCase()}
            </span>
          </div>
        </div>

        {/* 2. INDUSTRIAL HERO PASS / BADGE */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "3.5px solid var(--color-dark, #231e25)",
            boxShadow: "10px 10px 0px var(--color-dark, #231e25)",
            padding: "clamp(24px, 4.5vw, 48px)",
            marginBottom: 36,
            position: "relative",
          }}
        >
          {/* Lanyard Top Notch Accent */}
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 80, height: 10, backgroundColor: "var(--color-dark)", borderRadius: "0 0 6px 6px" }} />

          {/* Theme & Meta Flags */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
            <span style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#ffffff", padding: "5px 14px", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 900, letterSpacing: 0.5 }}>
              ★ {expoData.theme || "INDUSTRY TRADE EXPO"}
            </span>
            <span style={{ backgroundColor: "var(--color-selective-yellow, #feb804)", color: "#000", border: "1.5px solid #000", padding: "4px 12px", borderRadius: 4, fontSize: 12, fontWeight: 800 }}>
              B2B & PUBLIC ACCESS
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display, 'Bebas Neue')",
              fontSize: "clamp(46px, 7.5vw, 92px)",
              color: "var(--color-dark, #231e25)",
              lineHeight: 0.88,
              margin: "8px 0 16px 0",
              letterSpacing: 1.5,
            }}
          >
            {expoData.title}
          </h1>

          {/* Key Facts Strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              backgroundColor: "var(--color-light, #fff8eb)",
              border: "2px solid #000",
              padding: "16px 20px",
              margin: "20px 0 24px 0",
              fontFamily: "'Satoshi', sans-serif",
            }}
          >
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#6b7280", display: "block" }}>LOCATION</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>📍 {expoData.location || "Main Convention Center"}</span>
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#6b7280", display: "block" }}>DATES</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>
                📅 {new Date(expoData.startDate).toLocaleDateString()} – {new Date(expoData.endDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#6b7280", display: "block" }}>EXHIBITOR TELEMETRY</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>🏢 {exhibitors.length} Confirmed Companies</span>
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#6b7280", display: "block" }}>BOOTH CAPACITY</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "var(--color-primary, #ff3e33)" }}>⚡ {availableBooths} of {booths.length} Open</span>
            </div>
          </div>

          {/* Action Hub */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", borderTop: "2.5px dashed #000", paddingTop: 22, alignItems: "center" }}>
            {user?.role === "exhibitor" ? (
              <Link
                to={`/exhibitor/applications?expo=${expoData._id}`}
                style={{
                  backgroundColor: "var(--color-primary, #ff3e33)",
                  color: "#ffffff",
                  border: "2.5px solid #000",
                  boxShadow: "4px 4px 0px #000",
                  padding: "12px 28px",
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                + APPLY FOR BOOTH SPACE
              </Link>
            ) : (
              <button
                onClick={() => {
                  if (!user) navigate("/register");
                  else setPassRegistered(true);
                }}
                style={{
                  backgroundColor: passRegistered ? "var(--color-kiwi, #abf139)" : "var(--color-selective-yellow, #feb804)",
                  color: "#000",
                  border: "2.5px solid #000",
                  boxShadow: "4px 4px 0px #000",
                  padding: "12px 28px",
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  cursor: "pointer",
                }}
              >
                {passRegistered ? "✓ ATTENDEE PASS CONFIRMED" : (user ? "🎟️ CLAIM YOUR FREE ATTENDEE BADGE" : "REGISTER AS ATTENDEE")}
              </button>
            )}

            <button
              onClick={() => setActiveTab("floorplan")}
              style={{
                backgroundColor: "#ffffff",
                color: "#000",
                border: "2.5px solid #000",
                boxShadow: "3px 3px 0px #000",
                padding: "12px 22px",
                fontFamily: "var(--font-display)",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              🗺️ VIEW INTERACTIVE MAP
            </button>
          </div>
        </div>

        {/* 3. NEOBRUTALIST TABBED BAR */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
          {[
            { id: "exhibitors", label: `EXHIBITOR DIRECTORY (${exhibitors.length})`, icon: "🏢" },
            { id: "schedule", label: `CONFERENCE SCHEDULE (${sessions.length})`, icon: "⏰" },
            { id: "floorplan", label: `FLOOR PLAN & BOOTHS (${booths.length})`, icon: "🗺️" },
            { id: "overview", label: "ABOUT & VENUE INTEL", icon: "📋" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: "12px 24px",
                  borderRadius: 30,
                  backgroundColor: isActive ? "var(--color-dark, #231e25)" : "#ffffff",
                  color: isActive ? "var(--color-light, #fff8eb)" : "var(--color-dark, #231e25)",
                  border: "2px solid var(--color-dark, #231e25)",
                  boxShadow: isActive ? "4px 4px 0px var(--color-primary, #ff3e33)" : "2px 2px 0px var(--color-dark, #231e25)",
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  letterSpacing: 0.5,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* 4. CONTENT SECTIONS */}
        <AnimatePresence mode="wait">

          {/* TAB 1: EXHIBITOR DIRECTORY */}
          {activeTab === "exhibitors" && (
            <motion.div
              key="exhibitors"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              {/* Search & Quick Filter Controls */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "3px solid #000",
                  padding: 20,
                  boxShadow: "5px 5px 0px #000",
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ flex: "1 1 320px", position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Search by company, product keyword, representative, or booth #..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #000",
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      outline: "none",
                      backgroundColor: "var(--color-light, #fff8eb)",
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontWeight: 900 }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Sub-Filters */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { id: "all", label: `ALL (${exhibitors.length})` },
                    { id: "booth", label: `BOOTH ASSIGNED (${exhibitors.filter(e => e.boothNumber).length})` },
                    { id: "pending", label: `ASSIGNMENT PENDING (${exhibitors.filter(e => !e.boothNumber).length})` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setExhibitorFilter(f.id)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 4,
                        border: "1.5px solid #000",
                        backgroundColor: exhibitorFilter === f.id ? "#000" : "#fff",
                        color: exhibitorFilter === f.id ? "#fff" : "#000",
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exhibitor Cards Grid */}
              {filteredExhibitors.length === 0 ? (
                <div style={{ backgroundColor: "#ffffff", border: "3px solid #000", padding: 60, textAlign: "center", boxShadow: "5px 5px 0px #000" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, margin: 0 }}>NO EXHIBITORS FOUND</h3>
                  <p style={{ fontFamily: "'Satoshi', sans-serif", color: "#6b7280", fontWeight: 600, marginTop: 8 }}>
                    No companies match your current search criteria. Try a different search term.
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 24 }}>
                  {filteredExhibitors.map((ex, idx) => (
                    <motion.div
                      key={ex.id || idx}
                      whileHover={{ y: -5, boxShadow: "8px 8px 0px var(--color-dark, #231e25)" }}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "3px solid var(--color-dark, #231e25)",
                        boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
                        padding: 24,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 250,
                        position: "relative",
                      }}
                    >
                      <div>
                        {/* Booth Banner + Status Flag */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <span
                            style={{
                              backgroundColor: ex.boothNumber ? "var(--color-primary, #ff3e33)" : "var(--color-selective-yellow, #feb804)",
                              color: ex.boothNumber ? "#ffffff" : "#000000",
                              padding: "4px 10px",
                              borderRadius: 3,
                              fontSize: 12,
                              fontWeight: 900,
                              fontFamily: "'Satoshi', sans-serif",
                              border: "1.5px solid #000",
                            }}
                          >
                            {ex.boothNumber ? `BOOTH #${ex.boothNumber}` : "SPACE PENDING"}
                          </span>

                          {ex.boothSize && (
                            <span style={{ fontSize: 11, fontWeight: 800, color: "#6b7280" }}>
                              {ex.boothSize}
                            </span>
                          )}
                        </div>

                        {/* Company Title */}
                        <h4
                          style={{
                            fontFamily: "var(--font-display, 'Bebas Neue')",
                            fontSize: 32,
                            lineHeight: 0.95,
                            margin: "8px 0 12px 0",
                            letterSpacing: 0.5,
                            color: "var(--color-dark)",
                          }}
                        >
                          {ex.company}
                        </h4>

                        {/* Products Box */}
                        <div
                          style={{
                            backgroundColor: "var(--color-light, #fff8eb)",
                            border: "1.5px solid #000",
                            padding: "10px 12px",
                            borderRadius: 4,
                            marginBottom: 16,
                          }}
                        >
                          <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", color: "#6b7280", display: "block", marginBottom: 3 }}>
                            PRODUCTS & SERVICES
                          </span>
                          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 700, color: "#1f2937", margin: 0, lineHeight: 1.4 }}>
                            {typeof ex.products === "object" ? JSON.stringify(ex.products) : (ex.products || "Showcase of industry solutions and services.")}
                          </p>
                        </div>
                      </div>

                      {/* Rep Contact Strip */}
                      <div style={{ borderTop: "2px dashed #000", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase" }}>REPRESENTATIVE</span>
                          <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800, color: "#111827" }}>
                            {ex.representative || "Direct Sales"}
                          </span>
                        </div>

                        {ex.email ? (
                          <a
                            href={`mailto:${ex.email}?subject=Inquiry for ${ex.company} at ${expoData.title}`}
                            style={{
                              backgroundColor: "var(--color-dark, #231e25)",
                              color: "#ffffff",
                              padding: "8px 14px",
                              borderRadius: 3,
                              textDecoration: "none",
                              fontFamily: "'Satoshi', sans-serif",
                              fontSize: 12,
                              fontWeight: 800,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span>✉️ INQUIRE</span>
                          </a>
                        ) : (
                          <span style={{ fontSize: 12, fontWeight: 800, color: "#9ca3af" }}>ON-SITE ONLY</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: SCHEDULE & SESSIONS */}
          {activeTab === "schedule" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              {sessions.length === 0 ? (
                <div style={{ backgroundColor: "#ffffff", border: "3px solid #000", padding: 60, textAlign: "center", boxShadow: "5px 5px 0px #000" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, margin: 0 }}>NO SESSIONS SCHEDULED</h3>
                  <p style={{ fontFamily: "'Satoshi', sans-serif", color: "#6b7280", fontWeight: 600, marginTop: 8 }}>
                    Keynotes and speaker sessions for this trade show will be published shortly.
                  </p>
                </div>
              ) : (
                sessions.map((session, idx) => {
                  const isBookmarked = bookmarkedSessions.includes(session._id);
                  const start = session.startTime ? new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBA";
                  const end = session.endTime ? new Date(session.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

                  return (
                    <motion.div
                      key={session._id || idx}
                      whileHover={{ x: 6 }}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "3px solid var(--color-dark, #231e25)",
                        boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
                        padding: "24px 28px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 20,
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 680 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ backgroundColor: "var(--color-dark)", color: "#fff", padding: "4px 10px", borderRadius: 3, fontSize: 12, fontWeight: 800 }}>
                            ⏰ {start} {end ? `– ${end}` : ""}
                          </span>
                          {session.location && (
                            <span style={{ backgroundColor: "var(--color-light-salmon, #ffa490)", border: "1.5px solid #000", padding: "3px 10px", borderRadius: 3, fontSize: 11, fontWeight: 900 }}>
                              📍 {session.location}
                            </span>
                          )}
                          {session.topic && (
                            <span style={{ backgroundColor: "var(--color-light, #fff8eb)", border: "1.5px solid #000", padding: "3px 10px", borderRadius: 3, fontSize: 11, fontWeight: 800 }}>
                              #{session.topic}
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 34, margin: "4px 0 0 0", lineHeight: 0.95 }}>
                          {session.title}
                        </h3>

                        {session.speaker && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                            <span style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>
                              🎙️
                            </span>
                            <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 800, color: "var(--color-dark)" }}>
                              Speaker: {session.speaker}
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => toggleBookmark(session._id)}
                        style={{
                          backgroundColor: isBookmarked ? "var(--color-kiwi, #abf139)" : "#ffffff",
                          color: "#000",
                          border: "2px solid #000",
                          boxShadow: "3px 3px 0px #000",
                          padding: "10px 20px",
                          fontFamily: "'Satoshi', sans-serif",
                          fontWeight: 800,
                          fontSize: 13,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span>{isBookmarked ? "★ BOOKMARKED" : "☆ BOOKMARK SESSION"}</span>
                      </button>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}

          {/* TAB 3: FLOOR PLAN & BOOTH MAP */}
          {activeTab === "floorplan" && (
            <motion.div
              key="floorplan"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              {/* Floor Plan Header & Legend */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "3px solid #000",
                  padding: "24px 28px",
                  boxShadow: "6px 6px 0px #000",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, margin: 0 }}>
                    ARCHITECTURAL FLOOR MAP
                  </h3>
                  <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, color: "#6b7280", margin: "4px 0 0 0", fontWeight: 700 }}>
                    Select any booth zone to inspect specifications or reserve placement.
                  </p>
                </div>

                {/* Legend */}
                <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800 }}>
                    <span style={{ width: 14, height: 14, backgroundColor: "var(--color-kiwi, #abf139)", border: "1.5px solid #000" }} />
                    <span>AVAILABLE ({availableBooths})</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800 }}>
                    <span style={{ width: 14, height: 14, backgroundColor: "var(--color-selective-yellow, #feb804)", border: "1.5px solid #000" }} />
                    <span>RESERVED</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800 }}>
                    <span style={{ width: 14, height: 14, backgroundColor: "var(--color-primary, #ff3e33)", border: "1.5px solid #000" }} />
                    <span>BOOKED ({bookedBooths})</span>
                  </div>
                </div>
              </div>

              {/* Grid Display */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "3.5px solid #000",
                  padding: 32,
                  boxShadow: "7px 7px 0px #000",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                  gap: 16,
                }}
              >
                {booths.length === 0 ? (
                  <p style={{ gridColumn: "1 / -1", textAlign: "center", fontWeight: 700 }}>
                    No booths generated for this exhibition yet.
                  </p>
                ) : (
                  booths.map((b) => {
                    const isSelected = selectedBooth?._id === b._id;
                    let bgColor = "var(--color-kiwi, #abf139)";
                    if (b.status === "reserved") bgColor = "var(--color-selective-yellow, #feb804)";
                    if (b.status === "booked") bgColor = "var(--color-primary, #ff3e33)";

                    return (
                      <motion.button
                        key={b._id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedBooth(b)}
                        style={{
                          backgroundColor: bgColor,
                          color: b.status === "booked" ? "#ffffff" : "#000000",
                          border: isSelected ? "3.5px solid #000" : "2px solid #000",
                          boxShadow: isSelected ? "4px 4px 0px #000" : "2px 2px 0px #000",
                          padding: "16px 8px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          minHeight: 96,
                        }}
                      >
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 24, lineHeight: 1 }}>
                          {b.boothNumber}
                        </span>
                        <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 10, fontWeight: 900, textTransform: "uppercase", marginTop: 4 }}>
                          {b.status}
                        </span>
                      </motion.button>
                    );
                  })
                )}
              </div>

              {/* Inspector Card */}
              {selectedBooth && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    backgroundColor: "var(--color-light, #fff8eb)",
                    border: "3px solid #000",
                    padding: 24,
                    boxShadow: "6px 6px 0px #000",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 900, backgroundColor: "#000", color: "#fff", padding: "3px 8px", borderRadius: 2 }}>
                      BOOTH TELEMETRY
                    </span>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: 34, margin: "6px 0 2px 0" }}>
                      BOOTH #{selectedBooth.boothNumber} ({selectedBooth.size || "3x3 m"})
                    </h4>
                    <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, margin: 0, fontWeight: 700 }}>
                      Status: <strong style={{ textTransform: "uppercase" }}>{selectedBooth.status}</strong> • Rate: ${selectedBooth.price || "500"}
                      {selectedBooth.exhibitor && ` • Reserved by: ${selectedBooth.exhibitor.company || selectedBooth.exhibitor.name}`}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    {selectedBooth.status === "available" && user?.role === "exhibitor" && (
                      <Link
                        to={`/exhibitor/applications?expo=${expoData._id}&booth=${selectedBooth.boothNumber}`}
                        style={{
                          backgroundColor: "var(--color-primary, #ff3e33)",
                          color: "#fff",
                          border: "2px solid #000",
                          padding: "10px 22px",
                          textDecoration: "none",
                          fontFamily: "var(--font-display)",
                          fontSize: 20,
                        }}
                      >
                        RESERVE THIS SPACE →
                      </Link>
                    )}
                    <button
                      onClick={() => setSelectedBooth(null)}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "2px solid #000",
                        padding: "8px 18px",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                    >
                      CLOSE
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* TAB 4: ABOUT & VENUE INTEL */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}
            >
              <div style={{ backgroundColor: "#ffffff", border: "3px solid #000", padding: 32, boxShadow: "6px 6px 0px #000" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 34, margin: "0 0 16px 0" }}>EVENT BRIEFING</h3>
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, lineHeight: 1.6, color: "#374151", whiteSpace: "pre-line" }}>
                  {expoData.description || "The premier gathering of industry leaders, developers, and trade specialists."}
                </p>

                <div style={{ marginTop: 28, borderTop: "2px solid #e5e7eb", paddingTop: 20 }}>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: 24, margin: "0 0 10px 0" }}>CORE INDUSTRY TRACKS</h4>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {(expoData.theme ? [expoData.theme, "B2B Matchmaking", "Live Tech Demos", "Procurement"] : ["Trade Showcase", "Networking"]).map((tag) => (
                      <span key={tag} style={{ backgroundColor: "var(--color-light, #fff8eb)", border: "1.5px solid #000", padding: "4px 12px", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, fontSize: 13 }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Telemetry Highlights Card */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ backgroundColor: "var(--color-purple-mimosa, #a67eff)", border: "3px solid #000", padding: 28, boxShadow: "6px 6px 0px #000", color: "#fff" }}>
                  <span style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase" }}>EXHIBITOR STATS</span>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 56, lineHeight: 1, margin: "6px 0" }}>
                    {exhibitors.length} PARTNERS
                  </div>
                  <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 700, margin: 0 }}>
                    {bookedBooths} assigned on the active floor. Over 2,500+ attendees registered.
                  </p>
                </div>

                <div style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "3px solid #000", padding: 28, boxShadow: "6px 6px 0px #000" }}>
                  <span style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase" }}>VENUE ACCESS</span>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 40, lineHeight: 1, margin: "6px 0" }}>
                    {expoData.location || "CONVENTION HALL"}
                  </div>
                  <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 700, margin: 0 }}>
                    Digital QR check-in available at main entrance gates. Badge printing on-site.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}