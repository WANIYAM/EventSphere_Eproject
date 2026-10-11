import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import { useSocket } from "../../context/SocketContext.jsx";

const BASE = "http://localhost:5000";

const ExpoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [expo, setExpo] = useState(null);
  const [tab, setTab] = useState("schedule");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Schedule state
  const [sessions, setSessions] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  // Exhibitors state
  const [exhibitors, setExhibitors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [catFilter, setCatFilter] = useState("");

  // Floor plan state
  const [booths, setBooths] = useState([]);

  useEffect(() => {
    const fetchExpo = async () => {
      try {
        const res = await api.get(`/expos/${id}`);
        setExpo(res.data);
      } catch (err) {
        setError(err.userMessage || "Failed to load expo details");
      } finally {
        setLoading(false);
      }
    };
    fetchExpo();
    fetchRegistrations();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    const handleBoothUpdated = (data) => {
      if (data?.expoId === id || !data?.expoId) fetchBooths();
    };
    const handleScheduleUpdated = (data) => {
      if (data?.expoId === id || !data?.expoId) fetchSessions();
    };

    socket.on("booth:updated", handleBoothUpdated);
    socket.on("schedule:updated", handleScheduleUpdated);

    return () => {
      socket.off("booth:updated", handleBoothUpdated);
      socket.off("schedule:updated", handleScheduleUpdated);
    };
  }, [socket, id]);

  const fetchRegistrations = async () => {
    try {
      const res = await api.get("/registrations/my");
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (tab === "schedule") fetchSessions();
    if (tab === "exhibitors") {
      fetchExhibitors();
      fetchCategories();
    }
    if (tab === "floorplan") fetchBooths();
  }, [tab, id]);

  const fetchSessions = async () => {
    try {
      const res = await api.get(`/expos/${id}/sessions`);
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExhibitors = async () => {
    try {
      const params = { expo: id };
      if (searchTerm) params.search = searchTerm;
      if (catFilter) params.category = catFilter;
      const res = await api.get("/exhibitors", { params });
      setExhibitors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/exhibitors/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBooths = async () => {
    try {
      const res = await api.get(`/expos/${id}/booths`);
      setBooths(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (tab === "exhibitors") fetchExhibitors();
  }, [searchTerm, catFilter]);

  const isExpoRegistered = registrations.some(
    (r) => r.type === "expo" && r.expo?._id === id && r.registered
  );

  const getSessionReg = (sessionId) =>
    registrations.find((r) => r.type === "session" && r.session?._id === sessionId);

  const handleRegisterExpo = async () => {
    setError("");
    setSuccess("");
    try {
      await api.post("/registrations", { expo: id });
      setSuccess("Successfully registered for this Expo!");
      fetchRegistrations();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Registration failed");
    }
  };

  const handleRegisterSession = async (sessionId) => {
    setError("");
    setSuccess("");
    try {
      await api.post("/registrations/session", { session: sessionId });
      setSuccess("Registered for session!");
      fetchRegistrations();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed");
    }
  };

  const handleCancelSession = async (regId) => {
    setError("");
    setSuccess("");
    try {
      await api.delete(`/registrations/${regId}`);
      setSuccess("Session registration cancelled");
      fetchRegistrations();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed");
    }
  };

  const handleBookmark = async (sessionId) => {
    setError("");
    try {
      await api.put("/registrations/bookmark", { session: sessionId });
      fetchRegistrations();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed");
    }
  };

  const groupByDay = (sessionsList) => {
    const groups = {};
    sessionsList.forEach((s) => {
      const day = new Date(s.startTime).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[day]) groups[day] = [];
      groups[day].push(s);
    });
    return groups;
  };

  if (loading) return <p style={{ padding: 40, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>Loading expo specifications...</p>;
  if (!expo) return <p style={{ padding: 40, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>Expo not found.</p>;

  const dayGroups = groupByDay(sessions);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "10px 0" }}>
      {/* Top Header Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "28px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 20,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link
            to="/attendee/expos"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 13,
              fontWeight: 800,
              color: "var(--color-dark, #231e25)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 6,
            }}
          >
            ← Back to All Expos
          </Link>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ backgroundColor: "var(--color-dark, #231e25)", color: "var(--color-light, #fff8eb)", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
              [ EXPO SPECIFICATION ]
            </span>
            {expo.theme && (
              <span style={{ backgroundColor: "var(--color-selective-yellow, #feb804)", color: "#000", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
                {expo.theme}
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(38px, 5.5vw, 56px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
            {expo.title}
          </h1>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 700, color: "#4b5563", marginTop: 4 }}>
            <span>📅 {new Date(expo.startDate).toLocaleDateString()} – {new Date(expo.endDate).toLocaleDateString()}</span>
            <span>📍 {expo.location || "Convention Hall"}</span>
          </div>
        </div>

        {/* Registration Button / Verified Badge */}
        <div>
          {isExpoRegistered ? (
            <div
              style={{
                backgroundColor: "var(--color-kiwi, #abf139)",
                color: "var(--color-dark, #231e25)",
                border: "2px solid var(--color-dark, #231e25)",
                boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
                padding: "10px 20px",
                borderRadius: 4,
                fontFamily: "var(--font-display)",
                fontSize: 20,
                letterSpacing: 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>✓</span> REGISTERED PASS
            </div>
          ) : (
            <motion.button
              onClick={handleRegisterExpo}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              style={{
                backgroundColor: "var(--color-primary, #ff3e33)",
                color: "#ffffff",
                border: "2.5px solid var(--color-dark, #231e25)",
                boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
                padding: "12px 26px",
                borderRadius: 4,
                fontFamily: "var(--font-display)",
                fontSize: 22,
                letterSpacing: 1,
                cursor: "pointer",
              }}
            >
              REGISTER FOR THIS EXPO →
            </motion.button>
          )}
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "3px 3px 0px var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "3px 3px 0px var(--color-dark, #231e25)", padding: "12px 16px", color: "#000000", fontWeight: 800, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
          ✓ {success}
        </div>
      )}

      {/* Neo-Brutalist Tabs Bar */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { id: "schedule", label: "SCHEDULE & KEYNOTES", icon: "📅" },
          { id: "exhibitors", label: "EXHIBITORS DIRECTORY", icon: "🏢" },
          { id: "floorplan", label: "INTERACTIVE FLOOR PLAN", icon: "🗺️" },
          { id: "about", label: "EXPO MANIFESTO", icon: "📄" },
        ].map((t) => {
          const isActive = tab === t.id;

          return (
            <motion.button
              key={t.id}
              onClick={() => setTab(t.id)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 1 }}
              style={{
                padding: "10px 22px",
                borderRadius: 4,
                backgroundColor: isActive ? "var(--color-dark, #231e25)" : "var(--color-light, #fff8eb)",
                color: isActive ? "var(--color-light, #fff8eb)" : "var(--color-dark, #231e25)",
                border: "2px solid var(--color-dark, #231e25)",
                boxShadow: isActive ? "4px 4px 0px var(--color-primary, #ff3e33)" : "2px 2px 0px var(--color-dark, #231e25)",
                fontFamily: "var(--font-display)",
                fontSize: 18,
                letterSpacing: 0.5,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.15s ease",
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* =========================================================
          TAB 1: SCHEDULE (Grouped by Day)
      ========================================================== */}
      {tab === "schedule" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {sessions.length === 0 ? (
            <div style={{ backgroundColor: "#ffffff", border: "2.5px solid #000", padding: 32, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
              No sessions scheduled for this expo yet.
            </div>
          ) : (
            Object.entries(dayGroups).map(([day, daySessions]) => (
              <div
                key={day}
                style={{
                  backgroundColor: "#ffffff",
                  border: "3px solid var(--color-dark, #231e25)",
                  boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
                  padding: "24px 28px",
                }}
              >
                {/* Day Header Banner */}
                <div
                  style={{
                    backgroundColor: "var(--color-dark, #231e25)",
                    color: "var(--color-light, #fff8eb)",
                    padding: "8px 16px",
                    borderRadius: 2,
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    letterSpacing: 1,
                    marginBottom: 16,
                  }}
                >
                  {day.toUpperCase()}
                </div>

                {/* Day Sessions List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {daySessions.map((s) => {
                    const reg = getSessionReg(s._id);
                    const isReg = reg?.registered;
                    const isBookmarked = reg?.bookmarked;

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
                          gap: 16,
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 650 }}>
                          <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 18, fontWeight: 800, margin: 0, color: "var(--color-dark, #231e25)" }}>
                            {s.title}
                          </h4>
                          {s.speaker && (
                            <span style={{ fontSize: 13, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "var(--color-primary, #ff3e33)" }}>
                              🎤 Speaker: {s.speaker} {s.topic && `(${s.topic})`}
                            </span>
                          )}
                          <span style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", color: "#6b7280", fontWeight: 600 }}>
                            ⏰ {new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {new Date(s.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • 📍 {s.location || "Main Stage"}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {isReg ? (
                            <button
                              onClick={() => handleCancelSession(reg._id)}
                              style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "1.5px solid #000", padding: "6px 14px", borderRadius: 3, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800 }}
                            >
                              Cancel Pass
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRegisterSession(s._id)}
                              style={{ backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", border: "1.5px solid #000", padding: "6px 14px", borderRadius: 3, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800 }}
                            >
                              + Register
                            </button>
                          )}

                          <button
                            onClick={() => handleBookmark(s._id)}
                            style={{
                              backgroundColor: isBookmarked ? "var(--color-selective-yellow, #feb804)" : "#ffffff",
                              color: "#000000",
                              border: "1.5px solid #000",
                              padding: "6px 10px",
                              borderRadius: 3,
                              cursor: "pointer",
                              fontSize: 14,
                              fontWeight: 900,
                            }}
                            title={isBookmarked ? "Remove Bookmark" : "Bookmark Session"}
                          >
                            {isBookmarked ? "★" : "☆"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* =========================================================
          TAB 2: EXHIBITORS (Search & Filter Cards)
      ========================================================== */}
      {tab === "exhibitors" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Search & Filter Bar */}
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
              placeholder="Search exhibitors by company or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
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
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {exhibitors.length === 0 ? (
            <div style={{ backgroundColor: "#ffffff", border: "2.5px solid #000", padding: 32, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
              No exhibitors match your search criteria.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              {exhibitors.map((ex) => (
                <motion.div
                  key={ex._id}
                  whileHover={{ y: -4, boxShadow: "6px 6px 0px var(--color-dark, #231e25)" }}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "2.5px solid var(--color-dark, #231e25)",
                    boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
                    padding: "20px",
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 6,
                      border: "2px solid var(--color-dark, #231e25)",
                      backgroundColor: "var(--color-light, #fff8eb)",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {ex.logo ? (
                      <img src={`${BASE}${ex.logo}`} alt={ex.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 28 }}>🏢</span>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                    <h4 style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 17, fontWeight: 800, margin: 0, color: "var(--color-dark, #231e25)" }}>
                      {ex.company || ex.name}
                    </h4>
                    {ex.category && (
                      <span style={{ width: "fit-content", backgroundColor: "var(--color-purple-mimosa, #a67eff)", color: "#fff", padding: "2px 8px", borderRadius: 2, fontSize: 10, fontWeight: 800 }}>
                        {ex.category}
                      </span>
                    )}
                    {ex.booths?.length > 0 && (
                      <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 700, color: "var(--color-primary, #ff3e33)", margin: "4px 0 0 0" }}>
                        📍 Booth: {ex.booths.join(", ")}
                      </p>
                    )}
                    <Link
                      to={`/attendee/exhibitors/${ex._id}`}
                      style={{
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: 13,
                        fontWeight: 800,
                        color: "var(--color-dark, #231e25)",
                        textDecoration: "none",
                        marginTop: 8,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      View Booth & Products →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          TAB 3: FLOOR PLAN (Interactive Booth Grid)
      ========================================================== */}
      {tab === "floorplan" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              backgroundColor: "var(--color-light, #fff8eb)",
              border: "2.5px solid var(--color-dark, #231e25)",
              boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
              padding: "14px 20px",
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>BOOTH STATUS:</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, fontFamily: "'Satoshi', sans-serif" }}>
              <span style={{ width: 12, height: 12, backgroundColor: "var(--color-kiwi, #abf139)", border: "1.5px solid #000" }} /> Available
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, fontFamily: "'Satoshi', sans-serif" }}>
              <span style={{ width: 12, height: 12, backgroundColor: "var(--color-selective-yellow, #feb804)", border: "1.5px solid #000" }} /> Reserved
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, fontFamily: "'Satoshi', sans-serif" }}>
              <span style={{ width: 12, height: 12, backgroundColor: "var(--color-primary, #ff3e33)", border: "1.5px solid #000" }} /> Booked (Click to View Exhibitor)
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 14 }}>
              {booths.map((b) => {
                const bg = b.status === "available" ? "var(--color-kiwi, #abf139)" : b.status === "reserved" ? "var(--color-selective-yellow, #feb804)" : "var(--color-primary, #ff3e33)";
                const text = b.status === "booked" ? "#ffffff" : "#000000";

                return (
                  <motion.div
                    key={b._id}
                    whileHover={{ scale: 1.05, y: -3 }}
                    onClick={() => {
                      if (b.status === "booked" && b.exhibitor?._id) {
                        navigate(`/attendee/exhibitors/${b.exhibitor._id}`);
                      }
                    }}
                    style={{
                      backgroundColor: bg,
                      color: text,
                      border: "2px solid var(--color-dark, #231e25)",
                      boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
                      padding: "12px 8px",
                      borderRadius: 4,
                      textAlign: "center",
                      cursor: b.status === "booked" ? "pointer" : "default",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: 80,
                    }}
                  >
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 24 }}>{b.boothNumber}</div>
                    {b.status === "booked" && b.exhibitor?.company && (
                      <div style={{ fontSize: 10, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {b.exhibitor.company}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 4: ABOUT MANIFESTO
      ========================================================== */}
      {tab === "about" && (
        <div
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
            {expo.description || "No description provided."}
          </p>
          <div style={{ borderTop: "2px dashed var(--color-dark, #231e25)", paddingTop: 20, marginTop: 24, display: "flex", flexDirection: "column", gap: 8, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
            <p style={{ margin: 0 }}><strong>Venue / Location:</strong> {expo.location || "TBA"}</p>
            <p style={{ margin: 0 }}><strong>Dates:</strong> {new Date(expo.startDate).toLocaleDateString()} – {new Date(expo.endDate).toLocaleDateString()}</p>
            {expo.theme && <p style={{ margin: 0 }}><strong>Theme / Focus:</strong> {expo.theme}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpoDetails;