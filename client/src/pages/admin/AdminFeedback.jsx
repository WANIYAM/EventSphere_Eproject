import { useState, useEffect } from "react";
import api from "../../services/api.js";
import Loading from "../../components/Loading.jsx";

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get("/feedback");
        setFeedback(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load feedback");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  // Filter by type
  const filtered = filterType
    ? feedback.filter((f) => f.type === filterType)
    : feedback;

  return (
    <div className="admin-page-container">
      <h2>User Feedback</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Type filter */}
      <div style={{ margin: "1rem 0", display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <label style={{ fontWeight: 600 }}>Filter:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid var(--border-color)" }}
        >
          <option value="">All Types</option>
          <option value="suggestion">Suggestions</option>
          <option value="issue">Issues</option>
        </select>
        <span className="text-muted">({filtered.length} items)</span>
      </div>

      {loading ? (
        <Loading message="Loading feedback..." />
      ) : filtered.length === 0 ? (
        <div className="empty-state">No feedback submitted yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Type</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f._id}>
                  <td>
                    <strong>{f.user?.name}</strong>
                    <div className="text-muted">{f.user?.email}</div>
                  </td>
                  <td>
                    <span className={`badge badge-${f.user?.role}`}>
                      {f.user?.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${f.type === "suggestion" ? "badge-approved" : "badge-rejected"}`}>
                      {f.type === "suggestion" ? "💡 Suggestion" : "⚠️ Issue"}
                    </span>
                  </td>
                  <td style={{ maxWidth: "400px" }}>{f.message}</td>
                  <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
