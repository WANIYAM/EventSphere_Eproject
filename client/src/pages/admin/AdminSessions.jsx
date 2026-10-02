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
    endTime: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expoRes, sessionsRes] = await Promise.all([
        api.get(`/expos/${expoId}`),
        api.get(`/expos/${expoId}/sessions`)
      ]);
      setExpo(expoRes.data);
      setSessions(sessionsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load session data");
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
      if (data?.expoId === expoId || !data?.expoId) {
        fetchData();
      }
    };

    socket.on("schedule:updated", handleScheduleUpdated);

    return () => {
      socket.off("schedule:updated", handleScheduleUpdated);
    };
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
      endTime: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      return setError("Session Title is required.");
    }
    if (!formData.startTime) {
      return setError("Start time is required.");
    }
    if (!formData.endTime) {
      return setError("End time is required.");
    }

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
      setError(err.response?.data?.message || "Failed to save session");
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
      endTime: formatDT(session.endTime)
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
        setError(err.response?.data?.message || "Failed to delete session");
      }
    }
  };

  return (
    <div className="admin-page-container">
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/admin/expos" className="btn-link">
          &larr; Back to Expos
        </Link>
      </div>

      <h2>Manage Sessions - {expo?.title}</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Form */}
      <div className="form-card" style={{ marginBottom: "2rem" }}>
        <h3>{editingId ? "Edit Session" : "Create New Session"}</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Session Title"
            />
          </div>
          <div className="form-group">
            <label>Speaker</label>
            <input
              type="text"
              name="speaker"
              value={formData.speaker}
              onChange={handleChange}
              placeholder="Speaker Name"
            />
          </div>
          <div className="form-group">
            <label>Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="Key Topic"
            />
          </div>
          <div className="form-group">
            <label>Location / Room</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Auditorium A"
            />
          </div>
          <div className="form-group">
            <label>Start Time *</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>End Time *</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions full-width">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Session" : "Create Session"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <h3>Scheduled Sessions</h3>
      {loading ? (
        <Loading message="Loading sessions..." />
      ) : sessions.length === 0 ? (
        <div className="empty-state">No sessions scheduled for this expo.</div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Speaker / Topic</th>
                <th>Location</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((sess) => (
                <tr key={sess._id}>
                  <td>
                    <strong>{sess.title}</strong>
                  </td>
                  <td>
                    {sess.speaker || "N/A"}
                    {sess.topic && <div className="text-muted">{sess.topic}</div>}
                  </td>
                  <td>{sess.location || "TBA"}</td>
                  <td>
                    {new Date(sess.startTime).toLocaleString()} - <br />
                    {new Date(sess.endTime).toLocaleTimeString()}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(sess)} className="btn-sm btn-warning">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(sess._id)} className="btn-sm btn-danger">
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
  );
};

export default AdminSessions;
