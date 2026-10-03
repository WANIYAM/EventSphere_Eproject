import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

interface CursorConfig {
  text: string;
  bg: string;
  color: string;
}

const SECTION_CURSORS: Record<string, CursorConfig> = {
  hero: {
    text: "EXPLORE // '25",
    bg: "var(--color-dark)",
    color: "var(--color-light)",
  },
  gallery: {
    text: "SCRUB REEL",
    bg: "var(--color-kiwi)",
    color: "#000000",
  },
  about: {
    text: "THE VISION",
    bg: "var(--color-primary)",
    color: "var(--color-light)",
  },
  speakers: {
    text: "MEET LEADS",
    bg: "var(--color-dark)",
    color: "var(--color-selective-yellow)",
  },
  agenda: {
    text: "SCHEDULE",
    bg: "var(--color-cerulean)",
    color: "#ffffff",
  },
  sponsors: {
    text: "UNSTACK DECK",
    bg: "var(--color-violet-pink)",
    color: "#000000",
  },
  testimonials: {
    text: "READ REVIEWS",
    bg: "var(--color-kiwi)",
    color: "#000000",
  },
  tickets: {
    text: "GET ACCESS",
    bg: "var(--color-dark)",
    color: "var(--color-kiwi)",
  },
  recordings: {
    text: "WATCH VAULT",
    bg: "var(--color-purple-mimosa)",
    color: "#ffffff",
  },
  faq: {
    text: "ASK QUESTIONS",
    bg: "var(--color-selective-yellow)",
    color: "#000000",
  },
  footer: {
    text: "DIRECT LINE",
    bg: "var(--color-dark)",
    color: "var(--color-light)",
  },
};

export const CustomCursor: React.FC = () => {
  const [currentConfig, setCurrentConfig] = useState<CursorConfig>(SECTION_CURSORS.hero);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Fast mouse tracking with Framer spring physics
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 900, damping: 40, mass: 0.1 });
  const springY = useSpring(mouseY, { stiffness: 900, damping: 40, mass: 0.1 });

  useEffect(() => {
    // Disable custom cursor on mobile touchscreens
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // 1. Detect if hovering over a button, link, or input
      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest("a, button, input, textarea, [role='button']");
      setIsInteractive(!!interactiveEl);

      // 2. Detect which section the cursor is currently over
      const sectionEl = target?.closest("section[id], footer[id], div[id]");
      const sectionId = sectionEl?.getAttribute("id");

      if (sectionId && SECTION_CURSORS[sectionId]) {
        setCurrentConfig(SECTION_CURSORS[sectionId]);
      } else {
        // Fallback to vertical scroll position if cursor is over global padding
        const sections = Object.keys(SECTION_CURSORS);
        const scrollMiddle = window.scrollY + e.clientY;
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const top = el.offsetTop;
            const bottom = top + el.offsetHeight;
            if (scrollMiddle >= top && scrollMiddle < bottom) {
              setCurrentConfig(SECTION_CURSORS[id]);
              break;
            }
          }
        }
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Hide native cursor cleanly on desktop */}
      <style>{`
        @media (pointer: fine) {
          body, a, button, input, textarea, select {
            cursor: none !important;
          }
        }
      `}</style>

      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: springX,
          y: springY,
          pointerEvents: "none",
          zIndex: 99999,
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
        }}
      >
        {/* 1. RETRO MOUSE POINTER ARROW (Top-Left coordinate 0,0) */}
        <motion.div
          animate={{
            scale: isInteractive ? 1.25 : 1,
            rotate: isInteractive ? -15 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          style={{
            width: 20,
            height: 22,
            filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.45))",
            flexShrink: 0,
            marginTop: -2,
            marginLeft: -2,
          }}
        >
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
            <path
              d="M 1 1 L 7 19 L 10.5 12.5 L 18 10 L 1 1 Z"
              fill={isInteractive ? "var(--color-primary)" : "#ffffff"}
              stroke="var(--color-dark)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* 2. DYNAMIC SECTION PILL BADGE */}
        <motion.div
          animate={{
            scale: isInteractive ? 1.08 : 1,
            x: isInteractive ? 4 : 0,
          }}
          transition={{ type: "spring", stiffness: 450, damping: 24 }}
          style={{
            marginTop: 12,
            marginLeft: -4,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isInteractive ? "interactive" : currentConfig.text}
              initial={{ opacity: 0, scale: 0.8, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 4 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 40,
                backgroundColor: isInteractive ? "var(--color-dark)" : currentConfig.bg,
                color: isInteractive ? "var(--color-kiwi)" : currentConfig.color,
                border: "2px solid var(--color-dark)",
                boxShadow: "3px 3px 0px var(--color-dark)",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              <span
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                {isInteractive ? "CLICK ↗" : currentConfig.text}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
};