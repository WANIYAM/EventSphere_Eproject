import { useState, useEffect } from "react";
import api from "../../services/api.js";
import Loading from "../../components/Loading.jsx";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/applications?status=${statusFilter}` : "/applications";
      const res = await api.get(url);
      setApplications(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    setError("");
    setSuccess("");
    try {
      await api.put(`/applications/${id}/status`, { status: newStatus });
      setSuccess(`Application ${newStatus} successfully!`);
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to update application status to ${newStatus}`);
    }
  };

  return (
    <div className="admin-page-container">
      <h2>Manage Exhibitor Applications</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="filter-bar" style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="statusFilter">Filter by Status: </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: "auto", display: "inline-block", marginLeft: "0.5rem" }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <Loading message="Loading applications..." />
      ) : applications.length === 0 ? (
        <div className="empty-state">No applications found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Exhibitor</th>
                <th>Company</th>
                <th>Expo</th>
                <th>Products & Documents</th>
                <th>Status</th>
                <th>Assigned Booth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <strong>{app.exhibitor?.name}</strong>
                    <div className="text-muted">{app.exhibitor?.email}</div>
                  </td>
                  <td>{app.companyName || app.exhibitor?.company || "N/A"}</td>
                  <td>{app.expo?.title || "N/A"}</td>
                  <td>
                    <div>{app.products || "N/A"}</div>
                    {app.documents && app.documents.length > 0 && (
                      <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap", marginTop: "0.35rem" }}>
                        {app.documents.map((docPath, idx) => (
                          <a
                            key={idx}
                            href={`http://localhost:5000${docPath}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-sm btn-info"
                          >
                            Doc {idx + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge-${app.status}`}>{app.status}</span>
                  </td>
                  <td>
                    {app.booth ? (
                      <span className="badge badge-booked">Booth {app.booth.boothNumber}</span>
                    ) : (
                      <span className="text-muted">None</span>
                    )}
                  </td>
                  <td>
                    {app.status === "pending" && (
                      <div className="action-buttons">
                        <button
                          onClick={() => handleStatusUpdate(app._id, "approved")}
                          className="btn-sm btn-success"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app._id, "rejected")}
                          className="btn-sm btn-danger"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {app.status === "approved" && (
                      <button
                        onClick={() => handleStatusUpdate(app._id, "rejected")}
                        className="btn-sm btn-danger"
                      >
                        Reject
                      </button>
                    )}
                    {app.status === "rejected" && (
                      <button
                        onClick={() => handleStatusUpdate(app._id, "approved")}
                        className="btn-sm btn-success"
                      >
                        Approve
                      </button>
                    )}
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

export default AdminApplications;
