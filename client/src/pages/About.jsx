import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  useInView,
  animate,
} from "framer-motion";
import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";
import {
  CornerBrackets,
  ShineSweep,
  PulseDot,
  RotatingBadge,
  TickerStrip,
  GrainOverlay,
  TickStrip,
  Scanline,
} from "../components/common/NeoBrutalKit.jsx";

/* ── Palette ── */
const DARK    = "var(--color-dark, #231e25)";
const LIGHT   = "var(--color-light, #fff8eb)";
const PRIMARY = "var(--color-primary, #ff3e33)";
const YELLOW  = "var(--color-selective-yellow, #feb804)";
const PURPLE  = "var(--color-purple-mimosa, #a67eff)";
const KIWI    = "var(--color-kiwi, #abf139)";
const shadow = (n = 6) => `${n}px ${n}px 0 ${DARK}`;

/* ══════════════════════════════════════════════════════════════
   MOTION VARIANTS
   ══════════════════════════════════════════════════════════════ */
const staggerParent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

const popIn = {
  hidden: { opacity: 0, scale: 0.7, rotate: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 320, damping: 18 },
  },
};

/* ══════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════ */

function CountUp({ value, duration = 1.4 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const str = String(value);
  
  const match = str.match(/^(\D*)(\d+)(\D*)$/);
  const prefix = match ? match[1] : "";
  const digits = match ? match[2] : "";
  const suffix = match ? match[3] : "";
  const target = match ? parseInt(digits, 10) : 0;

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const padded = Math.round(latest).toString().padStart(digits.length, "0");
    return `${prefix}${padded}${suffix}`;
  });

  useEffect(() => {
    if (inView && match) {
      animate(count, target, { duration, ease: "easeOut" });
    }
  }, [inView, target, duration, match, count]);

  if (!match) return <span ref={ref}>{str}</span>;
  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const Tape = ({ color = YELLOW, rotate = -3, top = -12, width = 110 }) => (
  <motion.div
    aria-hidden
    initial={{ scaleX: 0, opacity: 0 }}
    whileInView={{ scaleX: 1, opacity: 1 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.2 }}
    style={{
      position: "absolute", top, left: "50%", x: "-50%", rotate,
      transformOrigin: "center", width, height: 22,
      backgroundColor: color, border: "1.5px solid #000",
      boxShadow: "2px 2px 0 #000",
      backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0 5px, transparent 5px 10px)",
      zIndex: 4,
    }}
  />
);

const Sticker = ({ children, bg = KIWI, color = "#000", delay = 0.1 }) => (
  <motion.span
    variants={popIn} initial="hidden" whileInView="visible"
    viewport={{ once: true }} transition={{ delay }}
    style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "6px 14px", backgroundColor: bg, color,
      border: "2px solid #000", boxShadow: "3px 3px 0 #000",
      fontSize: 11, fontWeight: 900, fontFamily: "'Satoshi', sans-serif",
      letterSpacing: 1, textTransform: "uppercase",
      position: "relative", overflow: "hidden",
    }}
  >
    <ShineSweep duration={1.4} delay={0.2} opacity={0.3} />
    {children}
  </motion.span>
);

const RotatingStar = ({ color = PRIMARY, size = 24 }) => (
  <motion.svg
    animate={{ rotate: 360 }}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    width={size} height={size} viewBox="0 0 24 24"
    style={{ flexShrink: 0 }}
  >
    <path d="M12 2 L13.8 9.2 L21 11 L13.8 12.8 L12 20 L10.2 12.8 L3 11 L10.2 9.2 Z" fill={color} stroke="#000" strokeWidth="1.5" />
  </motion.svg>
);

function TiltCard({ children, style, maxTilt = 8, ...props }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [maxTilt, -maxTilt]), { stiffness: 220, damping: 22 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-maxTilt, maxTilt]), { stiffness: 220, damping: 22 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ ...style, rotateX: rx, rotateY: ry, transformPerspective: 900, transformStyle: "preserve-3d" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });
  return (
    <motion.div
      style={{
        scaleX, transformOrigin: "0% 50%", position: "fixed",
        top: 0, left: 0, right: 0, height: 4,
        backgroundColor: PRIMARY, boxShadow: `0 2px 0 ${DARK}`, zIndex: 9999,
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════ */
export default function About() {
  const teamMembers = [
    {
      name: "Waniya Mustafa",
      role: "GROUP LEADER & FULL STACK ARCHITECT",
      badge: "👑 LEADER",
      accent: PRIMARY,
      accentText: "#ffffff",
      avatar: "/team/waniya.jpeg",
      bio: "Orchestrating end-to-end platform architecture, multi-role auth workflows, and core feature integrations.",
      email: "waniya.mustafa@example.com",
      phone: "+92 300 0000001",
      socials: [
        { label: "GitHub", url: "https://github.com/WANIYAM" },
        { label: "LinkedIn", url: "#" },
      ],
    },
    {
      name: "Muhammad Wasiq",
      role: "FULL STACK & REALTIME SYSTEMS",
      badge: "⚡ DEVELOPER",
      accent: YELLOW,
      accentText: "#000000",
      avatar: "/team/wasiq.jpeg",
      bio: "Leading backend API design, WebSockets implementation, and real-time attendee messaging.",
      email: "muhammad.wasiq@example.com",
      phone: "+92 300 0000002",
      socials: [
        { label: "GitHub", url: "#" },
        { label: "LinkedIn", url: "#" },
      ],
    },
    {
      name: "Fatima Bukhari",
      role: "UI/UX & FRONTEND ENGINEER",
      badge: "🎨 DEVELOPER",
      accent: PURPLE,
      accentText: "#ffffff",
      avatar: "/team/fatima.jpeg",
      bio: "Crafting high-impact neo-brutalist user interfaces and interactive expo directory floor plans.",
      email: "fatima.bukhari@example.com",
      phone: "+92 300 0000003",
      socials: [
        { label: "GitHub", url: "#" },
        { label: "LinkedIn", url: "#" },
      ],
    },
    {
      name: "Bisma Asif",
      role: "DATABASE & QA SYSTEMS",
      badge: "🔍 DEVELOPER",
      accent: KIWI,
      accentText: "#000000",
      avatar: "/team/bisma.jpeg",
      bio: "Managing database schema validation, data pipelines, and ensuring platform reliability.",
      email: "bisma.asif@example.com",
      phone: "+92 300 0000004",
      socials: [
        { label: "GitHub", url: "#" },
        { label: "LinkedIn", url: "#" },
      ],
    },
  ];

  const heroStats = [
    { k: "04", label: "ENGINEERS", bg: PRIMARY, color: "#fff" },
    { k: "03", label: "USER ROLES", bg: YELLOW, color: "#000" },
    { k: "99%", label: "UPTIME", bg: PURPLE, color: "#fff"},
    { k: "1–2s", label: "RESPONSE", bg: KIWI, color: "#000" },
  ];

  return (
    <div
      className="landing-page-root"
      style={{
        minHeight: "100vh",
        backgroundColor: LIGHT,
        backgroundImage: "radial-gradient(circle, rgba(35,30,37,0.055) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        paddingBottom: 0,
        position: "relative",
      }}
    >
      <style>{`
        @keyframes es-marquee { from { transform: translateX(0);} to { transform: translateX(-50%);} }
        .es-marquee { display: flex; width: max-content; animation: es-marquee 32s linear infinite; }
        .es-marquee:hover { animation-play-state: paused; }

        .es-team-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px;
          align-items: stretch;
        }
        @media (max-width: 1180px) {
          .es-team-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .es-team-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <ScrollProgress />
      <CustomCursor />
      <Navigation />

      {/* ═══════════════════════ TOP TICKER ═══════════════════════ */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          backgroundColor: DARK,
          borderBottom: "2px solid #000",
          padding: "5px 0",
          zIndex: 40,
        }}
      >
        <TickerStrip
          items={[
            "THE FUTURE OF TRADE SHOWS",
            "TEAM EVENTSPHERE",
            "BUILT DIFFERENT",
            "MERN STACK ARCHITECTURE",
          ]}
          color={KIWI}
          duration={26}
          fontSize={11}
        />
      </div>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section style={{ paddingTop: 150, paddingBottom: 60, position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(20px, 4vw, 56px)", textAlign: "center", position: "relative" }}>
          
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
            <Sticker bg={DARK} color={LIGHT} delay={0.15}>
              <PulseDot color={PRIMARY} size={8} glow={false} />
              <span>ABOUT EVENTSPHERE</span>
            </Sticker>
          </motion.div>

          <div style={{ position: "relative", display: "inline-block" }}>
            <motion.h1
              className="style-display"
              initial="hidden" animate="visible"
              style={{ fontSize: "clamp(52px, 8.5vw, 118px)", color: DARK, margin: 0, lineHeight: 0.88, letterSpacing: 2, textTransform: "uppercase" }}
            >
              <motion.span
                variants={{
                  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
                  visible: { clipPath: "inset(0 0 0% 0)", opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
                }}
                style={{ display: "inline-block" }}
              >
                THE FUTURE OF
              </motion.span>
              <br />
              <motion.span
                variants={{
                  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
                  visible: { clipPath: "inset(0 0 0% 0)", opacity: 1, transition: { duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] } },
                }}
                style={{ display: "inline-block", color: PRIMARY, WebkitTextStroke: `3px ${DARK}`, textShadow: `7px 7px 0 ${DARK}` }}
              >
                TRADE SHOWS
              </motion.span>
            </motion.h1>

            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.6 }}
              style={{ position: "absolute", top: -30, right: -40 }}
            >
              
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }}
            style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "clamp(16px, 1.6vw, 19px)", maxWidth: 740, margin: "32px auto 0 auto", color: "#374151", fontWeight: 600, lineHeight: 1.55 }}
          >
            We are a team of four engineers building the connected operating system for modern expos — replacing clipboards, emails, and guesswork with one bold platform.
          </motion.p>

          {/* ── Stats ── */}
          <motion.div
            variants={staggerParent} initial="hidden" animate="visible" transition={{ delayChildren: 0.8 }}
            style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16, marginTop: 44 }}
          >
            {heroStats.map((s) => (
              <motion.div
                key={s.label} variants={fadeUp}
                whileHover={{ y: -6, rotate: -2, boxShadow: `9px 9px 0 ${DARK}` }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  minWidth: 140, padding: "16px 20px", backgroundColor: s.bg, color: s.color,
                  border: `3px solid ${DARK}`, boxShadow: shadow(5), textAlign: "left",
                  position: "relative", overflow: "hidden",
                }}
              >
                <CornerBrackets color={s.color === "#fff" ? "#fff" : "#000"} inset={6} size={9} thickness={2} />
                <ShineSweep duration={1.5} delay={0.2} opacity={0.3} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, position: "relative", zIndex: 2 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 42, fontWeight: 900, lineHeight: 1, letterSpacing: 1 }}>
                    <CountUp value={s.k} />
                  </div>
                  <span style={{ fontSize: 18, opacity: 0.8 }}>{s.icon}</span>
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: 1.2, position: "relative", zIndex: 2 }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ MARQUEE ═══════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }}
        style={{ backgroundColor: DARK, borderTop: `3px solid ${DARK}`, borderBottom: `3px solid ${DARK}`, padding: "18px 0", overflow: "hidden", marginTop: 26, position: "relative" }}
      >
        <TickStrip color="rgba(255,255,255,0.2)" gap={16} />
        <div className="es-marquee" style={{ display: "flex", alignItems: "center" }}>
          {[0, 1].map((k) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 28, paddingRight: 28 }}>
              {["EVENTSPHERE", "BUILT DIFFERENT", "ONE PLATFORM", "REAL-TIME", "MERN STACK"].map((t, i) => (
                <React.Fragment key={i}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, letterSpacing: 1, color: LIGHT, whiteSpace: "nowrap", textShadow: "2px 2px 0 #000" }}>
                    {t}
                  </span>
                  <RotatingStar color={PRIMARY} size={20} />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ═══════════════════════ MAIN ═══════════════════════ */}
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "80px clamp(20px, 4vw, 56px) 100px" }}>
        
        {/* ─────────── BACKGROUND / VISION ─────────── */}
        <div style={{ marginBottom: 110 }}>
          <motion.div
            variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48 }}
          >
            {/* Problem Card */}
            <motion.div
              variants={fadeUp} whileHover={{ y: -6, rotate: -0.5 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ position: "relative", backgroundColor: "#fff", border: `3px solid ${DARK}`, boxShadow: shadow(8), padding: "48px 32px 32px", marginTop: 20 }}
            >
              <Tape color={YELLOW} rotate={-5} top={-12} width={120} />
              <CornerBrackets color="#000" inset={9} size={11} thickness={2.5} />
              <GrainOverlay opacity={0.06} />
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: DARK, color: "#fff", padding: "3px 10px", borderRadius: 3, fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 900, letterSpacing: 2, marginBottom: 12, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
                <PulseDot color={PRIMARY} size={6} glow={false} />
                // 01 · THE PROBLEM
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 38, margin: "0 0 14px 0", textTransform: "uppercase", lineHeight: 1, letterSpacing: 1 }}>
                THE PAIN
              </h3>
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 15.5, lineHeight: 1.65, color: "#374151", margin: 0, fontWeight: 500 }}>
                Traditional expo management is broken. Organizers drown in manual registrations and disjointed spreadsheets. Exhibitors struggle to secure booths and communicate. Attendees are left guessing with stale event information and outdated floor plans.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              variants={fadeUp} whileHover={{ y: -6, rotate: 0.5 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ position: "relative", backgroundColor: YELLOW, border: `3px solid ${DARK}`, boxShadow: shadow(8), padding: "48px 32px 32px", marginTop: 20 }}
            >
              <Tape color={PRIMARY} rotate={4} top={-12} width={120} />
              <CornerBrackets color="#000" inset={9} size={11} thickness={2.5} />
              <GrainOverlay opacity={0.08} />
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "#000", color: "#fff", padding: "3px 10px", borderRadius: 3, fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 900, letterSpacing: 2, marginBottom: 12, border: "1.5px solid #000", boxShadow: "2px 2px 0 #fff" }}>
                <PulseDot color={KIWI} size={6} glow={false} />
                // 02 · OUR SOLUTION
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 38, margin: "0 0 14px 0", color: "#000", textTransform: "uppercase", lineHeight: 1, letterSpacing: 1 }}>
                THE VISION
              </h3>
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 15.5, lineHeight: 1.65, color: "#000", margin: 0, fontWeight: 600 }}>
                We built EventSphere to unify the entire expo ecosystem into one real-time MERN stack platform. Organizers get powerful admin dashboards, exhibitors get seamless booking portals, and attendees get a fully interactive mobile directory. 
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* ─────────── TEAM (ALL IN ONE LINE) ─────────── */}
        <div style={{ marginBottom: 100 }}>
          <div style={{ textAlign: "center", marginBottom: 52, position: "relative" }}>
            <Sticker bg={PURPLE} color="#fff">
              <PulseDot color="#fff" size={7} glow={false} />
              <span>THE DEVELOPMENT CREW</span>
            </Sticker>
            <h2 className="style-display" style={{ fontSize: "clamp(38px, 5.5vw, 84px)", margin: "16px 0 0 0", color: DARK, textTransform: "uppercase", lineHeight: 0.9 }}>
              MEET THE <span style={{ color: PURPLE }}>TEAM</span>
            </h2>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16.5, color: "#4b5563", marginTop: 14, fontWeight: 500, maxWidth: 660, marginLeft: "auto", marginRight: "auto" }}>
              Four engineers turning the spec into a working platform — one role at a time.
            </p>
            <motion.div
              initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.4 }}
              style={{ position: "absolute", top: 30, right: "12%", opacity: 0.15, pointerEvents: "none" }}
            >
              <RotatingBadge text="EVENTSPHERE" size={130} bg="transparent" color={DARK} top={0} right={0} duration={24} />
            </motion.div>
          </div>

          <motion.div className="es-team-grid" variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {teamMembers.map((member, idx) => (
              <motion.div key={member.name} variants={fadeUp} style={{ display: "flex" }}>
                <TiltCard
                  maxTilt={7}
                  style={{
                    backgroundColor: "#fff", border: `3px solid ${DARK}`, boxShadow: shadow(6),
                    padding: "22px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between",
                    position: "relative", marginTop: 16, width: "100%",
                  }}
                >
                  <Tape color={member.accent} rotate={idx % 2 === 0 ? -3 : 3} top={-12} width={90} />
                  <CornerBrackets color="#000" inset={8} size={10} thickness={2.5} />
                  <ShineSweep duration={1.8} delay={idx * 0.12} opacity={0.25} />

                  <div>
                    {/* Image Frame */}
                    <div style={{
                      width: "100%", height: 190, backgroundColor: LIGHT, border: `2.5px solid ${DARK}`,
                      boxShadow: shadow(3), display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 16, position: "relative", overflow: "hidden",
                    }}>
                      <motion.img
                        src={member.avatar} alt={member.name}
                        initial={{ scale: 1.15, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <div style={{
                        position: "absolute", top: 8, right: 8, backgroundColor: "#000", color: "#fff",
                        padding: "4px 8px", fontSize: 9.5, fontWeight: 900, border: "1.5px solid #000",
                        boxShadow: `2px 2px 0 ${member.accent}`, letterSpacing: 0.5,
                        display: "inline-flex", alignItems: "center", gap: 4,
                      }}>
                        <PulseDot color={member.accent} size={5} glow={false} />
                        {member.badge}
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div style={{ marginBottom: 10 }}>
                      <span style={{
                        display: "inline-block", backgroundColor: member.accent, color: member.accentText,
                        padding: "4px 10px", fontSize: 9, fontWeight: 900, fontFamily: "'Satoshi', sans-serif",
                        letterSpacing: 0.8, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", lineHeight: 1.2,
                      }}>
                        {member.role}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, margin: "8px 0 10px 0", color: DARK, lineHeight: 0.95, letterSpacing: 0.4, textTransform: "uppercase" }}>
                      {member.name}
                    </h3>

                    {/* Bio */}
                    <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, lineHeight: 1.5, color: "#4b5563", margin: "0 0 14px 0", fontWeight: 500 }}>
                      {member.bio}
                    </p>
                  </div>

                  {/* Footer / Socials */}
                  <div>
                    <div style={{
                      borderTop: "2px dashed rgba(0,0,0,0.2)", paddingTop: 12, marginBottom: 12,
                      display: "flex", flexDirection: "column", gap: 6,
                      fontFamily: "'Satoshi', sans-serif", fontSize: 11, fontWeight: 800, color: "#374151",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 12 }}>✉️</span>
                        <span style={{ wordBreak: "break-all" }}>{member.email}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {member.socials.map((s) => (
                        <motion.a
                          key={s.label} href={s.url} target="_blank" rel="noreferrer"
                          whileHover={{ y: -3, boxShadow: `4px 4px 0 ${member.accent}` }} whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          style={{
                            backgroundColor: "#000", color: "#fff", border: "1.5px solid #000",
                            padding: "5px 10px", fontSize: 10, fontFamily: "'Satoshi', sans-serif",
                            fontWeight: 800, textDecoration: "none", display: "inline-flex",
                            alignItems: "center", gap: 4, boxShadow: "2px 2px 0 #000",
                            textTransform: "uppercase", letterSpacing: 0.4,
                          }}
                        >
                          {s.label} <span style={{ fontSize: 9 }}>↗</span>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ─────────── CTA ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}
          style={{
            marginTop: 20, position: "relative", backgroundColor: DARK,
            border: `3px solid ${DARK}`, boxShadow: `12px 12px 0 ${PRIMARY}`,
            padding: "64px clamp(24px, 5vw, 64px)", textAlign: "center", overflow: "hidden",
          }}
        >
          <CornerBrackets color={LIGHT} inset={12} size={14} thickness={3} />
          <Scanline color="rgba(255,255,255,0.15)" height={80} duration={3} />
          <GrainOverlay opacity={0.1} />
          
          <motion.div
            initial={{ scale: 0, rotate: -45 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.4 }}
            style={{ position: "absolute", top: -20, right: -20, zIndex: 1 }}
          >
            <RotatingBadge text="JOIN US" size={110} bg={KIWI} color="#000" top={0} right={0} duration={18} />
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="style-display" style={{ fontSize: "clamp(38px, 6.5vw, 84px)", color: LIGHT, margin: 0, lineHeight: 0.9, textTransform: "uppercase", letterSpacing: 1.5, position: "relative", zIndex: 2 }}>
            READY TO <span style={{ color: YELLOW }}>SHOW UP</span>?
          </motion.h2>
          
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.25 }} style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, color: "#d1d5db", marginTop: 18, marginBottom: 36, maxWidth: 560, marginLeft: "auto", marginRight: "auto", fontWeight: 500, position: "relative", zIndex: 2 }}>
            Join EventSphere and put your expo, booth, or brand on the map.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.35 }} style={{ position: "relative", zIndex: 2 }}>
            <motion.div whileHover={{ scale: 1.05, rotate: -1 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 20 }} style={{ display: "inline-block" }}>
              <Link to="/register" style={{
                position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", gap: 10,
                backgroundColor: PRIMARY, color: "#fff", border: `2.5px solid ${LIGHT}`, boxShadow: `6px 6px 0 ${LIGHT}`,
                padding: "16px 44px", fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: 1.5,
                textDecoration: "none", textTransform: "uppercase",
              }}>
                <ShineSweep duration={1.5} delay={0} opacity={0.4} />
                GET STARTED <span style={{ fontSize: 18 }}>→</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

      </main>
    </div>
  );
}