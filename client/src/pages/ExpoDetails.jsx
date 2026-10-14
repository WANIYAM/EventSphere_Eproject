import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Navigation } from "../components/landing/navigation/Navigation";
import { CustomCursor } from "../components/landing/common/CustomCursor";

const BASE = "http://localhost:5000";

export default function ExpoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { addToast } = useToast();

  const [expoData, setExpoData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [booths, setBooths] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("schedule");
  const [searchExhibitor, setSearchExhibitor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBooth, setSelectedBooth] = useState(null);

  // Per-item pending action map to prevent double-clicks
  const [pendingActions, setPendingActions] = useState({});

  const setItemPending = (key, isPending) => {
    setPendingActions((prev) => ({ ...prev, [key]: isPending }));
  };

  const isPending = (key) => Boolean(pendingActions[key]);

  const fetchExpoData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/public/expos/${id}`);
      const data = res.data;

      setExpoData(data.expo || data);
      setSessions(data.sessions || []);
      setBooths(data.booths || []);
      setExhibitors(data.exhibitors || []);
    } catch (err) {
      console.error("Failed to load expo data:", err);
      try {
        const fallbackRes = await api.get(`/expos/${id}`);
        setExpoData(fallbackRes.data.expo || fallbackRes.data);
        setSessions(fallbackRes.data.sessions || []);
        setBooths(fallbackRes.data.booths || []);
        setExhibitors(fallbackRes.data.exhibitors || []);
      } catch (fallbackErr) {
        setError(fallbackErr.userMessage || "Failed to load exposition details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    if (!user || user.role !== "attendee") {
      setRegistrations([]);
      return;
    }
    try {
      const res = await api.get("/registrations/my");
      setRegistrations(res.data || []);
    } catch (err) {
      console.error("Failed to load registrations:", err);
    }
  };

  useEffect(() => {
    fetchExpoData();
    fetchRegistrations();
  }, [id, user]);

  useEffect(() => {
    if (!socket) return;

    const handleBoothUpdated = (data) => {
      if (data?.expoId === id || !data?.expoId) {
        fetchExpoData();
      }
    };

    const handleScheduleUpdated = (data) => {
      if (data?.expoId === id || !data?.expoId) {
        fetchExpoData();
      }
    };

    socket.on("booth:updated", handleBoothUpdated);
    socket.on("schedule:updated", handleScheduleUpdated);

    return () => {
      socket.off("booth:updated", handleBoothUpdated);
      socket.off("schedule:updated", handleScheduleUpdated);
    };
  }, [socket, id]);

  const expoReg = useMemo(() => {
    return registrations.find(
      (r) => r.type === "expo" && (r.expo?._id === id || r.expo === id) && r.registered
    );
  }, [registrations, id]);

  const isExpoRegistered = Boolean(expoReg);

  const getSessionReg = (sessionId) => {
    return registrations.find(
      (r) => r.type === "session" && (r.session?._id === sessionId || r.session === sessionId)
    );
  };

  const isExpoEnded = useMemo(() => {
    return Boolean(expoData?.endDate && new Date(expoData.endDate) < new Date());
  }, [expoData]);

  const redirectToLogin = () => {
    navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, {
      state: { from: location.pathname },
    });
  };

  // Action Handlers with per-item pending guards & overlap toast
  const handleRegisterExpo = async () => {
    if (!user) return redirectToLogin();
    if (user.role !== "attendee" || isExpoEnded || isPending("expo")) return;

    setItemPending("expo", true);
    try {
      await api.post("/registrations", { expo: id });
      addToast("Successfully registered for this Expo!", "success");
      await fetchRegistrations();
    } catch (err) {
      addToast(err.userMessage || err.response?.data?.message || "Registration failed", "error");
    } finally {
      setItemPending("expo", false);
    }
  };

  const handleCancelExpo = async () => {
    if (!expoReg || isPending("expo")) return;

    setItemPending("expo", true);
    try {
      await api.delete(`/registrations/${expoReg._id}`);
      addToast("Expo registration cancelled", "info");
      await fetchRegistrations();
    } catch (err) {
      addToast(err.userMessage || err.response?.data?.message || "Failed to cancel registration", "error");
    } finally {
      setItemPending("expo", false);
    }
  };

  const handleRegisterSession = async (sessionId) => {
    if (!user) return redirectToLogin();
    if (user.role !== "attendee" || isPending(`sess-${sessionId}`)) return;

    setItemPending(`sess-${sessionId}`, true);
    try {
      const res = await api.post("/registrations/session", { session: sessionId });
      addToast("Registered for session!", "success");

      // Non-blocking overlap warning toast
      if (res.data?.warning) {
        addToast(res.data.warning, "warning");
      }

      await fetchRegistrations();
    } catch (err) {
      addToast(err.userMessage || err.response?.data?.message || "Failed to register for session", "error");
    } finally {
      setItemPending(`sess-${sessionId}`, false);
    }
  };

  const handleCancelSession = async (sessionId, regId) => {
    if (isPending(`sess-${sessionId}`)) return;

    setItemPending(`sess-${sessionId}`, true);
    try {
      await api.delete(`/registrations/${regId}`);
      addToast("Session registration cancelled", "info");
      await fetchRegistrations();
    } catch (err) {
      addToast(err.userMessage || err.response?.data?.message || "Failed to cancel session", "error");
    } finally {
      setItemPending(`sess-${sessionId}`, false);
    }
  };

  const handleBookmarkSession = async (sessionId) => {
    if (!user) return redirectToLogin();
    if (user.role !== "attendee" || isPending(`bm-${sessionId}`)) return;

    const reg = getSessionReg(sessionId);
    const wasBookmarked = Boolean(reg?.bookmarked);

    setItemPending(`bm-${sessionId}`, true);
    try {
      await api.put("/registrations/bookmark", { session: sessionId });
      addToast(wasBookmarked ? "Bookmark removed" : "Session bookmarked!", "success");
      await fetchRegistrations();
    } catch (err) {
      addToast(err.userMessage || err.response?.data?.message || "Failed to update bookmark", "error");
    } finally {
      setItemPending(`bm-${sessionId}`, false);
    }
  };

  const categories = useMemo(() => {
    const set = new Set();
    (exhibitors || []).forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return ["all", ...Array.from(set)];
  }, [exhibitors]);

  const filteredExhibitors = useMemo(() => {
    return (exhibitors || []).filter((ex) => {
      if (!ex) return false;
      const q = String(searchExhibitor || "").toLowerCase().trim();
      const company = String(ex.company || "").toLowerCase();
      const rep = String(ex.name || ex.representative || "").toLowerCase();
      const products = typeof ex.products === "object" ? JSON.stringify(ex.products).toLowerCase() : String(ex.products || "").toLowerCase();
      const booth = String(ex.boothNumber || "").toLowerCase();

      const matchesSearch = !q || company.includes(q) || rep.includes(q) || products.includes(q) || booth.includes(q);
      const matchesCat = selectedCategory === "all" || String(ex.category || "").toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [exhibitors, searchExhibitor, selectedCategory]);

  const dayGroups = useMemo(() => {
    const groups = {};
    (sessions || []).forEach((s) => {
      const day = s.startTime
        ? new Date(s.startTime).toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "GENERAL SCHEDULE";
      if (!groups[day]) groups[day] = [];
      groups[day].push(s);
    });
    return groups;
  }, [sessions]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-light, #fff8eb)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <CustomCursor />
        <Navigation />
        <div style={{ width: 56, height: 56, borderRadius: "50%", border: "4px solid #000", borderTopColor: "var(--color-primary, #ff3e33)", animation: "spin 1s linear infinite", marginBottom: 16 }} />
        <h2 style={{ fontFamily: "var(--font-display, 'Bebas Neue')", fontSize: 32, letterSpacing: 1.5, margin: 0 }}>
          SYNCHRONIZING EXPO SPECIFICATION...
        </h2>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !expoData) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-light, #fff8eb)", padding: "140px 24px" }}>
        <CustomCursor />
        <Navigation />
        <div style={{ maxWidth: 600, margin: "0 auto", backgroundColor: "#fff", border: "3px solid #000", padding: 32, boxShadow: "6px 6px 0px #000" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--color-primary, #ff3e33)" }}>ERROR</h2>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600 }}>{error || "Expo specification not found."}</p>
          <Link to="/expos" style={{ display: "inline-block", marginTop: 14, backgroundColor: "#000", color: "#fff", padding: "8px 18px", textDecoration: "none", fontWeight: 800 }}>
            BACK TO ALL EXPOS
          </Link>
        </div>
      </div>
    );
  }

  const bookedBooths = booths.filter((b) => b.status === "booked" || b.status === "reserved").length;
  const availableBooths = booths.filter((b) => b.status === "available").length;

  return (
    <div className="landing-page-root" style={{ minHeight: "100vh", backgroundColor: "var(--color-light, #fff8eb)", paddingBottom: 100 }}>
      <CustomCursor />
      <Navigation />

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "110px clamp(18px, 4vw, 56px) 60px clamp(18px, 4vw, 56px)" }}>

        {/* Breadcrumb Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <Link
            to="/expos"
            style={{
              textDecoration: "none",
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 800,
              color: "var(--color-dark, #231e25)",
              fontSize: 13,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#ffffff",
              border: "1.5px solid #000",
              boxShadow: "2px 2px 0px #000",
              padding: "5px 12px",
              borderRadius: 3,
            }}
          >
            ALL EXPOS
          </Link>

          <span style={{ backgroundColor: "#000", color: "#fff", padding: "3px 10px", borderRadius: 3, fontSize: 11, fontWeight: 800 }}>
            EXPO ID: {expoData._id ? expoData._id.slice(-6).toUpperCase() : "N/A"}
          </span>
        </div>

        {/* 1. HERO SPECIFICATION PASS */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "3.5px solid var(--color-dark, #231e25)",
            boxShadow: "8px 8px 0px var(--color-dark, #231e25)",
            padding: "clamp(24px, 4vw, 44px)",
            marginBottom: 32,
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 70, height: 8, backgroundColor: "var(--color-dark)", borderRadius: "0 0 5px 5px" }} />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
            <span style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#ffffff", padding: "4px 12px", borderRadius: 3, fontFamily: "'Satoshi', sans-serif", fontSize: 11, fontWeight: 900 }}>
              {expoData.theme || "TRADE SHOW"}
            </span>
            <span style={{ backgroundColor: isExpoEnded ? "#fee2e2" : "var(--color-kiwi, #abf139)", color: isExpoEnded ? "#991b1b" : "#000", border: "1.5px solid #000", padding: "3px 10px", borderRadius: 3, fontSize: 11, fontWeight: 800 }}>
              {isExpoEnded ? "STATUS: ENDED" : "STATUS: CONFIRMED"}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display, 'Bebas Neue')",
              fontSize: "clamp(42px, 6.5vw, 84px)",
              color: "var(--color-dark, #231e25)",
              lineHeight: 0.88,
              margin: "6px 0 14px 0",
              letterSpacing: 1.2,
            }}
          >
            {expoData.title}
          </h1>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 700, color: "#4b5563", marginBottom: 20 }}>
            <span><strong>Location:</strong> {expoData.location || "Main Convention Center"}</span>
            <span><strong>Dates:</strong> {new Date(expoData.startDate).toLocaleDateString()} – {new Date(expoData.endDate).toLocaleDateString()}</span>
            <span><strong>Exhibitors:</strong> {exhibitors.length}</span>
            <span><strong>Booths:</strong> {availableBooths} Open / {booths.length} Total</span>
          </div>

          {/* Action Hub */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", borderTop: "2px dashed #000", paddingTop: 18, alignItems: "center" }}>

            {/* If expo has ended, never show registration buttons */}
            {isExpoEnded ? (
              <span
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  border: "2px solid #991b1b",
                  padding: "8px 18px",
                  borderRadius: 4,
                  fontSize: 14,
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 800,
                }}
              >
                Ended
              </span>
            ) : (
              <>
                {/* Not Logged In */}
                {!user && (
                  <button
                    onClick={redirectToLogin}
                    style={{
                      backgroundColor: "var(--color-primary, #ff3e33)",
                      color: "#ffffff",
                      border: "2.5px solid #000",
                      boxShadow: "3px 3px 0px #000",
                      padding: "10px 24px",
                      fontFamily: "var(--font-display)",
                      fontSize: 20,
                      letterSpacing: 0.5,
                      cursor: "pointer",
                    }}
                  >
                    SIGN IN TO REGISTER
                  </button>
                )}

                {/* Logged-in Attendee */}
                {user?.role === "attendee" && (
                  <>
                    {isExpoRegistered ? (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            backgroundColor: "var(--color-kiwi, #abf139)",
                            color: "#000",
                            border: "2px solid #000",
                            boxShadow: "2px 2px 0px #000",
                            padding: "8px 16px",
                            fontFamily: "var(--font-display)",
                            fontSize: 20,
                          }}
                        >
                          REGISTRATION CONFIRMED
                        </span>
                        <button
                          onClick={handleCancelExpo}
                          disabled={isPending("expo")}
                          style={{
                            backgroundColor: "#ffffff",
                            color: "var(--color-primary, #ff3e33)",
                            border: "1.5px solid var(--color-primary, #ff3e33)",
                            padding: "8px 14px",
                            fontFamily: "'Satoshi', sans-serif",
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: isPending("expo") ? "not-allowed" : "pointer",
                            opacity: isPending("expo") ? 0.6 : 1,
                          }}
                        >
                          {isPending("expo") ? "Cancelling..." : "Cancel Registration"}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleRegisterExpo}
                        disabled={isPending("expo")}
                        style={{
                          backgroundColor: "var(--color-selective-yellow, #feb804)",
                          color: "#000000",
                          border: "2.5px solid #000",
                          boxShadow: "3px 3px 0px #000",
                          padding: "10px 24px",
                          fontFamily: "var(--font-display)",
                          fontSize: 20,
                          letterSpacing: 0.5,
                          cursor: isPending("expo") ? "not-allowed" : "pointer",
                          opacity: isPending("expo") ? 0.6 : 1,
                        }}
                      >
                        {isPending("expo") ? "Registering..." : "REGISTER FOR EXPO"}
                      </button>
                    )}
                  </>
                )}

                {/* Admin or Exhibitor Notice */}
                {user && user.role !== "attendee" && (
                  <span
                    style={{
                      backgroundColor: "#f3f4f6",
                      color: "#6b7280",
                      border: "1.5px dashed #9ca3af",
                      padding: "8px 16px",
                      borderRadius: 4,
                      fontSize: 13,
                      fontFamily: "'Satoshi', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    Note: Attendees can register for this expo.
                  </span>
                )}
              </>
            )}

            {/* Exhibitor Action if applicable */}
            {user?.role === "exhibitor" && !isExpoEnded && (
              <Link
                to={`/exhibitor/applications?expo=${expoData._id}`}
                style={{
                  backgroundColor: "var(--color-purple-mimosa, #a67eff)",
                  color: "#ffffff",
                  border: "2px solid #000",
                  boxShadow: "3px 3px 0px #000",
                  padding: "9px 20px",
                  textDecoration: "none",
                  fontFamily: "var(--font-display)",
                  fontSize: 19,
                }}
              >
                APPLY FOR BOOTH
              </Link>
            )}
          </div>
        </div>

        {/* 2. TAB CONTROLS */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
          {[
            { id: "schedule", label: `SCHEDULE (${sessions.length})` },
            { id: "exhibitors", label: `EXHIBITORS (${exhibitors.length})` },
            { id: "floorplan", label: `FLOOR PLAN (${booths.length})` },
            { id: "about", label: "ABOUT MANIFESTO" },
          ].map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "10px 22px",
                  borderRadius: 30,
                  backgroundColor: isActive ? "var(--color-dark, #231e25)" : "#ffffff",
                  color: isActive ? "var(--color-light, #fff8eb)" : "var(--color-dark, #231e25)",
                  border: "2px solid var(--color-dark, #231e25)",
                  boxShadow: isActive ? "3px 3px 0px var(--color-primary, #ff3e33)" : "2px 2px 0px var(--color-dark, #231e25)",
                  fontFamily: "var(--font-display)",
                  fontSize: 19,
                  letterSpacing: 0.5,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. TAB VIEWS */}
        <AnimatePresence mode="wait">

          {/* TAB 1: SCHEDULE */}
          {activeTab === "schedule" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              {sessions.length === 0 ? (
                <div style={{ backgroundColor: "#ffffff", border: "2.5px solid #000", padding: 48, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
                  No sessions scheduled for this exposition yet.
                </div>
              ) : (
                Object.entries(dayGroups).map(([day, daySessions]) => (
                  <div
                    key={day}
                    style={{
                      backgroundColor: "#ffffff",
                      border: "3px solid var(--color-dark, #231e25)",
                      boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
                      padding: "24px 28px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "var(--color-dark, #231e25)",
                        color: "var(--color-light, #fff8eb)",
                        padding: "6px 14px",
                        borderRadius: 2,
                        fontFamily: "var(--font-display)",
                        fontSize: 20,
                        letterSpacing: 1,
                        marginBottom: 16,
                        width: "fit-content",
                      }}
                    >
                      {day.toUpperCase()}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {daySessions.map((s) => {
                        const reg = getSessionReg(s._id);
                        const isReg = Boolean(reg?.registered);
                        const isBookmarked = Boolean(reg?.bookmarked);

                        const isSessionEnded = Boolean(s.endTime && new Date(s.endTime) < new Date());
                        const isSessPending = isPending(`sess-${s._id}`);
                        const isBmPending = isPending(`bm-${s._id}`);

                        const start = s.startTime ? new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBA";
                        const end = s.endTime ? new Date(s.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

                        return (
                          <div
                            key={s._id}
                            style={{
                              backgroundColor: "var(--color-light, #fff8eb)",
                              border: "2px solid var(--color-dark, #231e25)",
                              padding: "16px 20px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 14,
                            }}
                          >
                            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 640 }}>
                              <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 17, fontWeight: 800, margin: 0 }}>
                                {s.title}
                              </h4>
                              {s.speaker && (
                                <span style={{ fontSize: 13, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "var(--color-primary, #ff3e33)" }}>
                                  Speaker: {s.speaker} {s.topic && `(${s.topic})`}
                                </span>
                              )}
                              <span style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", color: "#6b7280", fontWeight: 600 }}>
                                Time: {start} {end ? `– ${end}` : ""} - Location: {s.location || "Main Stage"}
                              </span>
                            </div>

                            {/* Session Action Controls */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {isSessionEnded ? (
                                <span
                                  style={{
                                    backgroundColor: "#fee2e2",
                                    color: "#991b1b",
                                    border: "1.5px solid #991b1b",
                                    padding: "5px 12px",
                                    borderRadius: 3,
                                    fontSize: 12,
                                    fontFamily: "'Satoshi', sans-serif",
                                    fontWeight: 800,
                                  }}
                                >
                                  Ended
                                </span>
                              ) : (
                                <>
                                  {/* Visitor */}
                                  {!user && (
                                    <button
                                      onClick={redirectToLogin}
                                      style={{
                                        backgroundColor: "#ffffff",
                                        border: "1.5px solid #000",
                                        padding: "6px 14px",
                                        borderRadius: 3,
                                        cursor: "pointer",
                                        fontFamily: "'Satoshi', sans-serif",
                                        fontSize: 12,
                                        fontWeight: 800,
                                      }}
                                    >
                                      Login to register
                                    </button>
                                  )}

                                  {/* Attendee */}
                                  {user?.role === "attendee" && (
                                    <>
                                      {isReg ? (
                                        <button
                                          onClick={() => handleCancelSession(s._id, reg._id)}
                                          disabled={isSessPending}
                                          style={{
                                            backgroundColor: "var(--color-primary, #ff3e33)",
                                            color: "#ffffff",
                                            border: "1.5px solid #000",
                                            padding: "6px 14px",
                                            borderRadius: 3,
                                            cursor: isSessPending ? "not-allowed" : "pointer",
                                            fontFamily: "'Satoshi', sans-serif",
                                            fontSize: 12,
                                            fontWeight: 800,
                                            opacity: isSessPending ? 0.6 : 1,
                                          }}
                                        >
                                          {isSessPending ? "Cancelling..." : "Cancel"}
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleRegisterSession(s._id)}
                                          disabled={isSessPending}
                                          style={{
                                            backgroundColor: "var(--color-kiwi, #abf139)",
                                            color: "#000",
                                            border: "1.5px solid #000",
                                            padding: "6px 14px",
                                            borderRadius: 3,
                                            cursor: isSessPending ? "not-allowed" : "pointer",
                                            fontFamily: "'Satoshi', sans-serif",
                                            fontSize: 12,
                                            fontWeight: 800,
                                            opacity: isSessPending ? 0.6 : 1,
                                          }}
                                        >
                                          {isSessPending ? "Registering..." : "+ Register"}
                                        </button>
                                      )}

                                      {/* Bookmark Button */}
                                      <button
                                        onClick={() => handleBookmarkSession(s._id)}
                                        disabled={isBmPending}
                                        title={isBookmarked ? "Remove Bookmark" : "Bookmark Session"}
                                        style={{
                                          backgroundColor: isBookmarked ? "var(--color-selective-yellow, #feb804)" : "#ffffff",
                                          color: "#000",
                                          border: "1.5px solid #000",
                                          padding: "6px 10px",
                                          borderRadius: 3,
                                          cursor: isBmPending ? "not-allowed" : "pointer",
                                          fontSize: 12,
                                          fontWeight: 900,
                                          whiteSpace: "nowrap",
                                          opacity: isBmPending ? 0.6 : 1,
                                        }}
                                      >
                                        {isBmPending ? "Saving..." : (isBookmarked ? "Bookmarked" : "Bookmark")}
                                      </button>
                                    </>
                                  )}

                                  {/* Admin / Exhibitor */}
                                  {user && user.role !== "attendee" && (
                                    <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280" }}>
                                      Attendee only
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* TAB 2: EXHIBITORS */}
          {activeTab === "exhibitors" && (
            <motion.div
              key="exhibitors"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              <div
                style={{
                  backgroundColor: "var(--color-light, #fff8eb)",
                  border: "2.5px solid var(--color-dark, #231e25)",
                  boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
                  padding: "16px 20px",
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                }}
              >
                <input
                  type="text"
                  placeholder="Search exhibitors by company, products, or booth..."
                  value={searchExhibitor}
                  onChange={(e) => setSearchExhibitor(e.target.value)}
                  style={{
                    flex: "1 1 240px",
                    padding: "10px 14px",
                    border: "2px solid var(--color-dark, #231e25)",
                    borderRadius: 4,
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    outline: "none",
                    backgroundColor: "#fff",
                  }}
                />

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    padding: "10px 16px",
                    border: "2px solid var(--color-dark, #231e25)",
                    borderRadius: 4,
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    backgroundColor: "#fff",
                  }}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {filteredExhibitors.length === 0 ? (
                <div style={{ backgroundColor: "#ffffff", border: "2.5px solid #000", padding: 40, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
                  No exhibitors matched your search.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
                  {filteredExhibitors.map((ex, idx) => (
                    <motion.div
                      key={ex._id || ex.id || idx}
                      whileHover={{ y: -4, boxShadow: "6px 6px 0px var(--color-dark, #231e25)" }}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "2.5px solid var(--color-dark, #231e25)",
                        boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 220,
                        position: "relative",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span
                            style={{
                              backgroundColor: ex.boothNumber ? "var(--color-primary, #ff3e33)" : "var(--color-selective-yellow, #feb804)",
                              color: ex.boothNumber ? "#fff" : "#000",
                              padding: "2px 8px",
                              borderRadius: 2,
                              fontSize: 11,
                              fontWeight: 800,
                            }}
                          >
                            {ex.boothNumber ? `BOOTH #${ex.boothNumber}` : "SPACE PENDING"}
                          </span>
                          {ex.category && (
                            <span style={{ fontSize: 11, fontWeight: 800, color: "#6b7280", textTransform: "uppercase" }}>
                              {ex.category}
                            </span>
                          )}
                        </div>

                        <h4 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "6px 0", letterSpacing: 0.5 }}>
                          {ex.company}
                        </h4>

                        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, color: "#4b5563", margin: "4px 0 12px 0", lineHeight: 1.4 }}>
                          {typeof ex.products === "object" ? JSON.stringify(ex.products) : (ex.products || ex.description || "Showcase of industry innovations.")}
                        </p>
                      </div>

                      <div style={{ borderTop: "1.5px dashed #000", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Link
                          to={`/exhibitors/${ex._id || ex.id}`}
                          style={{
                            fontFamily: "'Satoshi', sans-serif",
                            fontSize: 12,
                            fontWeight: 800,
                            color: "var(--color-dark, #231e25)",
                            textDecoration: "none",
                          }}
                        >
                          View Profile
                        </Link>

                        <button
                          onClick={() => {
                            const companyName = ex.company || "Exhibitor";
                            if (user) {
                              navigate(`/messages?to=${ex._id || ex.id}&name=${encodeURIComponent(companyName)}`);
                            } else {
                              redirectToLogin();
                            }
                          }}
                          style={{
                            backgroundColor: "var(--color-dark, #231e25)",
                            color: "#fff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: 3,
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Inquire
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: FLOOR PLAN */}
          {activeTab === "floorplan" && (
            <motion.div
              key="floorplan"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              <div
                style={{
                  backgroundColor: "var(--color-light, #fff8eb)",
                  border: "2.5px solid var(--color-dark, #231e25)",
                  boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
                  padding: "14px 20px",
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>BOOTH STATUS:</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, fontFamily: "'Satoshi', sans-serif" }}>
                  <span style={{ width: 12, height: 12, backgroundColor: "var(--color-kiwi, #abf139)", border: "1.5px solid #000" }} /> Available ({availableBooths})
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, fontFamily: "'Satoshi', sans-serif" }}>
                  <span style={{ width: 12, height: 12, backgroundColor: "var(--color-selective-yellow, #feb804)", border: "1.5px solid #000" }} /> Reserved
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, fontFamily: "'Satoshi', sans-serif" }}>
                  <span style={{ width: 12, height: 12, backgroundColor: "var(--color-primary, #ff3e33)", border: "1.5px solid #000" }} /> Booked ({bookedBooths})
                </span>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "3px solid var(--color-dark, #231e25)",
                  boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
                  padding: "24px",
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 14 }}>
                  {booths.map((b) => {
                    const bg = b.status === "available" ? "var(--color-kiwi, #abf139)" : b.status === "reserved" ? "var(--color-selective-yellow, #feb804)" : "var(--color-primary, #ff3e33)";
                    const text = b.status === "booked" ? "#ffffff" : "#000000";
                    const isSelected = selectedBooth?._id === b._id;

                    return (
                      <motion.div
                        key={b._id}
                        whileHover={{ scale: 1.05, y: -2 }}
                        onClick={() => setSelectedBooth(b)}
                        style={{
                          backgroundColor: bg,
                          color: text,
                          border: isSelected ? "3px solid #000" : "2px solid var(--color-dark, #231e25)",
                          boxShadow: isSelected ? "4px 4px 0px #000" : "2.5px 2.5px 0px var(--color-dark, #231e25)",
                          padding: "12px 8px",
                          borderRadius: 4,
                          textAlign: "center",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          minHeight: 84,
                        }}
                      >
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>{b.boothNumber}</div>
                        <div style={{ fontSize: 10, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, textTransform: "uppercase" }}>
                          {b.status}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {selectedBooth && (
                <div
                  style={{
                    backgroundColor: "var(--color-light, #fff8eb)",
                    border: "2.5px solid #000",
                    padding: 20,
                    boxShadow: "5px 5px 0px #000",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 900, backgroundColor: "#000", color: "#fff", padding: "2px 8px", borderRadius: 2 }}>
                      BOOTH DETAILS
                    </span>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: 30, margin: "6px 0 2px 0" }}>
                      BOOTH #{selectedBooth.boothNumber} ({selectedBooth.size || "3x3 m"})
                    </h4>
                    <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, margin: 0, fontWeight: 700 }}>
                      Status: <strong style={{ textTransform: "uppercase" }}>{selectedBooth.status}</strong> - Price: ${selectedBooth.price || "500"}
                      {selectedBooth.exhibitor && ` - Reserved by: ${selectedBooth.exhibitor.company || selectedBooth.exhibitor.name}`}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    {selectedBooth.status === "booked" && selectedBooth.exhibitor?._id && (
                      <Link
                        to={`/exhibitors/${selectedBooth.exhibitor._id}`}
                        style={{
                          backgroundColor: "#000",
                          color: "#fff",
                          padding: "8px 16px",
                          textDecoration: "none",
                          fontSize: 13,
                          fontWeight: 800,
                        }}
                      >
                        VIEW EXHIBITOR
                      </Link>
                    )}
                    <button
                      onClick={() => setSelectedBooth(null)}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "2px solid #000",
                        padding: "6px 14px",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: ABOUT MANIFESTO */}
          {activeTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              style={{
                backgroundColor: "#ffffff",
                border: "3px solid var(--color-dark, #231e25)",
                boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
                padding: "32px",
              }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, margin: "0 0 16px 0" }}>
                EXPO SCOPE & GUIDELINES
              </h3>
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16, lineHeight: 1.6, color: "#374151" }}>
                {expoData.description || "No description provided."}
              </p>
              <div style={{ borderTop: "2px dashed var(--color-dark, #231e25)", paddingTop: 20, marginTop: 24, display: "flex", flexDirection: "column", gap: 8, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
                <p style={{ margin: 0 }}><strong>Venue / Location:</strong> {expoData.location || "Convention Hall"}</p>
                <p style={{ margin: 0 }}><strong>Dates:</strong> {new Date(expoData.startDate).toLocaleDateString()} – {new Date(expoData.endDate).toLocaleDateString()}</p>
                {expoData.theme && <p style={{ margin: 0 }}><strong>Theme / Focus:</strong> {expoData.theme}</p>}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}