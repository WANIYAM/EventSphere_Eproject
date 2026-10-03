import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// High-contrast neon portraits matching the video frames
const TRAIL_IMAGES = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=350&auto=format&fit=crop&q=80", // Cyan sunglasses
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=350&auto=format&fit=crop&q=80", // Red suit / neon
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=350&auto=format&fit=crop&q=80", // Blue background
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=350&auto=format&fit=crop&q=80", // Magenta glasses
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=350&auto=format&fit=crop&q=80", // Teal portrait
];

interface TrailItem {
  id: number;
  x: number;
  y: number;
  image: string;
}

export const CursorImageTrail: React.FC<{ containerRef: React.RefObject<HTMLDivElement> }> = ({
  containerRef,
}) => {
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const indexRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dist = Math.hypot(x - lastPos.current.x, y - lastPos.current.y);

      // Framer frequency=40
      if (dist > 45) {
        lastPos.current = { x, y };
        const id = Date.now() + Math.random();
        const image = TRAIL_IMAGES[indexRef.current % TRAIL_IMAGES.length];
        indexRef.current++;

        setTrail((prev) => [...prev.slice(-5), { id, x, y, image }]);

        // Framer visibleFor=1s
        setTimeout(() => {
          setTrail((current) => current.filter((item) => item.id !== id));
        }, 1000);
      }
    };

    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [containerRef]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 15, overflow: "hidden" }}>
      <AnimatePresence>
        {trail.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.7, x: item.x - 70, y: item.y - 70 }}
            animate={{ opacity: 1, scale: 1, x: item.x - 70, y: item.y - 70 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.3 } }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            style={{
              position: "absolute",
              width: 140,
              height: 140,
              backgroundColor: "var(--color-dark)",
              border: "2px solid var(--color-light)",
              boxShadow: "3px 3px 0px rgba(0,0,0,0.35)",
              overflow: "hidden",
            }}
          >
            <img
              src={item.image}
              alt="trail"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};