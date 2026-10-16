import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  CornerBrackets,
  ShineSweep,
  PulseDot,
  RotatingBadge,
  TickerStrip,
  Scanline,
  GrainOverlay,
  TickStrip,
} from "../components/common/NeoBrutalKit.jsx";

const BASE = "http://localhost:5000";

export default function ExhibitorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/public/exhibitors/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load exhibitor profile:", err);
        setError(
          err.userMessage ||
            err.response?.data?.message ||
            "Exhibitor profile could not be loaded."
        );
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleContactClick = () => {
    const companyName = profile?.company || profile?.name || "Exhibitor";
    const targetUrl = `/messages?to=${profile._id}&name=${encodeURIComponent(companyName)}`;
    if (user) {
      navigate(targetUrl);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(targetUrl)}`);
    }
  };

  const getLogoSrc = (logo) => {
    if (!logo) return "";
    if (logo.startsWith("http://") || logo.startsWith("https://")) return logo;
    return `${BASE}${logo.startsWith("/") ? "" : "/"}${logo}`;
  };

  /* ───────────────────── LOADING ───────────────────── */
  if (loading) {
    return (
      <div
        className="landing-page-root"
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--color-light, #fff8eb)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "3px solid var(--color-dark, #231e25)",
            boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
            padding: "60px 48px",
            maxWidth: 560,
            width: "100%",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
            textAlign: "center",
          }}
        >
          <CornerBrackets color="#000" inset={8} size={12} thickness={2.5} />
          <ShineSweep duration={1.6} delay={0.2} opacity={0.25} />
          <Scanline color="rgba(166,126,255,0.4)" height={70} />

          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              border: "4px solid var(--color-dark, #231e25)",
              borderTopColor: "var(--color-purple-mimosa, #a67eff)",
              animation: "spin 0.9s linear infinite",
            }}
          />

          <h3
            style={{
              fontFamily: "var(--font-display, 'Bebas Neue')",
              fontSize: 30,
              letterSpacing: 1.4,
              margin: 0,
              color: "var(--color-dark, #231e25)",
            }}
          >
            SYNCHRONIZING COMPANY DOSSIER...
          </h3>

          <TickerStrip
            items={["FETCHING PROFILE", "LOADING BOOTH MAP", "VERIFYING PARTNER"]}
            color="var(--color-purple-mimosa, #a67eff)"
            duration={16}
            fontSize={11}
            style={{ maxWidth: 340 }}
          />

          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  /* ───────────────────── ERROR / NOT FOUND ───────────────────── */
  if (error || !profile) {
    return (
      <div
        className="landing-page-root"
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--color-light, #fff8eb)",
          paddingBottom: 100,
        }}
      >
        <main
          style={{
            maxWidth: 680,
            margin: "140px auto 0 auto",
            padding: "0 24px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            whileHover={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            style={{
              backgroundColor: "var(--color-selective-yellow, #feb804)",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
              padding: "44px 36px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CornerBrackets color="#000" inset={8} size={12} thickness={2.5} />
            <ShineSweep duration={1.6} delay={0.2} opacity={0.3} />
            <RotatingBadge
              text="PROFILE NOT FOUND"
              size={92}
              bg="var(--color-primary, #ff3e33)"
              color="#fff"
              top={-22}
              right={-22}
              duration={16}
            />

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#000",
                color: "#fff",
                padding: "4px 12px",
                borderRadius: 3,
                fontSize: 11,
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 800,
                letterSpacing: 1,
                marginBottom: 14,
              }}
            >
              <PulseDot color="#fff" glow={false} size={6} />
              [ MISSING EXHIBITOR DOSSIER ]
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(34px, 5vw, 52px)",
                color: "var(--color-dark, #231e25)",
                margin: "0 0 12px 0",
                lineHeight: 0.92,
                letterSpacing: 1,
              }}
            >
              DIRECTORY RECORD UNAVAILABLE
            </h3>

            <p
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 600,
                color: "#374151",
                margin: "0 0 24px 0",
                lineHeight: 1.5,
              }}
            >
              {error || "Exhibitor not found."}
            </p>

            <motion.div
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              style={{ display: "inline-block" }}
            >
              <Link
                to="/exhibitors"
                style={{
                  backgroundColor: "var(--color-dark, #231e25)",
                  color: "#fff",
                  padding: "12px 24px",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  letterSpacing: 1,
                  border: "2px solid #000",
                  boxShadow: "4px 4px 0 #000",
                  borderRadius: 4,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                ← BACK TO DIRECTORY
              </Link>
            </motion.div>
          </motion.div>
        </main>
      </div>
    );
  }

  /* ───────────────────── MAIN PROFILE ───────────────────── */
  return (
    <div
      className="landing-page-root"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-light, #fff8eb)",
        paddingBottom: 100,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Fixed ticker band ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "var(--color-dark, #231e25)",
          padding: "5px 0",
          borderBottom: "2px solid #000",
          zIndex: 40,
        }}
      >
        <TickerStrip
          items={[
            "EXHIBITOR DOSSIER",
            "VERIFIED INDUSTRY PARTNER",
            "TRADE SHOW PARTICIPATION",
            profile.company || profile.name || "EVENTSPHERE",
          ]}
          color="var(--color-kiwi, #abf139)"
          duration={24}
          fontSize={11}
        />
      </div>

      <main
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          padding: "130px clamp(16px, 4vw, 48px) 60px clamp(16px, 4vw, 48px)",
        }}
      >
        {/* ── Back link ── */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 26 }}
        >
          <Link
            to="/exhibitors"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#ffffff",
              border: "2px solid #000",
              boxShadow: "3px 3px 0px #000",
              padding: "9px 18px",
              borderRadius: 4,
              textDecoration: "none",
              color: "#000",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 0.6,
            }}
          >
            <span style={{ fontSize: 12 }}>←</span>
            BACK TO DIRECTORY
          </Link>
        </motion.div>

        {/* ───────────────────── HERO CARD ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: "#ffffff",
            border: "3.5px solid var(--color-dark, #231e25)",
            boxShadow: "10px 10px 0px var(--color-dark, #231e25)",
            padding: "clamp(24px, 4vw, 44px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 26,
            marginBottom: 32,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <CornerBrackets color="#000" inset={10} size={14} thickness={3} />
          <ShineSweep duration={1.8} delay={0.2} opacity={0.28} />
          <TickStrip color="rgba(0,0,0,0.35)" gap={14} />
          <GrainOverlay opacity={0.12} />

          <RotatingBadge
            text="VERIFIED"
            size={104}
            bg="var(--color-kiwi, #abf139)"
            color="#000"
            top={-24}
            right={-24}
            duration={18}
            tilt={8}
          />

          <div
            style={{
              display: "flex",
              gap: 26,
              alignItems: "center",
              flexWrap: "wrap",
              position: "relative",
              zIndex: 2,
              minWidth: 0,
              flex: "1 1 420px",
            }}
          >
            {/* Logo block */}
            <motion.div
              whileHover={{ rotate: -3, scale: 1.04 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              style={{
                width: 108,
                height: 108,
                borderRadius: 8,
                border: "3px solid #000",
                backgroundColor: "var(--color-light, #fff8eb)",
                boxShadow: "5px 5px 0px #000",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
              }}
            >
              {profile.logo ? (
                <img
                  src={getLogoSrc(profile.logo)}
                  alt={profile.company || profile.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 900,
                    fontFamily: "var(--font-display)",
                    letterSpacing: 1.5,
                    color: "var(--color-dark, #231e25)",
                    textAlign: "center",
                    lineHeight: 1.1,
                  }}
                >
                  EXPO
                  <br />
                  LOGO
                </span>
              )}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: "var(--color-primary, #ff3e33)",
                }}
              />
            </motion.div>

            <div style={{ minWidth: 0, flex: 1 }}>
              {/* Status pills */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: "var(--color-purple-mimosa, #a67eff)",
                    color: "#fff",
                    padding: "4px 11px",
                    borderRadius: 3,
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    border: "1.5px solid #000",
                    boxShadow: "2px 2px 0 #000",
                  }}
                >
                  <PulseDot color="#fff" glow={false} size={6} />
                  {profile.category || "Technology"}
                </span>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: "var(--color-kiwi, #abf139)",
                    color: "#000",
                    padding: "4px 11px",
                    borderRadius: 3,
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 0.6,
                    border: "1.5px solid #000",
                    boxShadow: "2px 2px 0 #000",
                  }}
                >
                  <PulseDot color="#000" glow={false} size={6} />
                  VERIFIED EXHIBITOR
                </span>

                {profile.expos && profile.expos.length > 0 && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      backgroundColor: "var(--color-selective-yellow, #feb804)",
                      color: "#000",
                      padding: "4px 11px",
                      borderRadius: 3,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 0.6,
                      border: "1.5px solid #000",
                      boxShadow: "2px 2px 0 #000",
                    }}
                  >
                    ◆ {profile.expos.length} EXPO{profile.expos.length > 1 ? "S" : ""}
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-display, 'Bebas Neue')",
                  fontSize: "clamp(40px, 5.5vw, 66px)",
                  margin: "4px 0 8px 0",
                  lineHeight: 0.9,
                  letterSpacing: 1.2,
                  color: "var(--color-dark, #231e25)",
                }}
              >
                {profile.company || profile.name}
              </h1>

              {profile.website && (
                <motion.a
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 14,
                    fontWeight: 800,
                    color: "var(--color-primary, #ff3e33)",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    border: "2px solid var(--color-primary, #ff3e33)",
                    borderRadius: 3,
                    background: "rgba(255,62,51,0.06)",
                    marginTop: 4,
                  }}
                >
                  ↗ {profile.website}
                </motion.a>
              )}
            </div>
          </div>

          {/* Contact CTA */}
          <motion.button
            whileHover={{ scale: 1.04, y: -3, boxShadow: "8px 8px 0px #000" }}
            whileTap={{ scale: 0.96, y: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 22 }}
            onClick={handleContactClick}
            style={{
              backgroundColor: "var(--color-primary, #ff3e33)",
              color: "#ffffff",
              border: "3px solid #000",
              boxShadow: "5px 5px 0px #000",
              padding: "16px 30px",
              borderRadius: 4,
              fontFamily: "var(--font-display)",
              fontSize: 22,
              letterSpacing: 1,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              zIndex: 2,
              flexShrink: 0,
            }}
          >
            <ShineSweep duration={1.4} delay={0} opacity={0.35} />
            <PulseDot color="#fff" glow={false} size={8} />
            CONTACT EXHIBITOR
            {!user && (
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 800,
                  letterSpacing: 0.6,
                  background: "#000",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: 2,
                  marginLeft: 4,
                }}
              >
                LOGIN REQUIRED
              </span>
            )}
          </motion.button>
        </motion.div>

        {/* ───────────────────── COMPANY OVERVIEW ───────────────────── */}
        {profile.description && (
          <SectionCard accent="var(--color-purple-mimosa, #a67eff)" index={0}>
            <SectionHeader
              tag="01 // ABOUT"
              title="COMPANY OVERVIEW"
              accent="var(--color-purple-mimosa, #a67eff)"
            />
            <p
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 16,
                lineHeight: 1.65,
                color: "#374151",
                margin: 0,
                fontWeight: 500,
              }}
            >
              {profile.description}
            </p>
          </SectionCard>
        )}

        {/* ───────────────────── PRODUCTS ───────────────────── */}
        {profile.products && (
          <SectionCard accent="var(--color-kiwi, #abf139)" index={1}>
            <SectionHeader
              tag="02 // INNOVATIONS"
              title="PRODUCTS AND INNOVATIONS"
              accent="var(--color-kiwi, #abf139)"
            />
            <p
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              {profile.products}
            </p>
          </SectionCard>
        )}

        {/* ───────────────────── TRADE SHOW BOOTHS ───────────────────── */}
        {profile.expos && profile.expos.length > 0 && (
          <SectionCard accent="var(--color-cerulean, #14a6ea)" index={2} noPad>
            <div style={{ padding: "26px 28px 6px 28px" }}>
              <SectionHeader
                tag="03 // PARTICIPATION"
                title="TRADE SHOW BOOTHS AND SCHEDULES"
                accent="var(--color-cerulean, #14a6ea)"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "0 28px 28px 28px" }}>
              {profile.expos.map((e, idx) => {
                const expoTitle = e.expo?.title || e.title || "Trade Show Expo";
                const boothNumber =
                  e.booth?.boothNumber || e.boothNumber || null;
                const location =
                  e.expo?.location || "Main Convention Center";
                const startDate = e.expo?.startDate
                  ? new Date(e.expo.startDate).toLocaleDateString()
                  : null;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 22,
                      delay: idx * 0.08,
                    }}
                    whileHover={{
                      y: -3,
                      x: 3,
                      boxShadow: "6px 6px 0px var(--color-cerulean, #14a6ea)",
                    }}
                    style={{
                      backgroundColor: "#f9fafb",
                      border: "2.5px solid #000",
                      boxShadow: "3px 3px 0px #000",
                      padding: "18px 22px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 16,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <ShineSweep duration={1.6} delay={0.2 + idx * 0.05} opacity={0.25} />

                    <div style={{ flex: "1 1 280px", minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
                        <PulseDot
                          color="var(--color-cerulean, #14a6ea)"
                          size={7}
                          glow={false}
                        />
                        <span
                          style={{
                            fontFamily: "'Satoshi', sans-serif",
                            fontSize: 10,
                            fontWeight: 900,
                            letterSpacing: 1.2,
                            color: "#6b7280",
                            textTransform: "uppercase",
                          }}
                        >
                          EXPO #{String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h4
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 26,
                          fontWeight: 800,
                          margin: 0,
                          letterSpacing: 0.5,
                          lineHeight: 1,
                        }}
                      >
                        {expoTitle}
                      </h4>

                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          flexWrap: "wrap",
                          fontSize: 13,
                          color: "#6b7280",
                          fontFamily: "'Satoshi', sans-serif",
                          fontWeight: 700,
                          marginTop: 6,
                        }}
                      >
                        <span>📍 {location}</span>
                        {startDate && <span>🗓 {startDate}</span>}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          backgroundColor: "var(--color-primary, #ff3e33)",
                          color: "#fff",
                          padding: "7px 14px",
                          borderRadius: 3,
                          fontWeight: 800,
                          fontSize: 12,
                          fontFamily: "var(--font-display)",
                          letterSpacing: 0.8,
                          border: "2px solid #000",
                          boxShadow: "2px 2px 0 #000",
                        }}
                      >
                        <PulseDot color="#fff" glow={false} size={6} />
                        {boothNumber ? `BOOTH ${boothNumber}` : "SPACE ASSIGNED"}
                      </span>

                      {e.expo?._id && (
                        <motion.div
                          whileHover={{ x: 3 }}
                          transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 20,
                          }}
                        >
                          <Link
                            to={`/expos/${e.expo._id}`}
                            style={{
                              backgroundColor: "#000",
                              color: "#fff",
                              padding: "7px 14px",
                              borderRadius: 3,
                              textDecoration: "none",
                              fontSize: 12,
                              fontWeight: 800,
                              fontFamily: "var(--font-display)",
                              letterSpacing: 0.8,
                              border: "2px solid #000",
                              boxShadow: "2px 2px 0 var(--color-cerulean, #14a6ea)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            VIEW EXPO →
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* ───────────────────── BOTTOM CTA STRIP ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: 56,
            backgroundColor: "var(--color-dark, #231e25)",
            border: "3px solid #000",
            boxShadow: "8px 8px 0px var(--color-primary, #ff3e33)",
            padding: "26px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 18,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <CornerBrackets color="#fff" inset={10} size={14} thickness={2.5} />
          <ShineSweep duration={1.8} delay={0.3} opacity={0.15} />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "var(--color-kiwi, #abf139)",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.4,
                fontFamily: "'Satoshi', sans-serif",
                marginBottom: 6,
              }}
            >
              <PulseDot color="var(--color-kiwi, #abf139)" size={7} />
              EXPLORE MORE VERIFIED PARTNERS
            </div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(20px, 2.6vw, 30px)",
                color: "#ffffff",
                margin: 0,
                letterSpacing: 1,
                lineHeight: 1,
              }}
            >
              DISCOVER THE FULL EVENTSPHERE DIRECTORY
            </p>
          </div>

          <motion.div
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            style={{ position: "relative", zIndex: 2 }}
          >
            <Link
              to="/exhibitors"
              style={{
                backgroundColor: "var(--color-kiwi, #abf139)",
                color: "#000",
                border: "2.5px solid #000",
                boxShadow: "4px 4px 0 #000",
                padding: "12px 24px",
                borderRadius: 4,
                textDecoration: "none",
                fontFamily: "var(--font-display)",
                fontSize: 20,
                letterSpacing: 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              BACK TO DIRECTORY
              <span style={{ fontSize: 12 }}>→</span>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   Local helper components — kept inline so they don't leak scope
   ═════════════════════════════════════════════════════════════ */

function SectionCard({ accent, index = 0, children, noPad = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 24,
        delay: index * 0.1,
      }}
      style={{
        backgroundColor: "#ffffff",
        border: "3px solid var(--color-dark, #231e25)",
        boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
        padding: noPad ? 0 : "28px 32px",
        marginBottom: 28,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CornerBrackets color="#000" inset={8} size={12} thickness={2.5} />
      <ShineSweep duration={1.7} delay={0.15 + index * 0.1} opacity={0.22} />

      {/* Accent left bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: accent,
        }}
      />

      {children}
    </motion.div>
  );
}

function SectionHeader({ tag, title, accent }) {
  return (
    <div style={{ marginBottom: 18, position: "relative" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          backgroundColor: accent,
          color:
            accent === "var(--color-kiwi, #abf139)" ||
            accent === "var(--color-selective-yellow, #feb804)"
              ? "#000"
              : "#fff",
          padding: "3px 10px",
          borderRadius: 3,
          fontSize: 10,
          fontFamily: "'Satoshi', sans-serif",
          fontWeight: 900,
          letterSpacing: 1.2,
          border: "1.5px solid #000",
          boxShadow: "2px 2px 0 #000",
          marginBottom: 10,
        }}
      >
        <PulseDot color="currentColor" size={6} glow={false} />
        {tag}
      </div>

      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px, 3.2vw, 34px)",
          margin: 0,
          letterSpacing: 1,
          lineHeight: 1,
          color: "var(--color-dark, #231e25)",
          position: "relative",
          display: "inline-block",
        }}
      >
        {title}
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -6,
            height: 3,
            background: `repeating-linear-gradient(90deg, ${accent} 0 6px, transparent 6px 12px)`,
            opacity: 0.6,
          }}
        />
      </h3>
    </div>
  );
}