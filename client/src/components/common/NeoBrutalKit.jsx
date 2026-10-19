import React from "react";
import { motion } from "framer-motion";

/* 4-corner viewfinder brackets */
export const CornerBrackets = ({ color = "#fff", size = 10, inset = 6, thickness = 2.5 }) => (
  <>
    <div style={{ position: "absolute", top: inset, left: inset, width: size, height: size, borderTop: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}`, pointerEvents: "none", zIndex: 8 }} />
    <div style={{ position: "absolute", top: inset, right: inset, width: size, height: size, borderTop: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}`, pointerEvents: "none", zIndex: 8 }} />
    <div style={{ position: "absolute", bottom: inset, left: inset, width: size, height: size, borderBottom: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}`, pointerEvents: "none", zIndex: 8 }} />
    <div style={{ position: "absolute", bottom: inset, right: inset, width: size, height: size, borderBottom: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}`, pointerEvents: "none", zIndex: 8 }} />
  </>
);

/* Diagonal shine that sweeps across a card once it enters view */
export const ShineSweep = ({ duration = 1.6, delay = 0.3, opacity = 0.35 }) => (
  <motion.div
    initial={{ x: "-120%" }}
    whileInView={{ x: "180%" }}
    viewport={{ once: true }}
    transition={{ duration, delay, ease: "easeOut" }}
    style={{
      position: "absolute", top: 0, bottom: 0, width: "45%",
      background: `linear-gradient(115deg, transparent 0%, rgba(255,255,255,${opacity}) 50%, transparent 100%)`,
      pointerEvents: "none", transform: "skewX(-18deg)", zIndex: 6,
    }}
  />
);

/* Pulsing live dot */
export const PulseDot = ({ color = "#abf139", size = 10, border = "#000", glow = true }) => (
  <motion.span
    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    style={{
      display: "inline-block", width: size, height: size, borderRadius: "50%",
      backgroundColor: color, border: `1.5px solid ${border}`,
      boxShadow: glow ? `0 0 8px ${color}` : "none",
    }}
  />
);

/* Rotating circular stamp badge — great for corners of cards */
export const RotatingBadge = ({
  text = "EVENTSPHERE",
  size = 96,
  bg = "var(--color-selective-yellow, #feb804)",
  color = "#000",
  duration = 14,
  top, right, bottom, left,
  tilt = 0,
}) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
    style={{
      position: "absolute", top, right, bottom, left,
      width: size, height: size, borderRadius: "50%",
      background: bg, border: "2.5px solid #000", boxShadow: "3px 3px 0 #000",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 20, userSelect: "none", pointerEvents: "none",
      transform: `rotate(${tilt}deg)`,
    }}
  >
    <span style={{
      fontFamily: "var(--font-display, 'Bebas Neue')",
      fontSize: size * 0.15, fontWeight: 900,
      textAlign: "center", lineHeight: 1, color, letterSpacing: 0.6,
    }}>
      {text}
    </span>
  </motion.div>
);

/* Marquee ticker strip */
export const TickerStrip = ({ items = [], duration = 22, color = "#000", fontSize = 11, style = {} }) => (
  <div style={{ overflow: "hidden", width: "100%", ...style }}>
    <motion.div
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      style={{ display: "flex", gap: 18, whiteSpace: "nowrap", width: "max-content" }}
    >
      {[...Array(2)].flatMap((_, k) =>
        items.map((item, i) => (
          <React.Fragment key={`${k}-${i}`}>
            <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize, fontWeight: 800, letterSpacing: 1, color }}>{item}</span>
            <span style={{ color, opacity: 0.5 }}>◆</span>
          </React.Fragment>
        ))
      )}
    </motion.div>
  </div>
);

/* Horizontal scanline (perfect for pinned / hovered states) */
export const Scanline = ({ color = "rgba(255,62,51,0.35)", active = true, duration = 1.6, height = 60 }) => (
  <motion.div
    animate={active ? { y: ["-100%", "120%"] } : { y: "-120%" }}
    transition={{ duration, repeat: active ? Infinity : 0, repeatDelay: 0.6, ease: "easeInOut" }}
    style={{
      position: "absolute", left: 0, right: 0, height,
      background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
      pointerEvents: "none", zIndex: 3,
    }}
  />
);

/* Subtle grain overlay */
export const GrainOverlay = ({ opacity = 0.25, size = 3 }) => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none", opacity,
    backgroundImage: "radial-gradient(rgba(0,0,0,0.09) 1px, transparent 1px)",
    backgroundSize: `${size}px ${size}px`,
    mixBlendMode: "multiply", zIndex: 1,
  }} />
);

/* Top-of-card ticked strip */
export const TickStrip = ({ color = "rgba(0,0,0,0.4)", height = 4, gap = 12 }) => (
  <div style={{
    position: "absolute", top: 6, left: 12, right: 12, height,
    backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 2px, transparent 2px ${gap}px)`,
    opacity: 0.55, pointerEvents: "none",
  }} />
);