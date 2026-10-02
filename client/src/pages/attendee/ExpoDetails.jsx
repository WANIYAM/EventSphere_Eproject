import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api.js";

import { useSocket } from "../../context/SocketContext.jsx";

const BASE = "http://localhost:5000";

const ExpoDetails = () => {
  const { id } = useParams();
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
        setError("Failed to load expo details");
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
      if (data?.expoId === id || !data?.expoId) {
        fetchBooths();
      }
    };

    const handleScheduleUpdated = (data) => {
      if (data?.expoId === id || !data?.expoId) {
        fetchSessions();
      }
    };

    socket.on("booth:updated", handleBoothUpdated);
    socket.on("schedule:updated", handleScheduleUpdated);

    return () => {
      socket.off("booth:updated", handleBoothUpdated);
      socket.off("schedule:updated", handleScheduleUpdated);
    };
  }, [socket, id]);

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      const res = await api.get("/registrations/my");
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch when tab changes
  useEffect(() => {
    if (tab === "schedule") fetchSessions();
    if (tab === "exhibitors") { fetchExhibitors(); fetchCategories(); }
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

  // Re-fetch exhibitors when search or category changes
  useEffect(() => {
    if (tab === "exhibitors") fetchExhibitors();
  }, [searchTerm, catFilter]);

  // Registration helpers
  const isExpoRegistered = registrations.some(
    (r) => r.type === "expo" && r.expo?._id === id && r.registered
  );

  const getSessionReg = (sessionId) =>
    registrations.find((r) => r.type === "session" && r.session?._id === sessionId);

  const handleRegisterExpo = async () => {
    setError(""); setSuccess("");
    try {
      await api.post("/registrations", { expo: id });
      setSuccess("Registered for expo!");
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    }
  };

  const handleRegisterSession = async (sessionId) => {
    setError(""); setSuccess("");
    try {
      await api.post("/registrations/session", { session: sessionId });
      setSuccess("Registered for session!");
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    }
  };

  const handleCancelSession = async (regId) => {
    setError(""); setSuccess("");
    try {
      await api.delete(`/registrations/${regId}`);
      setSuccess("Session registration cancelled");
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    }
  };

  const handleBookmark = async (sessionId) => {
    setError("");
    try {
      await api.put("/registrations/bookmark", { session: sessionId });
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    }
  };

  // Group sessions by day
  const groupByDay = (sessions) => {
    const groups = {};
    sessions.forEach((s) => {
      const day = new Date(s.startTime).toLocaleDateString(undefined, {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
      });
      if (!groups[day]) groups[day] = [];
      groups[day].push(s);
    });
    return groups;
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;
  if (!expo) return <p style={{ padding: "2rem" }}>Expo not found.</p>;

  const dayGroups = groupByDay(sessions);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/attendee/expos" className="btn-link">← Back to Expos</Link>
      </div>
      <h2>{expo.title}</h2>
      {expo.theme && <div className="expo-theme">{expo.theme}</div>}
      <div className="expo-meta" style={{ marginBottom: "1rem" }}>
        <p>📅 {new Date(expo.startDate).toLocaleDateString()} – {new Date(expo.endDate).toLocaleDateString()}</p>
        <p>📍 {expo.location || "TBA"}</p>
      </div>
      {isExpoRegistered ? (
        <span className="badge badge-approved" style={{ marginBottom: "1rem", display: "inline-block" }}>✓ Registered</span>
      ) : (
        <button onClick={handleRegisterExpo} className="btn btn-success" style={{ marginBottom: "1rem" }}>
          Register for this Expo
        </button>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Tabs */}
      <div className="tab-bar" style={{ margin: "1rem 0" }}>
        {["schedule", "exhibitors", "floorplan", "about"].map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "schedule" ? "Schedule" : t === "exhibitors" ? "Exhibitors" : t === "floorplan" ? "Floor Plan" : "About"}
          </button>
        ))}
      </div>

      {/* Schedule Tab */}
      {tab === "schedule" && (
        <div>
          {sessions.length === 0 ? (
            <p className="text-muted">No sessions scheduled yet.</p>
          ) : (
            Object.entries(dayGroups).map(([day, daySessions]) => (
              <div key={day} style={{ marginBottom: "1.5rem" }}>
                <h4 className="schedule-day-header">{day}</h4>
                {daySessions.map((s) => {
                  const reg = getSessionReg(s._id);
                  const isReg = reg?.registered;
                  const isBookmarked = reg?.bookmarked;

                  return (
                    <div key={s._id} className="session-card">
                      <div className="session-card-header">
                        <div>
                          <strong>{s.title}</strong>
                          {s.speaker && <span className="text-muted"> — {s.speaker}</span>}
                        </div>
                        <div className="action-buttons">
                          {isReg ? (
                            <button onClick={() => handleCancelSession(reg._id)} className="btn-sm btn-danger">
                              Cancel
                            </button>
                          ) : (
                            <button onClick={() => handleRegisterSession(s._id)} className="btn-sm btn-success">
                              Register
                            </button>
                          )}
                          <button
                            onClick={() => handleBookmark(s._id)}
                            className={`btn-bookmark ${isBookmarked ? "active" : ""}`}
                            title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                          >
                            {isBookmarked ? "★" : "☆"}
                          </button>
                        </div>
                      </div>
                      <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                        🕐 {new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {new Date(s.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {s.location && <span> · 📍 {s.location}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}

      {/* Exhibitors Tab */}
      {tab === "exhibitors" && (
        <div>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Search exhibitors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid var(--border-color)", flex: "1", minWidth: "200px" }}
            />
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid var(--border-color)" }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {exhibitors.length === 0 ? (
            <p className="text-muted">No exhibitors found.</p>
          ) : (
            <div className="exhibitor-cards-grid">
              {exhibitors.map((ex) => (
                <div key={ex._id} className="exhibitor-card">
                  <div className="exhibitor-card-logo">
                    {ex.logo ? (
                      <img src={`${BASE}${ex.logo}`} alt={ex.company} />
                    ) : (
                      <div className="logo-placeholder">🏢</div>
                    )}
                  </div>
                  <div className="exhibitor-card-body">
                    <h4>{ex.company || ex.name}</h4>
                    {ex.category && <span className="badge badge-exhibitor">{ex.category}</span>}
                    {ex.booths?.length > 0 && (
                      <p className="text-muted" style={{ marginTop: "0.5rem" }}>
                        Booth: {ex.booths.join(", ")}
                      </p>
                    )}
                    <Link
                      to={`/attendee/exhibitors/${ex._id}`}
                      className="btn-link"
                      style={{ marginTop: "0.5rem", display: "inline-block" }}
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floor Plan Tab */}
      {tab === "floorplan" && (
        <div>
          <div className="legend-container">
            <div className="legend-item"><div className="legend-color legend-available" /><span>Available</span></div>
            <div className="legend-item"><div className="legend-color legend-reserved" /><span>Reserved</span></div>
            <div className="legend-item"><div className="legend-color legend-booked" /><span>Booked</span></div>
          </div>
          <div className="booth-grid">
            {booths.map((b) => (
              <div
                key={b._id}
                className={`booth-box booth-${b.status}`}
                onClick={() => {
                  if (b.status === "booked" && b.exhibitor?._id) {
                    window.location.href = `/attendee/exhibitors/${b.exhibitor._id}`;
                  }
                }}
                style={{ cursor: b.status === "booked" ? "pointer" : "default" }}
              >
                <div className="booth-number">{b.boothNumber}</div>
                {b.status === "booked" && b.exhibitor?.company && (
                  <div className="booth-exhibitor">{b.exhibitor.company}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About Tab */}
      {tab === "about" && (
        <div className="form-card">
          <h3>About this Expo</h3>
          <p style={{ marginTop: "1rem" }}>{expo.description || "No description provided."}</p>
          <div style={{ marginTop: "1rem" }}>
            <p><strong>Location:</strong> {expo.location || "TBA"}</p>
            <p><strong>Dates:</strong> {new Date(expo.startDate).toLocaleDateString()} – {new Date(expo.endDate).toLocaleDateString()}</p>
            {expo.theme && <p><strong>Theme:</strong> {expo.theme}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpoDetails;
