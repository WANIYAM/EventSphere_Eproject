import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lenis from "lenis";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

import "../styles/tokens.css";
import "../styles/typography.css";
import "../styles/animations.css";

import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";
import { GlobalBackground } from "../components/landing/common/GlobalBackground";
import { HeroSection } from "../components/landing/sections/HeroSection";
import { HorizontalScrollSection } from "../components/landing/sections/HorizontalScrollSection";
import { AboutSection } from "../components/landing/sections/AboutSection";
import { StatsCounterSection } from "../components/landing/sections/StatsCounterSection";
import { UpcomingExposSection } from "../components/landing/sections/UpcomingExposSection";
import { AgendaSection } from "../components/landing/sections/AgendaSection";
import { FloorPlanSection } from "../components/landing/sections/FloorPlanSection";
import { RecordingsSection } from "../components/landing/sections/RecordingsSection";
import { ExhibitorsSection } from "../components/landing/sections/ExhibitorsSection";
import { TicketSection } from "../components/landing/sections/TicketSection";
import { TestimonialsDeckSection } from "../components/landing/sections/TestimonialsDeckSection";
import { FAQSection } from "../components/landing/sections/FAQSection";
import { MarqueeCTASection } from "../components/landing/sections/MarqueeCTASection";
import { Footer } from "../components/landing/sections/Footer";

export default function Home() {
  const { user } = useAuth();

  const [landingData, setLandingData] = useState({
    stats: { totalExpos: 0, totalExhibitors: 0, totalSessions: 0, totalAttendees: 0, occupancyRate: 0 },
    allExpos: [],
    featuredExpo: null,
    sessions: [],
    booths: [],
    approvedExhibitors: [],
  });

  // Attendee registration state
  const [attendeeSessions, setAttendeeSessions] = useState([]);
  const [attendeeExpos, setAttendeeExpos] = useState([]);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const fetchLandingData = async () => {
      try {
        const res = await api.get("/public/landing-data");
        if (res.data) setLandingData(res.data);
      } catch (err) {
        console.warn("Using fallback data for landing page");
      }
    };
    fetchLandingData();

    return () => lenis.destroy();
  }, []);

  // Fetch attendee registrations if logged in
  useEffect(() => {
    if (user && user.role === "attendee") {
      api
        .get("/registrations/my")
        .then((res) => {
          const regs = res.data || [];

          // Next 3 registered sessions sorted by start time
          const nextSessions = regs
            .filter((r) => r.type === "session" && r.registered && r.session)
            .map((r) => r.session)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            .slice(0, 3);
          setAttendeeSessions(nextSessions);

          // Registered expos
          const myExpos = regs
            .filter((r) => r.type === "expo" && r.registered && r.expo)
            .map((r) => r.expo);
          setAttendeeExpos(myExpos);
        })
        .catch(() => {});
    } else {
      setAttendeeSessions([]);
      setAttendeeExpos([]);
    }
  }, [user]);

  return (
    <div className="landing-page-root">
      <GlobalBackground />
      <CustomCursor />
      <Navigation />

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* 1. Hero */}
        <div id="hero">
          <HeroSection />
        </div>

        {/* =========================================================
            REGISTERED ATTENDEE ACTIVITY (Only shown when an attendee has data)
        ========================================================== */}
        {user?.role === "attendee" && (attendeeSessions.length > 0 || attendeeExpos.length > 0) && (
          <section
            style={{
              backgroundColor: "var(--color-dark, #231e25)",
              color: "var(--color-light, #fff8eb)",
              borderTop: "3.5px solid #000",
              borderBottom: "3.5px solid #000",
              padding: "48px clamp(20px, 4vw, 56px)",
            }}
          >
            <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: 36 }}>

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--color-kiwi, #abf139)" }} />
                  <span style={{ fontFamily: "var(--font-display, 'Bebas Neue')", fontSize: 26, letterSpacing: 1 }}>
                    YOUR ATTENDEE BRIEFING // WELCOME {user.name.toUpperCase()}
                  </span>
                </div>

                <Link
                  to="/schedule"
                  style={{
                    backgroundColor: "var(--color-kiwi, #abf139)",
                    color: "#000",
                    border: "2px solid #000",
                    padding: "6px 16px",
                    borderRadius: 20,
                    textDecoration: "none",
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  OPEN FULL TIMETABLE
                </Link>
              </div>

              {/* Strip A: Next 3 Sessions */}
              {attendeeSessions.length > 0 && (
                <div>
                  <span style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", color: "var(--color-kiwi, #abf139)", display: "block", marginBottom: 12 }}>
                    [ YOUR NEXT SESSIONS ]
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
                    {attendeeSessions.map((s, idx) => (
                      <motion.div
                        key={s._id || idx}
                        whileHover={{ y: -3 }}
                        style={{
                          backgroundColor: "#ffffff",
                          color: "var(--color-dark, #231e25)",
                          border: "2.5px solid #000",
                          boxShadow: "4px 4px 0px var(--color-kiwi, #abf139)",
                          padding: "18px 20px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          gap: 10,
                        }}
                      >
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "var(--color-primary, #ff3e33)", textTransform: "uppercase" }}>
                            Time: {s.startTime ? new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Scheduled"}
                            {s.location && ` - Location: ${s.location}`}
                          </span>
                          <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, fontWeight: 800, margin: "6px 0 0 0" }}>
                            {s.title}
                          </h4>
                          {s.speaker && (
                            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>
                              Speaker: {s.speaker}
                            </span>
                          )}
                        </div>

                        <Link
                          to="/schedule"
                          style={{ fontSize: 12, fontWeight: 800, color: "var(--color-dark)", textDecoration: "underline" }}
                        >
                          View in schedule
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strip B: Registered Expos */}
              {attendeeExpos.length > 0 && (
                <div>
                  <span style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", color: "var(--color-selective-yellow, #feb804)", display: "block", marginBottom: 12 }}>
                    [ YOUR REGISTERED EXPOS ]
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
                    {attendeeExpos.map((e, idx) => (
                      <div
                        key={e._id || idx}
                        style={{
                          backgroundColor: "var(--color-light, #fff8eb)",
                          color: "var(--color-dark, #231e25)",
                          border: "2.5px solid #000",
                          boxShadow: "4px 4px 0px var(--color-selective-yellow, #feb804)",
                          padding: "18px 20px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div>
                          <h4 style={{ fontFamily: "var(--font-display)", fontSize: 24, margin: 0 }}>
                            {e.title}
                          </h4>
                          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 700, fontFamily: "'Satoshi', sans-serif" }}>
                            Location: {e.location || "Convention Hall"}
                          </span>
                        </div>

                        <Link
                          to={`/expos/${e._id}`}
                          style={{
                            backgroundColor: "#000",
                            color: "#fff",
                            padding: "6px 14px",
                            borderRadius: 3,
                            textDecoration: "none",
                            fontFamily: "var(--font-display)",
                            fontSize: 16,
                          }}
                        >
                          OPEN EXPO
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </section>
        )}

        {/* 2. Horizontal Gallery */}
        <div id="gallery">
          <HorizontalScrollSection />
        </div>

        {/* 3. About Section */}
        <div id="about">
          <AboutSection />
        </div>

        {/* 4. Bento Stats Matrix */}
        <div id="stats-matrix">
          <StatsCounterSection stats={landingData.stats} />
        </div>

        {/* 5. Expos Section - show no more than six expos */}
        <div id="expos">
          <UpcomingExposSection expos={(landingData.allExpos || []).slice(0, 6)} />
        </div>

        {/* 6. Agenda Section */}
        <div id="agenda">
          <AgendaSection sessions={landingData.sessions} />
        </div>
        

        {/* 7. Exhibitors Showcase */}
        <div id="exhibitors">
          <ExhibitorsSection exhibitors={landingData.approvedExhibitors} />
        </div>

        {/* 8. Event Registration */}
        <div id="tickets">
          <TicketSection featuredExpo={landingData.featuredExpo} />
        </div>

        {/* 9. Testimonials */}
        <div id="testimonials">
          <TestimonialsDeckSection />
        </div>

        {/* 10. FAQ */}
        <div id="faq">
          <FAQSection />
        </div>

        {/* 11. CTA Marquee */}
        <MarqueeCTASection />

        {/* 12. Footer */}
        <div id="footer">
          <Footer />
        </div>
      </main>
    </div>
  );
}