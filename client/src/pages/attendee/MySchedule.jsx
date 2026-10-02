import { useState, useEffect } from "react";
import api from "../../services/api.js";

import { useSocket } from "../../context/SocketContext.jsx";

const MySchedule = () => {
  const { socket } = useSocket();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/registrations/my");
      setRegistrations(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleScheduleUpdated = () => {
      fetchRegistrations();
    };

    socket.on("schedule:updated", handleScheduleUpdated);

    return () => {
      socket.off("schedule:updated", handleScheduleUpdated);
    };
  }, [socket]);

  // Split registrations
  const expoRegs = registrations.filter((r) => r.type === "expo" && r.registered);
  const sessionRegs = registrations
    .filter((r) => r.type === "session" && r.registered)
    .sort((a, b) => new Date(a.session?.startTime) - new Date(b.session?.startTime));
  const bookmarks = registrations
    .filter((r) => r.type === "session" && r.bookmarked)
    .sort((a, b) => new Date(a.session?.startTime) - new Date(b.session?.startTime));

  const handleCancel = async (regId) => {
    setError(""); setSuccess("");
    try {
      await api.delete(`/registrations/${regId}`);
      setSuccess("Registration cancelled");
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    }
  };

  const handleRemoveBookmark = async (sessionId) => {
    setError("");
    try {
      await api.put("/registrations/bookmark", { session: sessionId });
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading schedule...</p>;

  return (
    <div className="dashboard-container">
      <h2>My Schedule</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Registered Expos */}
      <h3 style={{ marginTop: "1.5rem" }}>Registered Expos</h3>
      {expoRegs.length === 0 ? (
        <p className="text-muted" style={{ marginTop: "0.5rem" }}>No expo registrations yet. <a href="/attendee/expos">Browse expos</a></p>
      ) : (
        <div className="app-cards-list" style={{ marginTop: "0.5rem" }}>
          {expoRegs.map((r) => (
            <div key={r._id} className="app-card">
              <div className="app-card-header">
                <h4>{r.expo?.title || "Expo"}</h4>
                <button onClick={() => handleCancel(r._id)} className="btn-sm btn-danger">
                  Cancel
                </button>
              </div>
              <p className="text-muted">
                📅 {r.expo?.startDate && new Date(r.expo.startDate).toLocaleDateString()} – {r.expo?.endDate && new Date(r.expo.endDate).toLocaleDateString()}
                {r.expo?.location && <span> · 📍 {r.expo.location}</span>}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Registered Sessions */}
      <h3 style={{ marginTop: "1.5rem" }}>Registered Sessions</h3>
      {sessionRegs.length === 0 ? (
        <p className="text-muted" style={{ marginTop: "0.5rem" }}>No session registrations yet.</p>
      ) : (
        <div className="app-cards-list" style={{ marginTop: "0.5rem" }}>
          {sessionRegs.map((r) => (
            <div key={r._id} className="session-card">
              <div className="session-card-header">
                <div>
                  <strong>{r.session?.title || "Session"}</strong>
                  {r.session?.speaker && <span className="text-muted"> — {r.session.speaker}</span>}
                </div>
                <button onClick={() => handleCancel(r._id)} className="btn-sm btn-danger">
                  Cancel
                </button>
              </div>
              <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                🕐 {r.session?.startTime && new Date(r.session.startTime).toLocaleString()}
                {r.session?.location && <span> · 📍 {r.session.location}</span>}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Bookmarked Sessions */}
      <h3 style={{ marginTop: "1.5rem" }}>★ Bookmarked Sessions</h3>
      {bookmarks.length === 0 ? (
        <p className="text-muted" style={{ marginTop: "0.5rem" }}>No bookmarked sessions.</p>
      ) : (
        <div className="app-cards-list" style={{ marginTop: "0.5rem" }}>
          {bookmarks.map((r) => (
            <div key={r._id} className="session-card">
              <div className="session-card-header">
                <div>
                  <strong>{r.session?.title || "Session"}</strong>
                  {r.session?.speaker && <span className="text-muted"> — {r.session.speaker}</span>}
                </div>
                <button
                  onClick={() => handleRemoveBookmark(r.session?._id)}
                  className="btn-bookmark active"
                  title="Remove bookmark"
                >
                  ★
                </button>
              </div>
              <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                🕐 {r.session?.startTime && new Date(r.session.startTime).toLocaleString()}
                {r.session?.location && <span> · 📍 {r.session.location}</span>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySchedule;
