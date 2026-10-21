import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import { useSocket } from "../../context/SocketContext.jsx";
import {
  CornerBrackets,
  ShineSweep,
  PulseDot,
  RotatingBadge,
  TickerStrip,
  Scanline,
  GrainOverlay,
  TickStrip,
} from "../../components/common/NeoBrutalKit.jsx";

/* ── Pagination config ─────────────────────────────────────────── */
const PAGE_SIZE = { expo: 4, session: 5, bookmark: 5 };

const clampPage = (page, total, size) =>
  Math.min(Math.max(1, page || 1), Math.max(1, Math.ceil(total / size)));

const buildPage = (list, page, size) => {
  const totalPages = Math.max(1, Math.ceil(list.length / size));
  const current = Math.min(Math.max(1, page || 1), totalPages);
  const startIdx = (current - 1) * size;
  return {
    items: list.slice(startIdx, startIdx + size),
    totalPages,
    current,
    from: list.length === 0 ? 0 : startIdx + 1,
    to: Math.min(startIdx + size, list.length),
    total: list.length,
  };
};

/* Compact windowed page numbers: 1 … 4 5 6 … 12 */
const pageWindow = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const n of sorted) {
    if (prev && n - prev > 1) out.push("…");
    out.push(n);
    prev = n;
  }
  return out;
};

const MySchedule = () => {
  const { socket } = useSocket();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const [pages, setPages] = useState({ expo: 1, session: 1, bookmark: 1 });

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/registrations/my");
      setRegistrations(res.data || []);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load schedule");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchRegistrations(); }, []);

  useEffect(() => {
    if (!socket) return;
    const handleScheduleUpdated = () => fetchRegistrations();
    socket.on("schedule:updated", handleScheduleUpdated);
    return () => socket.off("schedule:updated", handleScheduleUpdated);
  }, [socket]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4500);
    return () => clearTimeout(t);
  }, [success]);

  const expoRegs = registrations.filter((r) => r.type === "expo" && r.registered && Boolean(r.expo));
  const sessionRegs = registrations
    .filter((r) => r.type === "session" && r.registered && Boolean(r.session))
    .sort((a, b) => new Date(a.session?.startTime) - new Date(b.session?.startTime));
  const bookmarks = registrations
    .filter((r) => r.type === "session" && r.bookmarked && Boolean(r.session))
    .sort((a, b) => new Date(a.session?.startTime) - new Date(b.session?.startTime));

  /* Keep the current page inside bounds after cancels / refetches */
  useEffect(() => {
    setPages((prev) => {
      const next = {
        expo: clampPage(prev.expo, expoRegs.length, PAGE_SIZE.expo),
        session: clampPage(prev.session, sessionRegs.length, PAGE_SIZE.session),
        bookmark: clampPage(prev.bookmark, bookmarks.length, PAGE_SIZE.bookmark),
      };
      return next.expo === prev.expo && next.session === prev.session && next.bookmark === prev.bookmark
        ? prev
        : next;
    });
  }, [expoRegs.length, sessionRegs.length, bookmarks.length]);

  const expoPage = buildPage(expoRegs, pages.expo, PAGE_SIZE.expo);
  const sessionPage = buildPage(sessionRegs, pages.session, PAGE_SIZE.session);
  const bookmarkPage = buildPage(bookmarks, pages.bookmark, PAGE_SIZE.bookmark);

  const changePage = (section, anchorId) => (next) => {
    setPages((prev) => ({ ...prev, [section]: next }));
    const el = document.getElementById(anchorId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCancel = async (regId) => {
    if (!regId || pendingId) return;
    setError(""); setSuccess("");
    setPendingId(regId);
    try {
      await api.delete(`/registrations/${regId}`);
      setSuccess("Registration cancelled successfully");
      await fetchRegistrations();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to cancel registration");
    } finally { setPendingId(null); }
  };

  const handleRemoveBookmark = async (regId, sessionId) => {
    if ((!regId && !sessionId) || pendingId) return;
    setError(""); setSuccess("");
    setPendingId(regId || sessionId);
    try {
      if (sessionId) await api.put("/registrations/bookmark", { session: sessionId });
      else if (regId) await api.delete(`/registrations/${regId}`);
      setSuccess("Bookmark removed");
      await fetchRegistrations();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to remove bookmark");
    } finally { setPendingId(null); }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 640, margin: "40px auto", backgroundColor: "#fff", border: "3px solid #000", boxShadow: "8px 8px 0 #000", padding: 50, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, textAlign: "center" }}>
        <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
        <Scanline color="rgba(171,241,57,0.35)" height={70} />
        <div style={{ width: 52, height: 52, borderRadius: "50%", border: "4px solid #231e25", borderTopColor: "var(--color-kiwi, #abf139)", animation: "spin 0.9s linear infinite" }} />
        <p style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 1, margin: 0 }}>SYNCING PERSONAL TIMETABLE...</p>
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "10px clamp(16px, 4vw, 40px) 60px clamp(16px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ backgroundColor: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "8px 8px 0 var(--color-dark, #231e25)", padding: "24px 28px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={8} size={12} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
        <GrainOverlay opacity={0.1} />

        <RotatingBadge
          text={`${expoRegs.length + sessionRegs.length} ITEMS`}
          size={86}
          bg="var(--color-kiwi, #abf139)"
          color="#000"
          top={-20}
          right={-20}
          duration={17}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
            <PulseDot color="#000" glow={false} size={6} />
            [ MY PERSONAL TIMETABLE ]
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 46px)", color: "var(--color-dark, #231e25)", lineHeight: 0.95, margin: "10px 0 0 0", letterSpacing: 1 }}>
            REGISTERED EXPOS & SESSIONS
          </h1>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13.5, color: "#6b7280", margin: "6px 0 0 0", fontWeight: 600, maxWidth: 560 }}>
            Track your next sessions, registered expos, and bookmarked talks — all in one place.
          </p>
        </div>
      </motion.div>

      {/* TICKER */}
      <div style={{ backgroundColor: "var(--color-dark, #231e25)", border: "2px solid #000", borderRadius: 4, padding: "5px 0", boxShadow: "3px 3px 0 #000" }}>
        <TickerStrip
          items={["SCHEDULE SYNCED LIVE", `${expoRegs.length} EXPOS CLAIMED`, `${sessionRegs.length} SESSIONS`, `${bookmarks.length} BOOKMARKS`]}
          color="var(--color-kiwi, #abf139)"
          duration={24}
          fontSize={11}
        />
      </div>

      {/* STATUS BANNERS */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0, x: [0, -5, 5, -3, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            style={{ backgroundColor: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "4px 4px 0 var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
            <PulseDot color="var(--color-primary, #ff3e33)" size={9} />
            Error: {error}
          </motion.div>
        )}
        {success && (
          <motion.div key="suc" initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}
            style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "4px 4px 0 var(--color-dark, #231e25)", padding: "12px 16px", color: "#000", fontWeight: 800, fontFamily: "'Satoshi', sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 10, position: "relative", overflow: "hidden" }}>
            <ShineSweep duration={1.6} delay={0.2} opacity={0.4} />
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#000", color: "var(--color-kiwi, #abf139)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, border: "2px solid #000", flexShrink: 0 }}>✓</span>
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ SECTION 1 — EXPOS ═══════════════ */}
      <SectionShell id="section-expos" accent="var(--color-cerulean, #14a6ea)" title={`REGISTERED EXPOS (${expoRegs.length})`} idx={0}>
        {expoRegs.length === 0 ? (
          <p style={{ fontFamily: "'Satoshi', sans-serif", color: "#6b7280", margin: 0 }}>
            You have not registered for an expo yet.{" "}
            <Link to="/expos" style={{ color: "var(--color-primary, #ff3e33)", fontWeight: 800, textDecoration: "underline" }}>Browse available expos</Link>
          </p>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {expoPage.items.map((r, idx) => (
                <motion.div key={r._id}
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }}
                  whileHover={{ y: -4, boxShadow: "6px 6px 0 var(--color-cerulean, #14a6ea)" }}
                  style={{ backgroundColor: "#fff", border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "3px 3px 0 var(--color-dark, #231e25)", padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 14, position: "relative", overflow: "hidden" }}>
                  <ShineSweep duration={1.6} delay={idx * 0.05} opacity={0.2} />

                  <div style={{ position: "relative", zIndex: 2 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 900, letterSpacing: 1, background: "var(--color-cerulean, #14a6ea)", color: "#fff", padding: "2px 8px", borderRadius: 2, border: "1.5px solid #000", marginBottom: 8 }}>
                      <PulseDot color="#fff" glow={false} size={5} />
                      EXPO PASS
                    </span>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: 0.5, color: "var(--color-dark, #231e25)", lineHeight: 1 }}>
                      {r.expo?.title || "Expo"}
                    </h4>
                    <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, color: "#6b7280", margin: "6px 0 0 0", fontWeight: 700 }}>
                      🗓 {r.expo?.startDate && new Date(r.expo.startDate).toLocaleDateString()} – {r.expo?.endDate && new Date(r.expo.endDate).toLocaleDateString()}
                    </p>
                    {r.expo?.location && <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, color: "#6b7280", margin: "2px 0 0 0", fontWeight: 700 }}>📍 {r.expo.location}</p>}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1.5px dashed #000", paddingTop: 12, position: "relative", zIndex: 2 }}>
                    <Link to={`/expos/${r.expo?._id}`} style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, color: "var(--color-dark, #231e25)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      Open Floor Plan →
                    </Link>
                    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => handleCancel(r._id)} disabled={pendingId === r._id}
                      style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "5px 12px", borderRadius: 3, cursor: pendingId === r._id ? "not-allowed" : "pointer", fontSize: 11, fontWeight: 800, opacity: pendingId === r._id ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6 }}>
                      {pendingId === r._id && <PulseDot color="#fff" size={6} glow={false} />}
                      {pendingId === r._id ? "..." : "Cancel"}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            <Pagination
              page={expoPage.current}
              totalPages={expoPage.totalPages}
              from={expoPage.from}
              to={expoPage.to}
              total={expoPage.total}
              onChange={changePage("expo", "section-expos")}
              accent="var(--color-cerulean, #14a6ea)"
              ink="#fff"
              unit="expos"
            />
          </>
        )}
      </SectionShell>

      {/* ═══════════════ SECTION 2 — SESSIONS ═══════════════ */}
      <SectionShell id="section-sessions" accent="var(--color-kiwi, #abf139)" title={`REGISTERED SESSIONS & WORKSHOPS (${sessionRegs.length})`} idx={1}>
        {sessionRegs.length === 0 ? (
          <p style={{ fontFamily: "'Satoshi', sans-serif", color: "#6b7280", margin: 0 }}>No sessions registered yet.</p>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sessionPage.items.map((r, idx) => (
                <motion.div key={r._id}
                  initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: 3 }}
                  style={{ backgroundColor: "var(--color-light, #fff8eb)", border: "2px solid var(--color-dark, #231e25)", borderLeft: "6px solid var(--color-kiwi, #abf139)", boxShadow: "3px 3px 0 var(--color-dark, #231e25)", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, position: "relative", overflow: "hidden" }}>
                  <ShineSweep duration={1.6} delay={idx * 0.05} opacity={0.2} />

                  <div style={{ position: "relative", zIndex: 2, minWidth: 0 }}>
                    <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, fontWeight: 800, margin: 0, color: "var(--color-dark, #231e25)" }}>
                      {r.session?.title || "Session"}
                    </h4>
                    {r.session?.speaker && (
                      <span style={{ fontSize: 11.5, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, color: "var(--color-primary, #ff3e33)", display: "inline-flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                        <PulseDot color="var(--color-primary, #ff3e33)" size={5} glow={false} />
                        {r.session.speaker}
                      </span>
                    )}
                    <div style={{ fontSize: 11.5, fontFamily: "'Satoshi', sans-serif", color: "#6b7280", marginTop: 4, fontWeight: 700 }}>
                      🕐 {r.session?.startTime && new Date(r.session.startTime).toLocaleString()} · 📍 {r.session?.location || "TBA"}
                    </div>
                  </div>

                  <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => handleCancel(r._id)} disabled={pendingId === r._id}
                    style={{ position: "relative", zIndex: 2, backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "6px 14px", borderRadius: 3, cursor: pendingId === r._id ? "not-allowed" : "pointer", fontSize: 11.5, fontWeight: 800, opacity: pendingId === r._id ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6 }}>
                    {pendingId === r._id && <PulseDot color="#fff" size={6} glow={false} />}
                    {pendingId === r._id ? "Cancelling..." : "Cancel"}
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <Pagination
              page={sessionPage.current}
              totalPages={sessionPage.totalPages}
              from={sessionPage.from}
              to={sessionPage.to}
              total={sessionPage.total}
              onChange={changePage("session", "section-sessions")}
              accent="var(--color-kiwi, #abf139)"
              ink="#000"
              unit="sessions"
            />
          </>
        )}
      </SectionShell>

      {/* ═══════════════ SECTION 3 — BOOKMARKS ═══════════════ */}
      <SectionShell id="section-bookmarks" accent="var(--color-selective-yellow, #feb804)" title={`BOOKMARKED SESSIONS (${bookmarks.length})`} idx={2}>
        {bookmarks.length === 0 ? (
          <p style={{ fontFamily: "'Satoshi', sans-serif", color: "#6b7280", margin: 0 }}>No bookmarked sessions.</p>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bookmarkPage.items.map((r, idx) => (
                <motion.div key={r._id}
                  initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: -3 }}
                  style={{ backgroundColor: "#fff", border: "2px solid var(--color-dark, #231e25)", borderLeft: "6px solid var(--color-selective-yellow, #feb804)", boxShadow: "3px 3px 0 var(--color-dark, #231e25)", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, position: "relative", overflow: "hidden" }}>
                  <ShineSweep duration={1.6} delay={idx * 0.05} opacity={0.2} />

                  <div style={{ position: "relative", zIndex: 2, minWidth: 0 }}>
                    <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, fontWeight: 800, margin: 0, color: "var(--color-dark, #231e25)" }}>
                      {r.session?.title || "Session"}
                    </h4>
                    {r.session?.speaker && (
                      <span style={{ fontSize: 11.5, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, color: "var(--color-primary, #ff3e33)", display: "inline-flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                        <PulseDot color="var(--color-primary, #ff3e33)" size={5} glow={false} />
                        {r.session.speaker}
                      </span>
                    )}
                    <div style={{ fontSize: 11.5, fontFamily: "'Satoshi', sans-serif", color: "#6b7280", marginTop: 4, fontWeight: 700 }}>
                      🕐 {r.session?.startTime && new Date(r.session.startTime).toLocaleString()} · 📍 {r.session?.location || "TBA"}
                    </div>
                  </div>

                  <motion.button whileHover={{ y: -2, rotate: -3 }} whileTap={{ scale: 0.96 }} onClick={() => handleRemoveBookmark(r._id, r.session?._id)} disabled={pendingId === r._id || pendingId === r.session?._id} title="Remove Bookmark"
                    style={{ position: "relative", zIndex: 2, backgroundColor: "var(--color-selective-yellow, #feb804)", color: "#000", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "6px 14px", borderRadius: 3, cursor: "pointer", fontSize: 12, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 6 }}>
                    ★ Bookmarked
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <Pagination
              page={bookmarkPage.current}
              totalPages={bookmarkPage.totalPages}
              from={bookmarkPage.from}
              to={bookmarkPage.to}
              total={bookmarkPage.total}
              onChange={changePage("bookmark", "section-bookmarks")}
              accent="var(--color-selective-yellow, #feb804)"
              ink="#000"
              unit="bookmarks"
            />
          </>
        )}
      </SectionShell>
    </div>
  );
};

/* ── Pagination control ─────────────────────────────────────────── */
function Pagination({ page, totalPages, from, to, total, onChange, accent, ink = "#000", unit = "items" }) {
  if (totalPages <= 1) return null;
  const numbers = pageWindow(page, totalPages);

  const btn = (extra = {}) => ({
    minWidth: 30,
    height: 30,
    padding: "0 9px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Satoshi', sans-serif",
    fontSize: 12,
    fontWeight: 800,
    lineHeight: 1,
    border: "1.5px solid #000",
    borderRadius: 3,
    backgroundColor: "#fff",
    color: "#231e25",
    cursor: "pointer",
    boxShadow: "2px 2px 0 #000",
    ...extra,
  });

  const navBtn = (disabled) => ({
    ...btn(),
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "1px 1px 0 #000" : "2px 2px 0 #000",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginTop: 18, paddingTop: 14, borderTop: "1.5px dashed rgba(0,0,0,0.28)" }}>
      <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 11.5, fontWeight: 800, color: "#6b7280", letterSpacing: 0.3 }}>
        SHOWING {from}–{to} OF {total} {unit.toUpperCase()} · PAGE {page}/{totalPages}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <motion.button whileHover={page > 1 ? { y: -2 } : {}} whileTap={page > 1 ? { scale: 0.95 } : {}}
          onClick={() => page > 1 && onChange(page - 1)} disabled={page <= 1} aria-label="Previous page"
          style={navBtn(page <= 1)}>
          ← Prev
        </motion.button>

        {numbers.map((n, i) =>
          n === "…" ? (
            <span key={`gap-${i}`} style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, color: "#9ca3af", padding: "0 2px" }}>…</span>
          ) : (
            <motion.button key={n} whileHover={n !== page ? { y: -2 } : {}} whileTap={{ scale: 0.94 }}
              onClick={() => n !== page && onChange(n)} aria-label={`Page ${n}`} aria-current={n === page ? "page" : undefined}
              style={btn({
                backgroundColor: n === page ? accent : "#fff",
                color: n === page ? ink : "#231e25",
                boxShadow: n === page ? "2px 2px 0 #000" : "1px 1px 0 #000",
                cursor: n === page ? "default" : "pointer",
              })}>
              {n}
            </motion.button>
          )
        )}

        <motion.button whileHover={page < totalPages ? { y: -2 } : {}} whileTap={page < totalPages ? { scale: 0.95 } : {}}
          onClick={() => page < totalPages && onChange(page + 1)} disabled={page >= totalPages} aria-label="Next page"
          style={navBtn(page >= totalPages)}>
          Next →
        </motion.button>
      </div>
    </div>
  );
}

/* Section helper */
function SectionShell({ accent, title, idx = 0, children, id }) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.5, delay: idx * 0.08 }}
      style={{
        backgroundColor: "#fff",
        border: "3px solid var(--color-dark, #231e25)",
        boxShadow: "6px 6px 0 var(--color-dark, #231e25)",
        padding: "22px 26px",
        position: "relative",
        overflow: "hidden",
        scrollMarginTop: 24,
      }}
    >
      <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
      <ShineSweep duration={1.7} delay={0.15 + idx * 0.1} opacity={0.2} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, backgroundColor: accent }} />

      <h3 style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--font-display)", fontSize: 24, margin: "0 0 16px 0", letterSpacing: 0.8, position: "relative", zIndex: 2 }}>
        <span style={{ width: 10, height: 10, background: accent, border: "1.5px solid #000", display: "inline-block" }} />
        {title}
      </h3>

      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </motion.div>
  );
}

export default MySchedule;