import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SECTION_COLORS: { id: string; color: string }[] = [
  { id: "hero", color: "rgb(255, 62, 51)" },         // Primary Red
  { id: "gallery", color: "rgb(10, 9, 13)" },       // Deep Obsidian Black
  { id: "about", color: "rgb(255, 248, 235)" },      // Cream
  { id: "speakers", color: "rgb(254, 184, 4)" },     // Selective Yellow
  { id: "sponsors", color: "rgb(166, 126, 255)" },   // Vibrant Purple Mimosa (Frame 00:02)
  { id: "testimonials", color: "rgb(10, 9, 13)" },  // Deep Obsidian Black
  { id: "tickets", color: "rgb(255, 62, 51)" },      // Primary Red
  { id: "faq", color: "rgb(255, 248, 235)" },        // Cream
  { id: "footer", color: "rgb(255, 62, 51)" },       // Primary Red
];

export const GlobalBackground: React.FC = () => {
  const [activeBg, setActiveBg] = useState("rgb(255, 62, 51)");

  useEffect(() => {
    const handleScroll = () => {
      const triggerY = window.scrollY + window.innerHeight * 0.5;

      for (let i = SECTION_COLORS.length - 1; i >= 0; i--) {
        const item = SECTION_COLORS[i];
        const el = document.getElementById(item.id);
        if (el && triggerY >= el.offsetTop) {
          setActiveBg(item.color);
          return;
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
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    />
  );
};