import React, { useEffect } from "react";
import Lenis from "lenis";

// Import your 3 landing style files here:
import "../styles/tokens.css";
import "../styles/typography.css";
import "../styles/animations.css";

// Your landing components:
import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";
import { GlobalBackground } from "../components/landing/common/GlobalBackground";
import { HeroSection } from "../components/landing/sections/HeroSection";
import { HorizontalScrollSection } from "../components/landing/sections/HorizontalScrollSection";
import { AboutSection } from "../components/landing/sections/AboutSection";
import { SpeakersSection } from "../components/landing/sections/SpeakersSection";
import { VideoIntermissionSection } from "../components/landing/sections/VideoIntermissionSection";
import { AgendaSection } from "../components/landing/sections/AgendaSection";
import { StackingSponsorsSection } from "../components/landing/sections/StackingSponsorsSection";
import { TestimonialsDeckSection } from "../components/landing/sections/TestimonialsDeckSection";
import { TicketSection } from "../components/landing/sections/TicketSection";
import { RecordingsSection } from "../components/landing/sections/RecordingsSection";
import { FAQSection } from "../components/landing/sections/FAQSection";
import { MarqueeCTASection } from "../components/landing/sections/MarqueeCTASection";
import { Footer } from "../components/landing/sections/Footer";

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="landing-page-root">
      <GlobalBackground />
      <CustomCursor />
      <Navigation />

      <main style={{ position: "relative", zIndex: 1 }}>
        <div id="hero"><HeroSection /></div>
        <div id="gallery"><HorizontalScrollSection /></div>
        <div id="about"><AboutSection /></div>
        <div id="speakers"><SpeakersSection /></div>
        <VideoIntermissionSection />
        <div id="agenda"><AgendaSection /></div>
        <div id="sponsors"><StackingSponsorsSection /></div>
        <div id="testimonials"><TestimonialsDeckSection /></div>
        <div id="tickets"><TicketSection /></div>
        <div id="recordings"><RecordingsSection /></div>
        <div id="faq"><FAQSection /></div>
        <MarqueeCTASection />
        <div id="footer"><Footer /></div>
      </main>
    </div>
  );
}