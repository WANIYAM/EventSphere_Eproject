import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api.js";

import { useSocket } from "../../context/SocketContext.jsx";

const AdminBooths = () => {
  const { id: expoId } = useParams();
  const { socket } = useSocket();

  const [expo, setExpo] = useState(null);
  const [booths, setBooths] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedBooth, setSelectedBooth] = useState(null);
  const [selectedExhibitorId, setSelectedExhibitorId] = useState("");
  const [boothFormData, setBoothFormData] = useState({
    price: 500,
    size: "3x3 m",
    details: "",
    status: "available"
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expoRes, boothRes, appRes] = await Promise.all([
        api.get(`/expos/${expoId}`),
        api.get(`/expos/${expoId}/booths`),
        api.get(`/applications?expo=${expoId}&status=approved`)
      ]);

      setExpo(expoRes.data);
      setBooths(boothRes.data);
      setApprovedApplications(appRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load booth management data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [expoId]);

  useEffect(() => {
    if (!socket) return;

    const handleBoothUpdated = (data) => {
      if (data?.expoId === expoId || !data?.expoId) {
        fetchData();
      }
    };

    socket.on("booth:updated", handleBoothUpdated);

    return () => {
      socket.off("booth:updated", handleBoothUpdated);
    };
  }, [socket, expoId]);

  const handleBoothClick = (booth) => {
    setSelectedBooth(booth);
    setSelectedExhibitorId("");
    setBoothFormData({
      price: booth.price || 500,
      size: booth.size || "3x3 m",
      details: booth.details || "",
      status: booth.status || "available"
    });
    setError("");
    setSuccess("");
  };

  const handleUpdateBooth = async (e) => {
    e.preventDefault();
    if (!selectedBooth) return;

    try {
      await api.put(`/booths/${selectedBooth._id}`, boothFormData);
      setSuccess("Booth details updated!");
      fetchData();
      setSelectedBooth(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update booth");
    }
  };

  const handleAssignBooth = async () => {
    if (!selectedBooth || !selectedExhibitorId) {
      return setError("Please select an exhibitor to assign");
    }

    try {
      await api.put(`/booths/${selectedBooth._id}/assign`, {
        exhibitorId: selectedExhibitorId
      });
      setSuccess("Booth assigned successfully!");
      fetchData();
      setSelectedBooth(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign booth");
    }
  };

  const handleConfirmBooth = async () => {
    if (!selectedBooth) return;
    try {
      await api.put(`/booths/${selectedBooth._id}/confirm`);
      setSuccess("Booth reservation confirmed to booked!");
      fetchData();
      setSelectedBooth(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to confirm booth");
    }
  };

  const handleReleaseBooth = async () => {
    if (!selectedBooth) return;

    try {
      await api.put(`/booths/${selectedBooth._id}/release`);
      setSuccess("Booth released successfully!");
      fetchData();
      setSelectedBooth(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to release booth");
    }
  };

  return (
    <div className="admin-page-container">
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/admin/expos" className="btn-link">
          &larr; Back to Expos
        </Link>
      </div>

      <h2>Manage Booths - {expo?.title}</h2>
      {expo && (
        <p className="text-muted" style={{ marginBottom: "1rem" }}>
          {new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()} | {expo.location}
        </p>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Legend */}
      <div className="legend-container">
        <span className="legend-item">
          <span className="legend-color legend-available"></span> Available
        </span>
        <span className="legend-item">
          <span className="legend-color legend-reserved"></span> Reserved
        </span>
        <span className="legend-item">
          <span className="legend-color legend-booked"></span> Booked
        </span>
      </div>

      {loading ? (
        <p>Loading booth layout...</p>
      ) : booths.length === 0 ? (
        <p>No booths created for this expo.</p>
      ) : (
        <div className="booth-grid">
          {booths.map((booth) => (
            <div
              key={booth._id}
              className={`booth-box booth-${booth.status}`}
              onClick={() => handleBoothClick(booth)}
            >
              <div className="booth-number">{booth.boothNumber}</div>
              <div className="booth-price">${booth.price}</div>
              {booth.exhibitor && (
                <div className="booth-exhibitor">{booth.exhibitor.company || booth.exhibitor.name}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Booth Detail Modal / Side Panel */}
      {selectedBooth && (
        <div className="modal-overlay" onClick={() => setSelectedBooth(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booth {selectedBooth.boothNumber} Details</h3>
              <button className="close-btn" onClick={() => setSelectedBooth(null)}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p>
                Current Status: <span className={`badge badge-${selectedBooth.status}`}>{selectedBooth.status}</span>
              </p>

              {(selectedBooth.status === "booked" || selectedBooth.status === "reserved") && selectedBooth.exhibitor && (
                <div className="alert alert-info" style={{ marginTop: "1rem" }}>
                  <strong>Exhibitor:</strong> {selectedBooth.exhibitor.name} <br />
                  <strong>Company:</strong> {selectedBooth.exhibitor.company || "N/A"} <br />
                  <strong>Email:</strong> {selectedBooth.exhibitor.email}
                </div>
              )}

              {/* Edit form */}
              <form onSubmit={handleUpdateBooth} style={{ marginTop: "1rem" }}>
                <div className="form-group">
                  <label>Size</label>
                  <input
                    type="text"
                    value={boothFormData.size}
                    onChange={(e) => setBoothFormData({ ...boothFormData, size: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    value={boothFormData.price}
                    onChange={(e) => setBoothFormData({ ...boothFormData, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Details</label>
                  <textarea
                    rows="2"
                    value={boothFormData.details}
                    onChange={(e) => setBoothFormData({ ...boothFormData, details: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={boothFormData.status}
                    onChange={(e) => setBoothFormData({ ...boothFormData, status: e.target.value })}
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginBottom: "1rem" }}>
                  Save Booth Details
                </button>
              </form>

              {/* Action Buttons based on status */}
              {selectedBooth.status === "available" && (
                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
                  <h4>Assign to Exhibitor</h4>
                  <div className="form-group" style={{ marginTop: "0.5rem" }}>
                    <label>Approved Exhibitors</label>
                    <select
                      value={selectedExhibitorId}
                      onChange={(e) => setSelectedExhibitorId(e.target.value)}
                    >
                      <option value="">-- Select Approved Exhibitor --</option>
                      {approvedApplications.map((app) => (
                        <option key={app._id} value={app.exhibitor?._id}>
                          {app.exhibitor?.name} ({app.companyName || app.exhibitor?.company})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button onClick={handleAssignBooth} className="btn btn-success">
                    Assign Booth
                  </button>
                </div>
              )}

              {selectedBooth.status === "reserved" && (
                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1rem", display: "flex", gap: "1rem" }}>
                  <button onClick={handleConfirmBooth} className="btn btn-success">
                    Confirm Reservation
                  </button>
                  <button onClick={handleReleaseBooth} className="btn btn-danger">
                    Release Booth
                  </button>
                </div>
              )}

              {selectedBooth.status === "booked" && (
                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
                  <button onClick={handleReleaseBooth} className="btn btn-danger">
                    Release Booth
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooths;
