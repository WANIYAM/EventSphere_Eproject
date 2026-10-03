import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export const VideoIntermissionSection: React.FC = () => {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <section
      style={{
        width: "100%",
        height: "85vh", // Clean, immersive cinematic height
        minHeight: "620px",
        maxHeight: "900px",
        position: "relative",
        backgroundColor: "#000000",
        borderTop: "3px solid var(--color-dark)",
        borderBottom: "3px solid var(--color-dark)",
        overflow: "hidden",
        margin: "0", // Zero outer margin to remove any yellow gaps
        padding: "0",
        zIndex: 5,
      }}
    >
      {/* 1. Full-Bleed Background Video */}
      <video
        ref={videoRef}
        src="https://framerusercontent.com/assets/5A9gOW6TOPn0Y5B5Jc0LKMq3MAk.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // Completely covers the canvas edge-to-edge
          objectPosition: "center",
          display: "block",
          filter: "contrast(1.08) brightness(0.95)",
        }}
      />

      {/* 2. CRT Scanline Overlay */}
      <div
        className="scanlines"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.65,
        }}
      />

      {/* 3. Floating Bottom Controls Bar */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(20px, 3.5vw, 36px)",
          left: "clamp(20px, 4vw, 48px)",
          right: "clamp(20px, 4vw, 48px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {/* Left: Live Stage Broadcast Badge */}
        <div
          style={{
            backgroundColor: "rgba(35, 30, 37, 0.85)",
            color: "var(--color-light)",
            border: "2px solid #ffffff",
            padding: "8px 18px",
            borderRadius: 8,
            boxShadow: "3px 3px 0px var(--color-dark)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            pointerEvents: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "var(--color-kiwi)",
                display: "inline-block",
                boxShadow: "0 0 8px var(--color-kiwi)",
              }}
            />
            <span
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 12,
                fontWeight: 800,
                color: "var(--color-kiwi)",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              LIVE STAGE BROADCAST
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "#ffffff",
              margin: "3px 0 0 0",
            }}
          >
            4K Immersive Visual Stream
          </p>
        </div>

        {/* Right: Audio Toggle Pill Button */}
        <motion.button
          onClick={toggleSound}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: muted ? "#ffffff" : "var(--color-primary)",
            color: muted ? "var(--color-dark)" : "#ffffff",
            border: "2px solid var(--color-dark)",
            boxShadow: "3px 3px 0px var(--color-dark)",
            borderRadius: 30,
            padding: "10px 22px",
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 0.5,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            pointerEvents: "auto",
            transition: "background-color 0.2s ease, color 0.2s ease",
          }}
        >
          <span>{muted ? "🔇" : "🔊"}</span>
          <span>{muted ? "UNMUTE AUDIO" : "MUTE AUDIO"}</span>
        </motion.button>
      </div>
    </section>
  );
};