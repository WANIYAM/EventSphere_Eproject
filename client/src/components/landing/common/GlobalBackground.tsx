import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Vibrant, alternating festival palette — NO repeated colors in a row!

const SECTION_COLORS: { id: string; color: string }[] = [
  { id: "hero", color: "rgb(255, 62, 51)" },          // Red
  { id: "gallery", color: "rgb(10, 9, 13)" },        // Black
  { id: "about", color: "rgb(255, 248, 235)" },       // Cream
  { id: "stats-matrix", color: "rgb(254, 184, 4)" },   // Yellow
  { id: "expos", color: "rgb(255, 248, 235)" },        // Cream
  { id: "agenda", color: "rgb(255, 85, 248)" },        // Violet Pink (Matches Agenda Card 1)
  { id: "floorplan", color: "rgb(10, 9, 13)" },       // Black
  { id: "exhibitors", color: "rgb(166, 126, 255)" },   // Purple
  { id: "tickets", color: "rgb(255, 62, 51)" },       // Red
  { id: "testimonials", color: "rgb(10, 9, 13)" },   // Black
  { id: "faq", color: "rgb(255, 248, 235)" },         // Cream
  { id: "footer", color: "rgb(255, 62, 51)" },        // Red
];
export const GlobalBackground: React.FC = () => {
  const [activeBg, setActiveBg] = useState("rgb(255, 62, 51)");

  useEffect(() => {
    const handleScroll = () => {
      const triggerY = window.innerHeight * 0.5; // Trigger line at vertical center of screen

      for (let i = SECTION_COLORS.length - 1; i >= 0; i--) {
        const item = SECTION_COLORS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Precise viewport check: works seamlessly with sticky containers & Lenis
          if (rect.top <= triggerY && rect.bottom >= triggerY * 0.4) {
            setActiveBg(item.color);
            return;
          }
        }
      }
      setActiveBg("rgb(255, 62, 51)");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      animate={{ backgroundColor: activeBg }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Buttery smooth liquid dissolve
    />
  );
};