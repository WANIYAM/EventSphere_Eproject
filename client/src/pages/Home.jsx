import React, { useEffect, useState } from "react";
import Lenis from "lenis";
import api from "../services/api.js";

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
import { ExhibitorsSection } from "../components/landing/sections/ExhibitorsSection";
import { TicketSection } from "../components/landing/sections/TicketSection";
import { TestimonialsDeckSection } from "../components/landing/sections/TestimonialsDeckSection";
import { FAQSection } from "../components/landing/sections/FAQSection";
import { MarqueeCTASection } from "../components/landing/sections/MarqueeCTASection";
import { Footer } from "../components/landing/sections/Footer";

export default function Home() {
  const [landingData, setLandingData] = useState({
    stats: { totalExpos: 1, totalExhibitors: 4, totalSessions: 4, totalAttendees: 8, occupancyRate: 15 },
    allExpos: [],
    featuredExpo: null,
    sessions: [],
    booths: [],
    approvedExhibitors: [],
  });

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

  return (
    <div className="landing-page-root">
      {/* Dynamic Full-Screen Background Morph */}
      <GlobalBackground />

      <CustomCursor />
      <Navigation />

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* 1. Primary Red */}
        <div id="hero">
          <HeroSection />
        </div>

        {/* 2. Obsidian Black */}
        <div id="gallery">
          <HorizontalScrollSection />
        </div>

        {/* 3. Warm Cream */}
        <div id="about">
          <AboutSection />
        </div>

        {/* 4. Warm Cream (Bento Matrix) */}
        <div id="stats-matrix">
          <StatsCounterSection stats={landingData.stats} />
        </div>

        {/* 5. Warm Cream */}
        <div id="expos">
          <UpcomingExposSection expos={landingData.allExpos} />
        </div>

        {/* 6. Selective Yellow */}
        <div id="agenda">
          <AgendaSection sessions={landingData.sessions} />
        </div>

        {/* 7. Obsidian Black */}
        {/* Interactive Floor Plan (Admin Booths & Multi-Expo Switcher) */}


        {/* 8. Purple Mimosa */}
        <div id="exhibitors">
          <ExhibitorsSection exhibitors={landingData.approvedExhibitors} />
        </div>

        {/* 9. Primary Red */}
        <div id="tickets">
          <TicketSection featuredExpo={landingData.featuredExpo} />
        </div>

        {/* 10. Obsidian Black */}
        <div id="testimonials">
          <TestimonialsDeckSection />
        </div>

        {/* 11. Warm Cream */}
        <div id="faq">
          <FAQSection />
        </div>

        {/* 12. Purple CTA Marquee */}
        <MarqueeCTASection />

        {/* 13. Primary Red */}
        <div id="footer">
          <Footer />
        </div>
      </main>
    </div>
  );
}