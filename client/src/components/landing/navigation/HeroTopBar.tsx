import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const RetroTvBadge: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const idata = ctx.createImageData(w, h);
      const buf = new Uint32Array(idata.data.buffer);
      for (let i = 0; i < buf.length; i++) {
        const val = Math.floor(Math.random() * 255);
        buf[i] = (255 << 24) | (val << 16) | (val << 8) | val;
      }
      ctx.putImageData(idata, 0, 0);
      frameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div style={{
      width: 44,
      height: 44,
      borderRadius: 8,
      backgroundColor: "var(--color-cerulean)",
      border: "2px solid var(--color-dark)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "2px 2px 0px var(--color-dark)",
      flexShrink: 0,
      position: "relative"
    }}>
      <div style={{ position: "absolute", top: -7, width: 2, height: 7, backgroundColor: "var(--color-dark)", transform: "rotate(-25deg)", left: 16 }} />
      <div style={{ position: "absolute", top: -7, width: 2, height: 7, backgroundColor: "var(--color-dark)", transform: "rotate(25deg)", right: 16 }} />
      <canvas
        ref={canvasRef}
        width={26}
        height={20}
        style={{
          borderRadius: 3,
          backgroundColor: "#000",
          border: "1.5px solid var(--color-dark)"
        }}
      />
    </div>
  );
};

export const HeroTopBar: React.FC = () => {
  const navItems = [
    { name: "About us", bg: "var(--color-light)", color: "var(--color-dark)", href: "#about" },
    { name: "Agenda", bg: "var(--color-light)", color: "var(--color-dark)", href: "#agenda" },
    { name: "Gallery", bg: "var(--color-light-salmon)", color: "var(--color-light)", href: "#gallery" },
    { name: "Recordings", bg: "var(--color-vista-blue)", color: "var(--color-light)", href: "#recordings" },
    { name: "Contact", bg: "var(--color-selective-yellow)", color: "var(--color-dark)", href: "#footer" },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* TOP LEFT: Retro TV & Bracket Ticker */}
      <div style={{
        position: "absolute",
        top: 24,
        left: 24,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        <RetroTvBadge />

        <div style={{
          display: "flex",
          alignItems: "center",
          color: "var(--color-light)",
          fontFamily: "var(--font-body)",
          fontSize: 15,
          fontWeight: 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          maxWidth: "clamp(200px, 35vw, 420px)",
        }}>
          <span style={{ fontSize: 18, marginRight: 8, opacity: 0.9 }}>&#91;</span>
          <div style={{ overflow: "hidden", display: "inline-flex" }}>
            <div className="marquee-track" style={{ animationDuration: "14s" }}>
              <span style={{ marginRight: 24 }}>
                &#123; EventSphere Management &nbsp; Modern Expo & Trade Show Operating System &#125;
              </span>
              <span style={{ marginRight: 24 }}>
                &#123; EventSphere Management &nbsp; Modern Expo & Trade Show Operating System &#125;
              </span>
            </div>
          </div>
          <span style={{ fontSize: 18, marginLeft: 8, opacity: 0.9 }}>&#93;</span>
        </div>
      </div>

      {/* TOP RIGHT: Floating Vertical Pill Column */}
      <nav style={{
        position: "absolute",
        top: 24,
        right: 24,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 8,
      }}>
        {navItems.map((item) => (
          <motion.a
            key={item.name}
            href={item.href}
            onClick={(e) => handleSmoothScroll(e, item.href)}
            whileHover={{ x: -6, boxShadow: "4px 4px 0px var(--color-dark)" }}
            whileTap={{ x: -2 }}
            style={{
              padding: "6px 16px",
              borderRadius: 40,
              backgroundColor: item.bg,
              color: item.color,
              textDecoration: "none",
              border: "2px solid var(--color-dark)",
              boxShadow: "2px 2px 0px var(--color-dark)",
              fontFamily: "var(--font-body)",
              fontSize: 15,
              fontWeight: 600,
              display: "inline-block",
              transition: "transform 0.15s ease",
            }}
          >
            {item.name}
          </motion.a>
        ))}
      </nav>
    </>
  );
};