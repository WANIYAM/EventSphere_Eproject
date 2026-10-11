import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api.js";
import { useSocket } from "../../context/SocketContext.jsx";
import Loading from "../../components/Loading.jsx";

const AdminSessions = () => {
  const { id: expoId } = useParams();
  const { socket } = useSocket();

  const [expo, setExpo] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    topic: "",
    location: "",
    startTime: "",
    endTime: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expoRes, sessionsRes] = await Promise.all([
        api.get(`/expos/${expoId}`),
        api.get(`/expos/${expoId}/sessions`),
      ]);
      setExpo(expoRes.data);
      setSessions(sessionsRes.data);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load session data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [expoId]);

  useEffect(() => {
    if (!socket) return;
    const handleScheduleUpdated = (data) => {
      if (data?.expoId === expoId || !data?.expoId) fetchData();
    };
    socket.on("schedule:updated", handleScheduleUpdated);
    return () => socket.off("schedule:updated", handleScheduleUpdated);
  }, [socket, expoId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      speaker: "",
      topic: "",
      location: "",
      startTime: "",
      endTime: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title.trim()) return setError("Session Title is required.");
    if (!formData.startTime) return setError("Start time is required.");
    if (!formData.endTime) return setError("End time is required.");
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      return setError("End time must be after start time.");
    }

    try {
      if (editingId) {
        await api.put(`/sessions/${editingId}`, formData);
        setSuccess("Session updated successfully!");
      } else {
        await api.post("/sessions", { ...formData, expo: expoId });
        setSuccess("Session created successfully!");
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to save session");
    }
  };

  const handleEdit = (session) => {
    setEditingId(session._id);
    const formatDT = (dt) => (dt ? new Date(dt).toISOString().slice(0, 16) : "");
    setFormData({
      title: session.title || "",
      speaker: session.speaker || "",
      topic: session.topic || "",
      location: session.location || "",
      startTime: formatDT(session.startTime),
      endTime: formatDT(session.endTime),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      setError("");
      setSuccess("");
      try {
        await api.delete(`/sessions/${id}`);
        setSuccess("Session deleted successfully!");
        fetchData();
      } catch (err) {
        setError(err.userMessage || err.response?.data?.message || "Failed to delete session");
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "10px 0" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <Link
            to="/admin/expos"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 13,
              fontWeight: 800,
              color: "var(--color-dark, #231e25)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 10,
            }}
          >
            ← Back to Expos
          </Link>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ backgroundColor: "var(--color-purple-mimosa, #a67eff)", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
              [ SCHEDULE MANAGER ]
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
            EXPO SESSIONS — {expo?.title || "SCHEDULE"}
          </h1>
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

      {/* Session Form */}
      <div
        style={{
          backgroundColor: "var(--color-light, #fff8eb)",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "28px",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "0 0 20px 0" }}>
          {editingId ? "EDIT SESSION SCHEDULE" : "+ ADD NEW KEYNOTE / WORKSHOP"}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Session Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Keynote: Future of Smart Warehousing"
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Speaker Name</label>
            <input
              type="text"
              name="speaker"
              value={formData.speaker}
              onChange={handleChange}
              placeholder="e.g. Dr. Helena Vance"
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Topic / Track</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g. Supply Chain Robotics"
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Auditorium / Room</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Main Hall A"
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Start Date & Time *</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>End Date & Time *</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 12, marginTop: 8 }}>
            <button
              type="submit"
              style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "2px solid #000", boxShadow: "3px 3px 0px #000", padding: "12px 24px", fontFamily: "var(--font-display)", fontSize: 20, cursor: "pointer" }}
            >
              {editingId ? "Update Session" : "Create Session →"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{ backgroundColor: "#e5e7eb", color: "#000", border: "2px solid #000", padding: "12px 20px", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, cursor: "pointer" }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Sessions Table */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "24px",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "0 0 16px 0" }}>
          SCHEDULED SESSIONS ({sessions.length})
        </h3>

        {loading ? (
          <Loading message="Loading sessions..." />
        ) : sessions.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", fontFamily: "'Satoshi', sans-serif" }}>No sessions scheduled for this expo.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Satoshi', sans-serif", fontSize: 13 }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-dark, #231e25)", color: "#ffffff", textAlign: "left" }}>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>TITLE</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>SPEAKER & TOPIC</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>ROOM</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>TIME SCHEDULE</th>
                  <th style={{ padding: "12px 14px", border: "1.5px solid #000" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((sess) => (
                  <tr key={sess._id}>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      <strong>{sess.title}</strong>
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      <strong>{sess.speaker || "N/A"}</strong>
                      {sess.topic && <div style={{ fontSize: 11, color: "#6b7280" }}>{sess.topic}</div>}
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)", fontWeight: 700 }}>
                      {sess.location || "TBA"}
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)", fontWeight: 600 }}>
                      {new Date(sess.startTime).toLocaleString()} - <br />
                      {new Date(sess.endTime).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: "12px 14px", border: "1.5px solid var(--color-dark)" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => handleEdit(sess)}
                          style={{ backgroundColor: "var(--color-selective-yellow, #feb804)", color: "#000", border: "1.5px solid #000", padding: "4px 10px", borderRadius: 3, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(sess._id)}
                          style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "1.5px solid #000", padding: "4px 10px", borderRadius: 3, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSessions;