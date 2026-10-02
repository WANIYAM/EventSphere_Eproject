import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import Loading from "../../components/Loading.jsx";

const AdminExpos = () => {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    theme: "",
    location: "",
    startDate: "",
    endDate: "",
    boothCount: 20,
    boothPrice: 500,
    boothSize: "3x3 m"
  });

  const fetchExpos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expos");
      setExpos(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load expos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      theme: "",
      location: "",
      startDate: "",
      endDate: "",
      boothCount: 20,
      boothPrice: 500,
      boothSize: "3x3 m"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      return setError("Expo Title is required.");
    }
    if (!formData.startDate) {
      return setError("Start date is required.");
    }
    if (!formData.endDate) {
      return setError("End date is required.");
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      return setError("End date cannot be before start date.");
    }

    try {
      if (editingId) {
        await api.put(`/expos/${editingId}`, formData);
        setSuccess("Expo updated successfully!");
      } else {
        await api.post("/expos", formData);
        setSuccess("Expo and booths created successfully!");
      }
      resetForm();
      fetchExpos();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (expo) => {
    setEditingId(expo._id);
    setFormData({
      title: expo.title || "",
      description: expo.description || "",
      theme: expo.theme || "",
      location: expo.location || "",
      startDate: expo.startDate ? expo.startDate.split("T")[0] : "",
      endDate: expo.endDate ? expo.endDate.split("T")[0] : "",
      boothCount: 20,
      boothPrice: 500,
      boothSize: "3x3 m"
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expo? All related booths and applications will be deleted!")) {
      setError("");
      setSuccess("");
      try {
        await api.delete(`/expos/${id}`);
        setSuccess("Expo deleted successfully!");
        fetchExpos();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete expo");
      }
    }
  };

  return (
    <div className="admin-page-container">
      <h2>Manage Expos</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Form section */}
      <div className="form-card" style={{ marginBottom: "2rem" }}>
        <h3>{editingId ? "Edit Expo" : "Create New Expo"}</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Expo Title"
            />
          </div>
          <div className="form-group">
            <label>Theme</label>
            <input
              type="text"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              placeholder="e.g. Technology & Innovation"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Hall / Convention Center"
            />
          </div>
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          {!editingId && (
            <>
              <div className="form-group">
                <label>Booth Count</label>
                <input
                  type="number"
                  name="boothCount"
                  min="1"
                  value={formData.boothCount}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Booth Price ($)</label>
                <input
                  type="number"
                  name="boothPrice"
                  min="0"
                  value={formData.boothPrice}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Booth Size</label>
                <input
                  type="text"
                  name="boothSize"
                  value={formData.boothSize}
                  onChange={handleChange}
                  placeholder="e.g. 3x3 m"
                />
              </div>
            </>
          )}

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Expo details and guidelines"
            />
          </div>

          <div className="form-actions full-width">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Expo" : "Create Expo & Generate Booths"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Expos Table */}
      <h3>Existing Expos</h3>
      {loading ? (
        <Loading message="Loading expos..." />
      ) : expos.length === 0 ? (
        <div className="empty-state">No expos created yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Dates</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expos.map((expo) => (
                <tr key={expo._id}>
                  <td>
                    <strong>{expo.title}</strong>
                    {expo.theme && <div className="text-muted">{expo.theme}</div>}
                  </td>
                  <td>
                    {new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}
                  </td>
                  <td>{expo.location || "TBA"}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/admin/expos/${expo._id}/booths`} className="btn-sm btn-info">
                        Manage Booths
                      </Link>
                      <Link to={`/admin/expos/${expo._id}/sessions`} className="btn-sm btn-secondary">
                        Sessions
                      </Link>
                      <button onClick={() => handleEdit(expo)} className="btn-sm btn-warning">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(expo._id)} className="btn-sm btn-danger">
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

export default AdminExpos;
